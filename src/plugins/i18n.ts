// src/plugins/i18n.ts
import { createI18n } from "vue-i18n";
import { getLang } from "@/utils";
import { Locale } from "vant";

// 引入i18语言包
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

// 引入vant语言包
import zhCN from "vant/es/locale/lang/zh-CN";
import jaJP from "vant/es/locale/lang/ja-JP";
import enUS from "vant/es/locale/lang/en-US";
import zhTW from "vant/es/locale/lang/zh-TW";
import koKR from "vant/es/locale/lang/ko-KR";
import viVN from "vant/es/locale/lang/vi-VN";
const vant_messages = {
  "zh-cn": zhCN,
  "ja-ja": jaJP,
  "en-us": enUS,
  "zh-tw": zhTW,
  "ko-ko": koKR,
  "vi-vi": viVN,
};
const vant_messages_name = {
  "zh-cn": "zh-CN",
  "ja-ja": "ja-JP",
  "en-us": "en-US",
  "zh-tw": "zh-TW",
  "ko-ko": "ko-KR",
  "vi-vi": "vi-VN",
};
Locale.use((vant_messages_name as any)[lang], (vant_messages as any)[lang]);
export function updateI18nLanguage(lang: string) {
  // 切换i18
  localStorage.setItem("lang", lang);
  document.body.classList.add(lang);
  i18n.global.locale.value = lang;
  // 切换vant
  Locale.use((vant_messages_name as any)[lang], (vant_messages as any)[lang]);
}

export default i18n;
