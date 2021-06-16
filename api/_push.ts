import * as WebPush from "web-push"

import { Patch, PushEventPatch, PushSubscription } from "../src/types"

import { Logger } from "./_logger"
import { startTask } from "./_sentry"
import { handleSendErrors, supabase } from "./_supabase"

WebPush.setGCMAPIKey(process.env.GCM_API_KEY as string)
WebPush.setVapidDetails(
  "mailto:adam@haglund.dev",
  process.env.VITE_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
)

export const sendNotification = async (patch: Patch) => {
  const sendingTask = startTask("sendNotifications")

  const { data } = await supabase
    .from<PushSubscription>("subscriptions")
    .select()
    .eq("environment", process.env.VERCEL_ENV as string)

  const results = await Promise.allSettled([
    ...data!.map(async ({ endpoint, auth, p256dh }) => {
      const patchData: PushEventPatch = {
        type: "patch",
        ...patch,
      }

      return WebPush.sendNotification(
        {
          endpoint,
          keys: { auth, p256dh },
        },
        JSON.stringify(patchData),
      )
    }),
    ...Array.from({ length: 20 }).map(
      (_, i) => new Promise((resolve) => setTimeout(resolve, (i + 1) * 1000)),
    ),
  ])

  const successful = results.filter(
    (result): result is PromiseFulfilledResult<WebPush.SendResult> =>
      result.status === "fulfilled",
  )
  const failed = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  )

  sendingTask.finish()

  const handlingTask = startTask("handleNotificationErrors")

  Logger.info(
    `Tried to send ${results.length} notifications. (OK: ${successful.length}, FAIL: ${failed.length})`,
  )
  if (failed.length > 0) {
    await handleSendErrors(failed.map((result) => result.reason))
  }

  handlingTask.finish()
}
