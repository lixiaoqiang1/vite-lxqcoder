## vite.config.js
```
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// 检查是否是库构建模式
const isLibBuild = process.env.BUILD_MODE === 'lib';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // 基础配置
  const baseConfig = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };

  // 如果是库构建模式
  if (isLibBuild) {
    return {
      ...baseConfig,
      build: {
        outDir: "dist",
        lib: {
          entry: path.resolve(__dirname, "./src/components/bytecoderUI/index.js"),
          name: "bytecoderUI",
          fileName: (format) => {
            if (format === 'es') return 'bytecoder-ui.esm.js';
            if (format === 'cjs') return 'bytecoder-ui.cjs.js';
            if (format === 'umd') return 'bytecoder-ui.umd.js';
            return `bytecoder-ui.${format}.js`;
          },
          formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
          external: ["vue", "element-plus"],
          output: {
            globals: {
              vue: "Vue",
              "element-plus": "ElementPlus",
            },
            exports: 'named',
          },
        },
        sourcemap: true,
      },
    };
  }

  // 网页项目开发模式
  return {
    ...baseConfig,
    base: env.VITE_PUBLIC_PATH || '/',
    build: {
      outDir: "dist",
      sourcemap: mode !== 'production',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      host: true,
    },
  };
});
```
## App.vue
```
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
        
```
## main.js
```
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import bytecoder from "./components/bytecoderUI"; //导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);
app.use(bytecoder); //注册
app.use(ElementPlus)
app.mount("#app");
```

```
```

```
```