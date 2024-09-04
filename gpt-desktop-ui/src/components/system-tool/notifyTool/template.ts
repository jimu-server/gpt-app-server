
/*
* @description: 通知消息模板
* 对应消息通知内容模板渲染
* */
export enum NotifyMsgTemplate {
    // 登陆提示通知模板
    // components/system-components/tool/notifyTool/notifyBody/LoginNotifyBody.vue
    LoginTemplate = "LoginNotifyBody"
}


export enum NotifyMsgType {
    Info = 1,
    Success,
    Warning,
    Error,
}

export enum NotifyStatus {
    UnRead = 0,
    Read = 1,
}

export enum NotifyToolStatusType {
    // 未读消息类型
    UnReadNotify = 0,
    // 消息以全部读取
    ReadAllNotify = 1,
    // 没有消息通知
    NoNotify = 2,
}


