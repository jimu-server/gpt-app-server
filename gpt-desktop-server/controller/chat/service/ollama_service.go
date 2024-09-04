package service

import (
	"bytes"
	"common/auth"
	"common/resp"
	"github.com/gin-gonic/gin"
	"github.com/ollama/ollama/api"
	"gpt-desktop/controller/chat/dto"
	"gpt-desktop/db"

	llm_sdk "gpt-desktop/gpt/llm-sdk"
	"gpt-desktop/logs"
	"gpt-desktop/model"
	"net/http"
	"time"
)

func ChatUpdate(args *dto.ChatArgs, content string) error {
	var err error
	begin := db.DB.Begin()
	// 消息入库
	format := time.Now().Format("2006-01-02 15:04:05")
	data := model.AppChatMessage{
		Id:             args.Id,
		ConversationId: args.ConversationId,
		MessageId:      args.MessageId,
		ModelId:        args.ModelId,
		Role:           "assistant",
		Content:        content,
		CreateTime:     format,
	}
	if err = begin.Create(&data).Error; err != nil {
		return err
	}
	// 更新会话
	update := model.AppChatConversationItem{
		Id:        args.ConversationId,
		LastModel: args.Model,
		LastMsg:   content,
		LastTime:  format,
	}
	if err = begin.Updates(&update).Error; err != nil {
		logs.Log.Error(err.Error())
		begin.Rollback()
		return err
	}
	begin.Commit()
	return nil
}

// SendChatStreamMessage 聊天流消息
func SendChatStreamMessage(c *gin.Context, params *dto.ChatArgs) {
	var err error
	var send <-chan llm_sdk.LLMStream[api.ChatResponse]
	if send, err = llm_sdk.Chat[api.ChatResponse](params.ChatRequest); err != nil {
		c.JSON(500, resp.Error(err, resp.Msg("消息回复失败")))
		return
	}
	// 写入流式响应头
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(500, resp.Error(err, resp.Msg("消息回复失败")))
		return
	}
	content := bytes.NewBuffer(nil)
	//now := time.Now()
	for data := range send {
		v := data.Data()
		buffer := data.Body()
		buffer.WriteString(llm_sdk.Segmentation)
		_, err = c.Writer.Write(buffer.Bytes()) // 根据你的实际情况调整
		if err != nil {
			logs.Log.Error(err.Error())
			if err = data.Close(); err != nil {
				logs.Log.Error(err.Error())
				break
			}
			break // 如果写入失败，结束函数
		}
		flusher.Flush() // 立即将缓冲数据发送给客户端
		msg := v.Message.Content
		content.WriteString(msg)
	}
	contentStr := content.String()
	if err = ChatUpdate(params, contentStr); err != nil {
		c.JSON(500, resp.Error(err, resp.Msg("消息回复失败")))
		return
	}
}

func SendKnowledgeChatStreamMessage(c *gin.Context, params dto.KnowledgeChatArgs) {

}

func IndexKnowledge(token *auth.Token, param dto.KnowledgeChatArgs) {

}
