import {defineStore} from "pinia";

import emitter from "@/plugins/event";
import {ScrollToBottom, SendActionScroll} from "@/plugins/evenKey";
import {ConversationEntity, MessageItem} from "@/components/tool-components/chatGptTool/model/chat";
import {
    AppChatConversationItem, AppChatKnowledgeFile, AppChatKnowledgeInstance,
    AppChatMessageItem, ChatCache,
    LLmMole, OllamaDownload, OllamaModelResponse
} from "@/components/tool-components/chatGptTool/model/model";
import {IsEmpty} from "@/components/tool-components/chatGptTool/chat/chatutils";
import {
    getBaseModel,
    getConversation,
    getConversationMessage,
} from "@/components/tool-components/chatGptTool/chatRequest";
import {Tree} from "@/components/system-components/model/system";
import {getLLmMole} from "@/components/tool-components/chatGptTool/ollamaRequest";
import {Stream} from "@/components/system-components/stream/stream";
import {set} from "lodash";


export const useGptStore = defineStore('gpt', {
    state: () => {
        return {
            test: '',
            defaultAvatar: 'https://im-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg',
            gptDefaultAvatar: './GPT.png',
            // 可显示数据范围
            view: [],
            // 新消息要单独存放一个可显示消息列表, view 在超过一定数量时候会删除排在前边的 可显示id列表,
            // 其中很有可能把 新添加的消息在看历史记录时删除,造成返回到底部消息时候无法加载显示,所以新消息要一个 newView 补偿
            // newView 到达一定阈值也要删除一部分早期的消息,最少要保留最后5条数据id
            newView: [],
            ChatCache: [] as ChatCache,
            CurrentChat: {
                // 存储用户主动发起的会话记录 在第一次发送消息成功时候会把它移动到 conversationList 列表中
                create: [] as ConversationEntity[],
                // 当前会话在线情况
                status: 0,
                // 当前会话列表
                conversationList: [] as ConversationEntity[],
                // 当前聊天会话消息列表
                messageList: [] as AppChatMessageItem[],
                // 当前选中会话 需要持久化存储 JSON.parse(localStorage.getItem("current") as string) as sys.ConversationEntity||
                Current: {} as ConversationEntity,
                index: -1,
                // 当前预览的消息
                previewData: {
                    // 当前聊天会话 消息预览状态 整个聊天 确保指挥出现一个预览框
                    previewStatus: false,
                    // 预览消息列表,存储的消息 是当前聊天消息列表中的 图片和视频消息
                    previewMessages: [],
                    index: 0,
                    // message: JSON.parse(localStorage.getItem("preview-message")) as MessageItem | {} as MessageItem
                    message: {} as MessageItem
                },
                // 预览消息窗口需要加载的数据 同  previewData
                previewWinData: {}
            },
            // 存储会话消息
            message: {},
            // 缓存 聊天编辑信息用于草稿状态
            chat_editor_content: {},
            ui: {
                // 会话搜索关键字
                search: '',
                // gpt响应的消息是否自动折叠
                autoFold: false,
                // 发送消息是否携带历史
                autoHistory: false,

                // gpt 是否正在回复消息 , 目前对于回复中的消息不能切换会话
                replying: false,

                // 是否禁用发送消息按钮
                sendDisable: false,

                // 编辑器发送消息方式切换 (false 案件 enter 发送) (true 按键 ctrl+enter 发送)
                send: false,

                stop: false,

                currentStream: null as Stream,

                // 聊天面板展示隐藏属性
                showChat: false,

                // 历史数据区间范围 marks 的区间来自于 当前历史消息内
                marks: [0, 0],
                defaultMarks: 0,
                // 基础模型列表
                baseModelList: [] as LLmMole[],
                // 当前 对话所选则的模型
                currentModel: null as OllamaModelResponse,
                // 所有模型列表
                modelList: [] as OllamaModelResponse[],
                // 用于前端 通过消息记录中的 modeid 快速查询到 模型信息显示消息名称等信息
                modelInfo: {},

                // 下载模型列表
                downloadModelList: [] as OllamaDownload[],

                // 知识库生成任务列表
                genList: [],

                knowledge: {
                    // 知识库导航目录
                    nva: [],
                    root: [] as Tree<AppChatKnowledgeFile>[],
                    // 知识库导航目录内对应的所有文件
                    files: [] as Tree<AppChatKnowledgeFile>[],

                    instance: [] as AppChatKnowledgeInstance[],
                },
            },
        }
    },
    persist: true,
    getters: {
        sortConversation() {
            this.CurrentChat.conversationList.sort((a, b) => {
                const timestampA = new Date(a.Conversation.lastTime).getTime();
                const timestampB = new Date(b.Conversation.lastTime).getTime();
                return timestampA - timestampB; // F
            })
            let list: ConversationEntity[] = []
            if (this.ui.search != '') {
                list = this.CurrentChat.conversationList.filter(item => {
                    return item.Conversation.title.includes(this.ui.search)
                })
                return list
            }
            return this.CurrentChat.conversationList.reverse()
        },
    },
    actions: {
        setConversation(list: AppChatConversationItem[]) {
            let arr = []
            for (const element of list) {
                arr.push({
                    Conversation: element,
                    focused: false,
                    active: false
                })
            }
            this.CurrentChat.conversationList = arr
            if (arr.length == 0) {
                this.CurrentChat.Current = {}
                this.ui.showChat = false
                this.CurrentChat.index = -1
                return
            }
            if (!IsEmpty(this.CurrentChat.Current)) {
                let index = this.CurrentChat.conversationList.findIndex(item => {
                    return item.Conversation.id == this.CurrentChat.Current.Conversation.id
                })
                if (index != -1) {
                    this.CurrentChat.Current = this.CurrentChat.conversationList[index]
                    this.ui.showChat = true
                    this.CurrentChat.Current.focused = true
                    this.CurrentChat.Current.active = true
                }
                return;
            }
        },

        SetCurrentChatById(id: string) {
            let newIndex = -1
            // 查询当前即将选择的会话 index
            newIndex = this.CurrentChat.conversationList.findIndex(item => {
                return item.Conversation.id == id
            })
            let item = null
            item = this.CurrentChat.conversationList[newIndex]
            this.SetCurrentChat(item, newIndex)
        },

        /*
        * @description: 设置当前会话
        * */
        SetCurrentChat(conversation: ConversationEntity, index: number) {
            let item = null
            // 当前会话index 存在 则处理当前会话为未选中状态
            if (!IsEmpty(this.CurrentChat.Current)) {
                let finIndIndex = this.CurrentChat.conversationList.findIndex(e => {
                    return e.Conversation.id == this.CurrentChat.Current.Conversation.id
                });
                if (finIndIndex != -1) {
                    item = this.CurrentChat.conversationList[finIndIndex]
                    item.focused = false
                    item.active = false
                }
            }
            // 更新当前即将选中的会话状态
            item = this.CurrentChat.conversationList[index]
            item.focused = true
            item.active = true
            this.CurrentChat.Current = item
            this.ui.showChat = true
            this.CurrentChat.index = index
            // 加载当前选中会话的消息记录
            this.GetConversationMessageList(item.Conversation.id)
        },

        /*
        * @description 获取聊天会话消息列表
        * */
        async GetConversationList() {
            getConversation().then(data => {
                this.setConversation(data)
            })
        },

        async GetBaseModelList() {
            getBaseModel().then(data => {
                this.ui.baseModelList = data
            })
        },

        async GetModelList() {
            getLLmMole().then(data => {
                this.ui.modelList = data
                if (data.length > 0 && this.ui.currentModel == null) {
                    for (const datum of data) {
                        this.ui.currentModel = datum
                        break
                    }
                }
            })
        },
        /*
        * @description 加载指定会话消息的历史记录到当前聊天记录
        * @param {string} id 会话id
        * */
        async GetConversationMessageList(id: string) {
            this.CurrentChat.messageList = []
            this.view = []
            this.newView = []
            let data = await getConversationMessage(id)
            this.CurrentChat.messageList = data
        },

        UpdateConversationLastMsg(conversationID: string, message: AppChatMessageItem) {
            for (const conversationEntity of this.CurrentChat.conversationList) {
                if (conversationEntity.Conversation.id == conversationID) {
                    conversationEntity.Conversation.lastMsg = message.content
                    conversationEntity.Conversation.picture = message.picture
                    conversationEntity.Conversation.lastTime = message.createTime
                }
            }
        },

        clear() {
            this.CurrentChat = {
                create: [] as ConversationEntity[],
                status: 0,
                conversationList: [] as ConversationEntity[],
                messageList: [] as AppChatMessageItem[],
                Current: {} as ConversationEntity,
                index: -1,
            }
            this.view = []
            this.newView = []
            this.ui = {
                search: '',
                autoFold: false,
                autoHistory: false,
                replying: false,
                send: false,
                stop: false,
                currentStream: null as Stream,
                showChat: false,
                marks: [0, 0],
                defaultMarks: 0,
                baseModelList: [] as LLmMole[],
                currentModel: null as OllamaModelResponse,
                modelList: [] as OllamaModelResponse[],
                modelInfo: {},
                downloadModelList: [] as OllamaDownload[],
                knowledge: {
                    nva: [],
                    root: [] as Tree<AppChatKnowledgeFile>[],
                    files: [] as Tree<AppChatKnowledgeFile>[],
                    instance: [] as AppChatKnowledgeInstance[],
                },
            }
        }
    }
})
