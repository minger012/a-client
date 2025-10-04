import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; //@解析根目录
//vant自动加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: process.env.VITE_APP_BASE || "/",
    plugins: [
      vue(),
      //vant自动加载
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    //@解析根目录
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: "0.0.0.0",
      proxy: {
        "/home": {
          target: "http://137.175.102.158:3001",
          //target: "http://127.0.0.1:8000",
          changeOrigin: true,
        },
        "/upload": {
          target: "http://137.175.102.158:3001",
          changeOrigin: true,
        },
      },
    },
  };
});
