import {defineStore} from "pinia";
import {AppChatKnowledgeInstance, AppChatPlugin} from "@/components/tool-components/chatGptTool/model/model";


export const useAiPluginStore = defineStore('ai-plugin', {
    state: () => {
        return {
            plugins: [] as AppChatPlugin[],
            currentPlugin: {} as AppChatPlugin,
            checked: [] as string[],
            pluginMenuShowFlag: false,
            ctx: {
                programming: {
                    list: [
                        {
                            selected: false,
                            name: "Go",
                            icon: "img:public/lang/go.png",
                        },
                        {
                            selected: false,
                            name: "Java",
                            bgColor: '',
                            textColor: '',
                            icon: "img:public/lang/java.png",
                        },
                        {
                            selected: false,
                            bgColor: '',
                            textColor: '',
                            name: "JS",
                            icon: "img:public/lang/js.png",
                        },
                        {
                            selected: false,
                            bgColor: '',
                            textColor: '',
                            name: "HTML",
                            icon: "img:public/lang/html.png",
                        },
                        {
                            selected: false,
                            bgColor: '',
                            textColor: '',
                            name: "CSS",
                            icon: "img:public/lang/CSS3.png",
                        },
                        {
                            selected: false,
                            bgColor: '',
                            textColor: '',
                            name: "Python",
                            icon: "img:public/lang/pyc.png",
                        }
                    ]
                },
                knowledge: [] as AppChatKnowledgeInstance[]
            }
        }
    },
    persist: true,
    actions: {}
})