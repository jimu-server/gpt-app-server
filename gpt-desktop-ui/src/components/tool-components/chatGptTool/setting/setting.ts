// OllamaSetting 对应服务器存储每个用户 自己的ollama信息
export interface OllamaSetting {
    // ollama 模型服务地址 一般默认 本机地址
    host?: string
    // 本地模型存储路径
    ollamaModel?: string

    localPath?: string
}