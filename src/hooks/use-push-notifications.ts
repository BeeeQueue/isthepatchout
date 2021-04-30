import { ref, watch } from "vue"

import { useId } from "./use-id"
import { useServiceWorker } from "./use-service-worker"

const id = useId()
const loading = ref(true)

const supported =
  "Notification" in window &&
  "showNotification" in ServiceWorkerRegistration.prototype &&
  "PushManager" in window

const permissionsGranted = ref(Notification.permission === "granted")

const askForPermissions = async () => {
  const result = await Notification.requestPermission()

  if (result === "granted") {
    permissionsGranted.value = true
  }
}

const { registration, applicationServerKey } = useServiceWorker()
const subscription = ref<PushSubscription | null>(null)
const subscribed = ref(false)

const registerNewSubscription = async () => {
  const subscriptionData = JSON.parse(JSON.stringify(subscription.value))

  await fetch(`${import.meta.env.VITE_API_URL as string}/api/subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...subscriptionData,
      id: id.value,
    }),
  })
}

watch(
  registration,
  () => {
    if (import.meta.env.PROD && registration.value == null) return

    loading.value = false
  },
  { immediate: true },
)

watch([permissionsGranted, registration], async () => {
  if (!permissionsGranted.value || registration.value == null) return

  subscription.value = await registration.value.pushManager.getSubscription()

  if (subscription.value != null) {
    subscribed.value = true
    return
  }

  subscription.value = await registration.value.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  })

  await registerNewSubscription()

  subscribed.value = true
})

export const usePushNotifications = () => ({
  supported,
  loading,
  subscribed,
  askForPermissions,
})