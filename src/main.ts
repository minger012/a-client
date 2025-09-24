import { createApp } from "vue";
import { createPinia } from "pinia";
//pinia持久化工具
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
// 引入组件样式
// import 'vant/lib/index.css';//有自动引入所以不用全局
import "./assets/css/main.scss"; //tailwind
// 多语言
import i18n from "./plugins/i18n";
const app = createApp(App);

app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(i18n);
app.mount("#app");
