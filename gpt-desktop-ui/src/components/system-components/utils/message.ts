import {ElMessage} from "element-plus";


export function warrangMsg(message: string, append: HTMLElement = document.body) {
    ElMessage({
        message: message,
        type: 'warning',
        appendTo: append,
        duration: 1500,
        grouping: true,
        plain: true,
    })
}

export function successMsg(message: string, append: HTMLElement = document.body) {
    ElMessage({
        message: message,
        type: 'success',
        appendTo: append,
        duration: 1500,
        grouping: true,
        plain: true,
    })
}

export function errorMsg(message: string, append: HTMLElement = document.body) {
    ElMessage({
        message: message,
        type: 'error',
        appendTo: append,
        duration: 1500,
        grouping: true,
        plain: true,
    })
}

