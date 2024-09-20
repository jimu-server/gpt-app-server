package chat

import (
	"common/resp"
	"common/util/uuidutils/uuid"
	"common/web"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gpt-desktop/controller/chat/dto"
	"gpt-desktop/controller/chat/service"
	"gpt-desktop/db"
	llm_sdk "gpt-desktop/gpt/llm-sdk"
	"gpt-desktop/logs"
	"gpt-desktop/model"
	"time"
)

func CreateConversation(c *gin.Context) {
	reqParams := web.BindJSON[*dto.CreateConversationArgs](c)
	conversationItem := model.AppChatConversationItem{
		Id:    uuid.String(),
		Title: reqParams.Title,
	}
	db.DB.Create(&conversationItem)
	resp.SUCCESS(c, conversationItem.Id)
}

func DelConversation(c *gin.Context) {
	reqParams := web.BindJSON[map[string]string](c)
	begin := db.DB.Begin()
	begin.Delete(&model.AppChatConversationItem{Id: reqParams["Id"]})
	begin.Model(&model.AppChatMessage{}).Where("conversation_id =?", reqParams["Id"]).Update("is_delete", 1)
	begin.Commit()
	resp.SUCCESS(c, nil)
}

func DelConversationMessage(c *gin.Context) {
	reqParams := web.BindJSON[map[string]string](c)
	db.DB.Where("conversation_id =?", reqParams["Id"]).Update("is_delete", 1)
	resp.SUCCESS(c, nil)
}

func GetConversation(c *gin.Context) {
	var list []model.AppChatConversationItem
	db.DB.Find(&list)
	resp.SUCCESS(c, list)
}

// GetConversationHistory
// @Summary      发送消息
// @Description  用户对话，发送问题消息
// @Tags         聊天
// @Accept       json
// @Param        conversationId query string  true "消息参数"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/conversation/message [get]
func GetConversationHistory(c *gin.Context) {
	var err error
	var list []model.AppChatMessage
	var conversationId string
	if conversationId = c.Query("conversationId"); conversationId == "" {
		logs.Log.Error("会话id不能为空", zap.Error(err))
		resp.Error(err)
		return
	}
	db.DB.Where("conversation_id =? and is_delete=0", conversationId).Order("create_time ASC").Find(&list)
	resp.SUCCESS(c, list)
}

// Send
// @Summary      发送消息
// @Description  用户对话，发送问题消息
// @Tags         聊天
// @Accept       json
// @Param        args body  dto.SendMessageArgs true "消息参数"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/send [post]
func Send(c *gin.Context) {
	reqParams := web.BindJSON[*dto.SendMessageArgs](c)
	data := model.AppChatMessage{
		Id:             uuid.String(),
		ConversationId: reqParams.ConversationId,
		MessageId:      reqParams.MessageId,
		ModelId:        reqParams.ModelId,
		Picture:        reqParams.Avatar,
		Role:           "user",
		Content:        reqParams.Content,
		CreateTime:     time.Now().Format("2006-01-02 15:04:05"),
	}
	db.DB.Create(data)
	resp.SUCCESS(c, data)
}

// GetMessageItem
// @Summary      获取指定消息
// @Description  根据消息id获取指定消息
// @Tags         聊天
// @Accept       json
// @Param        id query  string true "消息参数"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/msg [get]
func GetMessageItem(c *gin.Context) {
	id := c.Query("id")
	var data *model.AppChatMessage
	db.DB.Where("id =?", id).First(&data)
	resp.SUCCESS(c, data)
}

// DeleteMessage
// @Summary      删除消息
// @Description  删除指定消息记录
// @Tags         聊天
// @Accept       json
// @Param        args body  dto.DeleteChatMsg true "消息参数"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/msg/delete [post]
func DeleteMessage(c *gin.Context) {
	reqParams := web.BindJSON[*dto.DeleteChatMsg](c)
	var data *model.AppChatMessage
	db.DB.Model(data).Where("id in ?", reqParams.Ids).Update("is_delete", 1)
	resp.SUCCESS(c, nil)
}

// PluginList
// @Summary      获取插件列表
// @Description  获取全部插件列表信息
// @Tags         插件
// @Accept       json
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/plugin [get]
func PluginList(c *gin.Context) {
	var list []*model.AppChatPlugin
	db.DB.Where("status =?", 1).Find(&list)
	resp.SUCCESS(c, list)
}

// DefaultChatStream
// @Summary      发送消息
// @Description  用户发送普通问答消息
// @Tags         聊天
// @Accept       json
// @Param        args body  dto.ChatArgs true "消息参数"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/chat/conversation [post]
func DefaultChatStream(c *gin.Context) {
	params := web.BindJSON[*dto.ChatArgs](c)
	service.SendChatStreamMessage(c, params)
}

func KnowledgeChatStream(c *gin.Context) {
	//var params dto.KnowledgeChatArgs
	//web.BindJSON(c, &params)
	//service.SendKnowledgeChatStreamMessage(c, params)
}

func Models(c *gin.Context) {
	list, err := llm_sdk.ModelList("http://127.0.0.1:11434")
	if err != nil {
		return
	}
	resp.SUCCESS(c, list.Models)
}
