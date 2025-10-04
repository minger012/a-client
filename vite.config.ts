import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; //@解析根目录
//vant自动加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_APP_BASE || "/",
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
          target: env.VITE_APP_domain,
          changeOrigin: true,
        },
        "/upload": {
          target: env.VITE_APP_domain,
          changeOrigin: true,
        },
      },
    },
  };
});
