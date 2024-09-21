import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as sass from "sass";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css:{
    preprocessorOptions:{
      sass:{
        api:"modern",
        importers: [
          new sass.NodePackageImporter()
        ]
      },
      scss: {
        api: "modern",
        importers: [
          new sass.NodePackageImporter()
        ]
      },
    }
  }
})
