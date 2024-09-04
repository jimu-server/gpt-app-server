import {ElNotification} from "element-plus";
import {Records} from "@/components/system-components/model/system";

import {h, render} from "vue";
import {NotifyMsgTemplate, NotifyMsgType} from "@/components/system-tool/notifyTool/template";
import LoginNotifyBody from "@/components/system-tool/notifyTool/notifyBody/LoginNotifyBody.vue";
import DefaultNotifyBody from "@/components/system-tool/notifyTool/notifyBody/DefaultNotifyBody.vue";
import {readMsgElNotifyOption} from "@/components/system-tool/notifyTool/notifyutil";

let count = 0

export function notifyMsg(records: Records) {

    let body = ''
    let title = records.title
    let type = 'info'
    switch (records.msgType) {
        case NotifyMsgType.Error:
            type = 'error'
            break
        case NotifyMsgType.Info:
            type = 'info'
            break
        case NotifyMsgType.Success:
            type = 'success'
            break
        case NotifyMsgType.Warning:
            type = 'warning'
            break
    }
    let vNode = null;
    switch (records.template) {
        case NotifyMsgTemplate.LoginTemplate:
            vNode = h(LoginNotifyBody, {data: records})
            break
        default:
            vNode = h(DefaultNotifyBody, {data: records.param})
            break
    }
    let id = `${'notifyMsg' + count}`
    if (vNode) {
        let htmlDivElement = document.createElement("dev")
        render(vNode, htmlDivElement);
        let firstChild = htmlDivElement.firstChild;
        if (firstChild) {
            (firstChild as HTMLElement).id = id
            count++
            body = htmlDivElement.innerHTML
        }
    }
    let elNotification = ElNotification({
        title: title,
        message: body,
        dangerouslyUseHTMLString: true,
        // @ts-ignore
        type: type,
        // @ts-ignore
        position: 'bottom-right',
        showClose: true,
    });
    // todo 给消息通知添加事件
    setTimeout(() => {
        let byId = document.getElementById(id);
        if (byId) {
            let className = byId.getElementsByClassName('read-btn');
            if (className.length > 0) {
                let element = className[0];
                element.addEventListener("click", async () => {
                    await readMsgElNotifyOption(records.id, () => {
                        elNotification.close()
                    })
                })
            }
        }
    }, 1000)
}