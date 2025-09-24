/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 必须包含所有 Vue 文件路径
  ],
  theme: {
    extend: {
      colors: {
        primary:"#166fe5",
        green: {
          1: "#26bcc6",
        },
        blue: {
          base: "#3c9bff",
        },
      },
      fontSize: {
        xs: "11px",
        10: "0.625rem",//10px
        13: "0.8125rem",//13px
      },
      padding : {
        3.5:'0.9375rem'//15px
      },
      width:{
        52:'3.25rem',
        346:'21.625rem'
      },
      height:{
        52:'3.25rem',
        200:'12.5rem'
      }
    },
  },
  plugins: [],
};
