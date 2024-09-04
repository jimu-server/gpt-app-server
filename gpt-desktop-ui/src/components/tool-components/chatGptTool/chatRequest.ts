import {Result, Tree} from "@/components/system-components/model/system";
import {
    AppChatConversationItem, AppChatKnowledgeFile, AppChatKnowledgeInstance,
    AppChatMessageItem, AppChatPlugin,
    LLmMole
} from "@/components/tool-components/chatGptTool/model/model";
import {GetHeaders} from "@/plugins/axiosutil";
import {OllamaServer} from "@/components/tool-components/chatGptTool/gptAxios";
import axiosForServer from "@/plugins/axiosForServer";
import AxiosForServer from "@/plugins/axiosForServer";


export function getConversation() {
    return new Promise<AppChatConversationItem[]>(resolve => {
        OllamaServer.get<Result<AppChatConversationItem[]>>('/api/chat/conversation/get').then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function createConversation(name: string) {
    return new Promise<Result<string>>(resolve => {
        OllamaServer.post<Result<string>>("/api/chat/conversation/create", {
            title: name
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function delConversation(id: string) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/conversation/del", {
            Id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function sendMessage(conversationId: string, recoverMessageId: string, value: string, modelId: string, avatar: string) {
    return new Promise<Result<AppChatMessageItem>>(resolve => {
        OllamaServer.post<Result<AppChatMessageItem>>("/api/chat/send", {
            conversationId: conversationId,
            content: value,
            modelId: modelId,
            messageId: recoverMessageId,
            avatar: avatar
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

/*export function getUuid() {
    return new Promise<string>(resolve => {
        axiosForServer.get<Result<string>>("/api/uuid").then(({data}) => {
            if (data.code === 200) {
                resolve(data.data)
                return
            }
            console.error("uuid获取失败")
            resolve("")
        })
    })
}*/

export function getConversationMessage(id: string) {
    return new Promise<AppChatMessageItem[]>(resolve => {
        OllamaServer.get<Result<AppChatMessageItem[]>>("/api/chat/conversation/message", {
            params: {
                conversationId: id
            }
        }).then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function getMessage(id: string) {
    return new Promise<AppChatMessageItem>(resolve => {
        OllamaServer.get<Result<AppChatMessageItem>>("/api/chat/msg", {
            params: {
                id: id
            }
        }).then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve(null)
                    return;
                }
                resolve(data.data)
            }
        })
    })
}


export function deleteModel(name: string) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/user/model/delete", {
            name: name
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function getBaseModel() {
    return new Promise<LLmMole[]>(resolve => {
        OllamaServer.get<Result<LLmMole[]>>("/api/chat/manage/modelList").then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}


export function getFiles(pid: string) {
    return new Promise<Tree<AppChatKnowledgeFile>[]>(resolve => {
        OllamaServer.get<Result<Tree<AppChatKnowledgeFile>[]>>("/api/chat/knowledge/file/list", {
            params: {
                pid: pid
            }
        }).then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export function createFiles(data: any) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/knowledge/file/create", data, {})
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function getKnowledge() {
    return new Promise<AppChatKnowledgeInstance[]>(resolve => {
        OllamaServer.get<Result<any[]>>("/api/chat/knowledge/list").then(({data}) => {
            if (data.code === 200) {
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            }
        })
    })
}

export async function genKnowledge(name: string, files: string[]) {
    let data = {
        name: name,
        files: files,
    }
    let response = await fetch('http://localhost:8080/api/chat/knowledge/gen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...GetHeaders()
        },
        body: JSON.stringify(data),
    });
    return response;
}

export function deleteMsg(id: string[]) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/msg/delete", {
            ids: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function getPlugins() {
    return new Promise<AppChatPlugin[]>(resolve => {
        OllamaServer.get<Result<AppChatPlugin[]>>("/api/chat/plugin")
            .then(({data}) => {
                if (data.code === 200) {
                    if (data.data == null) {
                        resolve([])
                        return;
                    }
                    resolve(data.data)
                }
            })
    })
}


export function delKnowledge(id: string) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/knowledge/del", {
            Id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function clearMessage(id: string) {
    return new Promise<Result<any>>(resolve => {
        OllamaServer.post<Result<any>>("/api/chat/conversation/message/delete", {
            Id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}