import {GetHeaders} from "@/plugins/axiosutil";
import pinia from "@/pinia";
import emitter from "@/plugins/event";
import {SendActionScroll} from "@/plugins/evenKey";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {sendMessage} from "@/components/tool-components/chatGptTool/chatRequest";
import {AppChatMessageItem, SendCtx} from "@/components/tool-components/chatGptTool/model/model";
import {genStream} from "@/components/tool-components/chatGptTool/ollamaRequest";
import {userStore} from "@/components/system-components/store/user";
import {VITE_APP_OLLAMA_SERVER} from "@/env";
import {getUuid} from "@/utils/systemutils";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";


export function getSendCtx(): SendCtx {
    let store = useGptStore(pinia)
    // 获取当前连天选择模型
    let pluginStore = useAiPluginStore(pinia);
    let user = userStore(pinia).info
    // 获取当前选中插件
    let plugin = pluginStore.currentPlugin
    let conversationId = ""
    if (!store.CurrentChat.Current) {
        console.error("conversationId is null")
        return
    }
    // 获取当前会话信息
    conversationId = store.CurrentChat.Current.Conversation.id

    // 计算当前用户发送的消息对于回复gpt的那条消息
    let recoverId = ""
    if (store.CurrentChat.messageList.length > 0) {
        let data = store.CurrentChat.messageList[store.CurrentChat.messageList.length - 1]
        // 如果最后一次的消息依就是用户的,gpt那边没有,应该认为这一条用户消息为一个新消息
        if (data.role !== 'user') {
            recoverId = data.id
        }
    }

    return {
        // 会话id
        conversationId,
        recoverId,
        // 插件
        plugin,
        // 用户信息
        user,
        // gpt store
        store
    }
}

/*
* @description 对指定消息的回答进行重试操作
* @param {conversationId} 会话id
* @param {messageId} 重试回复消息id
* */
export async function retryMessage(message: AppChatMessageItem) {
    return await getReply(message)
}


export async function getReply(message: AppChatMessageItem) {
    // 获取当前连天选择模型
    let store = useGptStore(pinia);
    let {conversationId, plugin, user} = getSendCtx()
    // 通过问题消息获取流是回答
    //创建 一个gpt回答消息
    let uuid = getUuid()

    // 创建一个消息用户传递 用户的问题输入 ,结束后把这个消息转化为gpt角色 并重置 content 和 role
    let msg: AppChatMessageItem = {
        id: uuid,
        content: message.content,
        conversationID: conversationId,
        messageId: message.id,
        createTime: "",
        role: "user",
        modelId: plugin.model,
        picture: "",
    }

    let messages = []
    // 检查是否开启上下文聊天
    if (store.ui.autoHistory) messages.push(...store.CurrentChat.messageList)
    messages.push(msg)

    // 请求流数据参数
    let data = {
        conversationId: conversationId,
        id: uuid,
        messageId: message.id,
        model: plugin.model,
        modelId: plugin.model,
        messages: messages
    }
    let serverUrl = getOllamaServer()
    msg.stream = await genStream(`${serverUrl}/api/chat/conversation`, data);
    // 清空内容,表示表示后面接收到流消息 判断 content 为 '' 就开始打印消息
    msg.content = ''
    msg.role = 'assistant'
    // 把消息添加到本地缓存
    store.CurrentChat.messageList.push(msg)
    return true
}



/*
* @description 获取 本地gpt服务器地址
* */
export function getOllamaServer() {
    let server: string = VITE_APP_OLLAMA_SERVER
    if (server.endsWith("/")) {
        return server.substring(0, server.length - 1)
    }
    // 使用用户的主机信息
    return server
}


