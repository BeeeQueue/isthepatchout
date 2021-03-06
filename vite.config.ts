import { config } from "dotenv"
import browserslist from "browserslist"
import { esbuildPluginBrowserslist } from "esbuild-plugin-browserslist"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, Plugin } from "vite"
import Checker from "vite-plugin-checker"
import WindiCSS from "vite-plugin-windicss"
import { VitePWA } from "vite-plugin-pwa"
import Vue from "@vitejs/plugin-vue"

config()

const s = JSON.stringify

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
  },
  define: {
    "import.meta.env.SENTRY_DSN": s(process.env.SENTRY_DSN),
    "import.meta.env.VERCEL_ENV": s(process.env.VERCEL_ENV),
    "import.meta.env.VERCEL_GIT_COMMIT_SHA": s(process.env.VERCEL_GIT_COMMIT_SHA),
  },
  resolve: {
    alias: {
      "@ivanv/vue-collapse-transition":
        "@ivanv/vue-collapse-transition/src/CollapseTransition.vue",
    },
  },
  plugins: [
    esbuildPluginBrowserslist(browserslist()),
    Vue(),
    WindiCSS(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "sw.ts",
      base: "/",
      manifest: {
        name: "Is the Patch Out?",
        short_name: "isthepatchout",
        ["gcm_sender_id" as any]: process.env.VITE_VAPID_PUBLIC_KEY as string,
        background_color: "#111",
        theme_color: "#111",
        icons: [
          {
            src: "/android-chrome-144x144.png?v=3",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/android-chrome-192x192.png?v=3",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png?v=3",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        display: "standalone",
        orientation: "portrait",
      },
    }),
    Checker({ vueTsc: true, enableBuild: mode === "development" }),
    process.argv.includes("--analyze") &&
      (visualizer({
        open: true,
        brotliSize: true,
      }) as unknown as Plugin),
  ],
}))
