import {AppChatMessageItem, SendCtx} from "@/components/tool-components/chatGptTool/model/model";
import {ChatMessageEntity, MessageType} from "@/components/tool-components/chatGptTool/model/chat";
import {sendMessage} from "@/components/tool-components/chatGptTool/chatRequest";
import emitter from "@/plugins/event";
import {SendActionScroll} from "@/plugins/evenKey";
import {getReply} from "@/components/tool-components/chatGptTool/gptutil";

/*
* @description 发送默认文本消息
* @ctx 发送消息需要用到的赏析问信息
* @messages 编辑器解析的消息
* */
export function sendDefaultMessage(ctx: SendCtx, messages: ChatMessageEntity[]) {
    for (const item of messages) {
        switch (item.contentType) {
            // 文本消息,包含表情
            case MessageType.TextMessage:
                sendMessage(ctx.conversationId, ctx.recoverId, item.data, ctx.plugin.model, ctx.user.user.picture).then(async result => {
                    if (result.code === 200) {
                        ctx.store.CurrentChat.messageList.push(result.data)
                        // 新消息要追加到可显示列表中
                        ctx.store.newView.push(result.data.id)
                        emitter.emit(SendActionScroll)
                        // 问题消息发送成功 ,开始获取流是回答
                        await getReply(result.data)
                    }
                })
                break
            // 图片消息
            case MessageType.PictureMessage:
                break
            // 自定义消息类型
            case MessageType.CustomMessage:
                break
        }
    }
}