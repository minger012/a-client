
export const getLang = ()=>{
    return localStorage.getItem("lang") || (window as any).DEFAULT_LANG;
}