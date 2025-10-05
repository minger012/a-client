// src/plugins/i18n.ts
import { createI18n } from "vue-i18n";
import { getLang } from "@/utils";
import zh_cn from "@/lang/zh-cn";
import zh_tw from "@/lang/zh-tw";
import en_us from "@/lang/en-us";
import es_es from "@/lang/es-es";
import th_th from "@/lang/th-th";
const messages = {
  "zh-cn": zh_cn,
  "zh-tw": zh_tw,
  "en-us": en_us,
  "es-es": es_es,
  "th-th": th_th,
};
const lang = getLang();
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: lang,
  fallbackLocale: "en-us", // 回退语言
  messages,
});

export function updateI18nLanguage(lang: string) {
  localStorage.setItem("lang", lang);
  document.body.classList.add(lang);
  i18n.global.locale.value = lang;
}

export default i18n;
