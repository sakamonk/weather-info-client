import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {},
    },
  },
  test: {
    globals: true, // enable global expect
    environment: "jsdom", // simulate a browser environment
    setupFiles: "./tests/setupTests.ts",
    reporters: "verbose",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  server: {
    port: 4000,
  },
});
