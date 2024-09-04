/*
* 会话
* */


import {AppChatConversationItem} from "@/components/tool-components/chatGptTool/model/model";

export declare interface ConversationItem {
    conversationID?: string;
    conversationType?: SessionType;
    userID?: string;
    groupID?: string;
    showName?: string;
    faceURL?: string;
    latestMsg?: string;
    latestMsgSendTime?: number;
    draftText?: string;
    draftTextTime?: number;
    burnDuration?: number;
    msgDestructTime?: number;
    ex?: string;
}

/*
* 消息
* */
export declare interface MessageItem {
    createTime: number;
    sendTime: number;
    sendID: string;
    recvID: string;
    contentType: MessageType;
    senderNickname: string;
    groupID: string;
    content: string;
    seq: number;

    attachedInfo: string;
    ex: string;
    textElem: TextElem;
    cardElem: CardElem;
    pictureElem: PictureElem;
    fileElem: FileElem;
}

export declare interface TextElem {
    content: string;
}

export declare interface CardElem {
    userID: string;
    nickname: string;
    faceURL: string;
    ex: string;
}

export declare interface FileElem {
    filePath: string;
    uuid: string;
    sourceUrl: string;
    fileName: string;
    fileSize: number;
}

export declare interface PictureElem {
    sourcePath: string;
    sourcePicture: Picture;
    bigPicture: Picture;
    snapshotPicture: Picture;
}

export declare interface Picture {
    uuid: string;
    type: string;
    size: number;
    width: number;
    height: number;
    url: string;
}


export enum MessageType {
    // 普通消息
    TextMessage = 1,
    // 图片消息
    PictureMessage = 2,
    // 声音消息
    VoiceMessage = 3,
    // 视频消息
    VideoMessage = 4,
    // 文件消息
    FileMessage = 5,
    // 自定义
    CustomMessage = 6,
}

export enum SessionType {
    Single = 1,
    Group = 3,
    WorkingGroup = 3,
    Notification = 4
}


export interface ConversationEntity {
    Conversation: AppChatConversationItem
    focused?: any
    active?: any
}

export interface ChatMessageEntity {
    contentType: MessageType  // 消息类型
    data: any // 消息数据
}


export interface ChatCtx {

    // gpt 是否正在回复消息 , 目前对于回复中的消息不能切换会话
    replying: string

    // 当前聊天会话消息列表
    messageList: ChatMessageEntity[]
}

