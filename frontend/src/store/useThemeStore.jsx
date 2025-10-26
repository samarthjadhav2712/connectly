import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme : localStorage.getItem("connectly-theme")|| "light",
    setTheme : (theme)=>{
        localStorage.setItem('connectly-theme' , theme);
        set({theme})
    },
}));