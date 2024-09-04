import {MessageType} from "@/components/tool-components/chatGptTool/model/chat";
import {Stream} from "@/components/system-components/stream/stream";
import {Token} from "@/components/system-components/model/system";


export interface AppChatConversationItem {
    id?: string
    // 会话头像
    picture?: string
    // 会话标题
    title?: string
    // 用户id
    userId?: string
    // 最后一条会话消息的模型
    lastModel?: string
    // 最后一条会话消息
    lastMsg?: string
    // 最后一条会话消息的时间
    lastTime?: string
    // 会话创建时间
    createTime?: string
}

export interface AppChatMessageItem {
    id: string
    // 会话窗口
    conversationID: string
    messageId: string
    // 消息类型
    contentType?: MessageType
    // 用户id or 模型id
    userId?: string
    modelId: string
    // 消息对应头像
    picture?: string
    // 消息角色
    role: string
    // 消息内容
    content: string
    // 创建事件
    createTime: string
    // 流式消息IO
    stream?: Response
}

export interface LLmMole {

    id?: string
    pid?: string
    // 模型展示名
    name?: string
    // 发送消息 ollama 请求所需要携带的model参数
    model?: string
    // 模型图标
    picture?: string
    size?: string
    modelDetails?: string
    isDownload?: boolean
    createTime?: string
    downloads?: boolean;
}

export interface ProgressResponse {
    status?: string
    digest?: string
    total: number
    completed?: number
}

export enum AppChatKnowledgeFileType {
    Folder = 0,
    File = 1,
}

export interface AppChatKnowledgeFile {
    id: string
    check: boolean
    pid: string
    userId: string
    fileName: string
    filePath: string
    serverPath?: string
    createTime: string
    size?: string
    fileType: AppChatKnowledgeFileType
}


export interface AppChatKnowledgeInstance {
    id?: string
    userId?: string
    knowledgeName?: string
    knowledgeFiles: string[]
    knowledgeDescription?: string
    knowledgeType?: string
    createTime?: string
    check: boolean
    bgColor?: string
}


//   对接 本地 ollama 模型返回数据


export interface OllamaModelResponse {
    name?: string
    model?: string
    modified_at?: string
    size?: number
    digest?: string
    details: OllamaModelDetails
}

export interface OllamaModelDetails {
    parent_model?: string
    format?: string
    family?: string
    families?: string[]
    parameter_size?: string
    quantization_level?: string
}

export interface OllamaDownload {
    model?: string
    isDownload?: boolean
    progress?: ProgressResponse
    stream?: Stream
}


export interface AppChatPlugin {
    id: string
    name: string
    code: string
    icon: string
    model: string
    floatView: string
    props: string
    status: boolean
    createTime: string
}

export interface SendCtx {
    conversationId: string
    recoverId: string
    plugin: AppChatPlugin
    user: Token
    store: any
}

export interface ChatCache {
    messageList?: AppChatMessageItem[]
    replying?: boolean
    currentStream?: Stream,
}