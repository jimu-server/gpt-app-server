package chat

import (
	"common/web"
)

func init() {
	chat := web.Engine.Group("/api/chat")
	chat.GET("/model/list", Models)
	chat.GET("/plugin", PluginList)                                   // 获取插件列表
	chat.POST("/conversation/create", CreateConversation)             // 创建会话
	chat.POST("/conversation/del", DelConversation)                   // 删除会话
	chat.POST("/conversation/message/delete", DelConversationMessage) // 清空会话消息
	chat.GET("/conversation/get", GetConversation)                    // 查询会话列表
	chat.GET("/conversation/message", GetConversationHistory)         // 查询会话历史数据
	chat.POST("/send", Send)                                          // 发送消息
	chat.GET("/msg", GetMessageItem)                                  // 查询指定消息
	chat.POST("/msg/delete", DeleteMessage)                           // 删除消息

	// 聊天操作
	chat.POST("/conversation", DefaultChatStream)             // 默认聊天问答
	chat.POST("/conversation/knowledge", KnowledgeChatStream) // 知识库聊天问答
}
