import {defineStore} from "pinia";

export const useThemeStore = defineStore('theme', {
    state: () => {
        return {
            dark: false,
            header: {
                className: 'bg-transparent text-black',
            },
            // 背景图片
            backgroundImg: {
                opacity: 1,
                file: 'http://localhost:5173/src/adman/assets/wallhaven-4o3pv9.jpg'
            },
        }
    },
    persist: true,
    getters: {},
    actions: {
        // 切换 light 主题
        setTheme(flag: boolean) {
            let elementsByName = document.getElementById('html');
            this.dark = flag;
            if (flag) {
                // 深色
                elementsByName.setAttribute('class', 'dark')
                this.header.className = 'bg-transparent text-white';
            } else {
                // 浅色
                elementsByName.removeAttribute('class')
                this.header.className = 'bg-transparent text-black';
            }
        },

    }
})