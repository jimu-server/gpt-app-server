
/*
* @description 在 edit 中找到 node 节点的 前一个html元素节点
* */
import {render} from "vue";

export function FindNodeBeforeHtmlElement(edit: HTMLElement, node: HTMLElement):HTMLElement {
    if (!edit ||!node) {
        return null;
    }
    edit.childNodes.forEach((item: Node) => {
        if (item === node) {
            return item;
        }

    })
    return
}


