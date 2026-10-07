import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  // compiles .vue single-file components so component tests can mount them
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: false
  },
  resolve: {
    alias: [
      // unplugin-icons only exists in the app build; component tests get an inert icon
      {
        find: /^~icons\/.*$/,
        replacement: path.resolve(__dirname, "src/test-support/icon-stub.ts")
      },
      { find: "@", replacement: path.resolve(__dirname, "src") }
    ]
  }
});
