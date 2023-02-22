/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { readFileSync } from "fs"

import type SecurityModule from "nuxt-security"
import { defineNuxtConfig } from "nuxt/config"

import type { ModuleOptions, NuxtModule } from "@nuxt/schema"

type GetOptions<T> = T extends NuxtModule<infer O> ? O : ModuleOptions

declare module "@nuxt/schema" {
  interface NuxtConfig {
    security?: Partial<GetOptions<typeof SecurityModule>>
  }
}

const env = process.env.VERCEL_ENV as "production" | "development" | undefined

const baseCss = readFileSync("./assets/base.css", "utf8")

export default defineNuxtConfig({
  nitro: { preset: "vercel" },

  runtimeConfig: {
    vapidPrivateKey: "",
    gcmApiKey: "",
    checkToken: "",
    discordClientId: "",
    discordClientSecret: "",

    public: {
      env,
      PROD: env === "production",
      DEV: env === "development",

      apiUrl: "http://localhost:3000",
      sentryDsn:
        "https://e4f5998ed2e349b985f2150cba13550e@o524049.ingest.sentry.io/5721085",
      fathomSiteId: "FVADOKGJ",
      vapidPublicKey:
        "BMxxkM7nyik9wtBsK6wVnHxfsOgPVsA05QmW3AE5M8bPAVoAV9LGX3i26p-mZkDJd7zj7iZufOPdI7Cpd2IYs1M",
    },
  },

  modules: [
    "nuxt-icon",
    "nuxt-security",
    "nuxt-windicss",
    "@morev/vue-transitions/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxtjs/supabase",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
  ],

  sourcemap: true,
  vite: {
    envPrefix: ["VITE_", "VERCEL_"],
  },

  app: {
    head: {
      title: "Is the Patch Out Yet?",
      meta: [{ name: "theme-color", content: "#111111" }],
      link: [
        { rel: "preconnect", href: process.env.SUPABASE_URL },
        { rel: "preload", href: "/background.svg", as: "image" },
        {
          rel: "preload",
          href: "/fonts/Rubik-Regular.woff2",
          as: "font",
          type: "font/woff2",
        },
        {
          rel: "preload",
          href: "/fonts/Radiance-SemiBold.woff2",
          as: "font",
          type: "font/woff2",
        },
      ],
      htmlAttrs: { lang: "en" },
      style: [
        {
          children: baseCss,
        },
      ],
    },
  },

  experimental: {
    emitRouteChunkError: "reload",
  },
  pwa: {
    registerType: "autoUpdate",
    strategies: "injectManifest",
    srcDir: "sw",
    filename: "sw.ts",
    base: "/",
    registerWebManifestInRouteRules: true,
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    injectRegister: false,
    includeManifestIcons: false,
    injectManifest: {
      globPatterns: ["**/*.{png,svg,ico}"],
      globIgnores: ["manifest**.webmanifest"],
    },
    manifest: {
      name: "Is the Patch Out?",
      short_name: "isthepatchout",
      ["gcm_sender_id" as any]: process.env.NUXT_PUBLIC_VAPID_PUBLIC_KEY as string,
      background_color: "#111",
      theme_color: "#111",
      display: "standalone",
      orientation: "portrait",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
  security: {
    headers: {
      xXSSProtection: false,
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    },
    rateLimiter: {
      value: {
        interval: "minute",
        tokensPerInterval: 60,
      },
      route: "",
    },
  },
  googleFonts: {
    preconnect: true,
    prefetch: true,
    families: {
      Rubik: [400],
    },
  },
  fontMetrics: {
    fonts: ["Rubik", { family: "Radiance", src: "fonts/Radiance-SemiBold.woff2" }],
    fallbacks: ["Helvetica"],
  },
  typescript: {
    strict: true,
    shim: false,
  },
})

// VitePWA({
//   strategies: "injectManifest",
//   srcDir: "src/sw",
//   filename: "sw.ts",
//   base: "/",
//   manifest: {
//     name: "Is the Patch Out?",
//     short_name: "isthepatchout",
//     ["gcm_sender_id" as any]: process.env.VITE_VAPID_PUBLIC_KEY as string,
//     background_color: "#111",
//     theme_color: "#111",
//     icons: [
//       {
//         src: "/android-chrome-144x144.png?v=3",
//         sizes: "144x144",
//         type: "image/png",
//       },
//       {
//         src: "/android-chrome-192x192.png?v=3",
//         sizes: "192x192",
//         type: "image/png",
//       },
//       {
//         src: "/android-chrome-512x512.png?v=3",
//         sizes: "512x512",
//         type: "image/png",
//       },
//     ],
//     display: "standalone",
//     orientation: "portrait",
//   },
// }),
