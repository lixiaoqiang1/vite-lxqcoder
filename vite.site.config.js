import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./", // 相对路径，便于部署
  build: {
    outDir: "docs", // 网站打包输出到 docs 目录（可改为 dist-site 或其他）
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      },
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'bytecoder-ui': resolve(__dirname, 'src/components/bytecoderUI')
    },
  },
  server: {
    port: 3000,
    open: true
  }
});