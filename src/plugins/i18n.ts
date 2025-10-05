// src/plugins/i18n.ts
import { createI18n } from "vue-i18n";
import { getLang } from "@/utils";
import zh_cn from "@/lang/zh-cn";
import ja_ja from "@/lang/ja-ja";
import en_us from "@/lang/en-us";
import zh_tw from "@/lang/zh-tw";
import ko_ko from "@/lang/ko-ko";
import vi_vi from "@/lang/vi-vi";
const messages = {
  "zh-cn": zh_cn,
  "ja-ja": ja_ja,
  "en-us": en_us,
  "zh-tw": zh_tw,
  "ko-ko": ko_ko,
  "vi-vi": vi_vi,
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
