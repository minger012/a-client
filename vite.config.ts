import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; //@解析根目录
//vant自动加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: "/",
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
          target: "http://107.148.41.97:12123",
          changeOrigin: true,
        },
        "/upload": {
          target: "http://107.148.41.97:12123",
          changeOrigin: true,
        },
      },
    },
  };
});
