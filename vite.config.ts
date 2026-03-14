import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import * as sass from "sass";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@config": resolve(__dirname, "./src/config"),
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern",
        importers: [new sass.NodePackageImporter()],
      },
      scss: {
        api: "modern",
        importers: [new sass.NodePackageImporter()],
      },
    },
  },
});
