import {defineStore} from "pinia";

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            // 定义 状态数据
            content: GetEditor() || '',
            isHint:false,
            point:{
                width:0,
                height:0
            }
        }
    },
    getters: {},
    actions: {
        Update(text: string) {
            this.content = text
            localStorage.setItem('content', text)
        },
        Hint(flag:boolean){
            this.isHint=flag;
        }
    }
})

function GetEditor(): string {
    let item = localStorage.getItem('content') as string;
    return item
}