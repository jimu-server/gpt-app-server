package control

import (
	"github.com/gin-gonic/gin"
	"github.com/jimu-server/common/resp"
	"github.com/jimu-server/gpt-desktop/db"
	"github.com/jimu-server/gpt-desktop/gpt/args"
	"github.com/jimu-server/gpt-desktop/model"
	"github.com/jimu-server/gpt-desktop/web"
	"github.com/jimu-server/util/uuidutils/uuid"
	"time"
)

func CreateConversation(c *gin.Context) {
	var reqParams args.CreateConversationArgs
	web.BindJSON(c, &reqParams)
	conversationItem := model.AppChatConversationItem{
		Id:    uuid.String(),
		Title: reqParams.Title,
	}
	db.DB.Create(&conversationItem)
	c.JSON(200, resp.Success(conversationItem.Id, resp.Msg("创建成功")))
}

func DelConversation(c *gin.Context) {
	var reqParams map[string]string
	web.BindJSON(c, &reqParams)
	begin := db.DB.Begin()
	begin.Delete(&model.AppChatConversationItem{Id: reqParams["Id"]})
	begin.Model(&model.AppChatMessage{}).Where("conversation_id =?", reqParams["Id"]).Update("is_delete", 1)
	begin.Commit()
	c.JSON(200, resp.Success(nil, resp.Msg("创建成功")))
}

func DelConversationMessage(c *gin.Context) {
	var reqParams map[string]string
	web.BindJSON(c, &reqParams)
	db.DB.Where("conversation_id =?", reqParams["Id"]).Update("is_delete", 1)
	c.JSON(200, resp.Success(nil, resp.Msg("创建成功")))
}

func GetConversation(c *gin.Context) {
	var list []model.AppChatConversationItem
	db.DB.Find(&list)
	c.JSON(200, resp.Success(list, resp.Msg("查询成功")))
}

func GetConversationHistory(c *gin.Context) {
	var err error
	var list []model.AppChatMessage
	var conversationId string
	if conversationId = c.Query("conversationId"); conversationId == "" {
		c.JSON(500, resp.Error(err, resp.Msg("会话id不能为空")))
		return
	}
	db.DB.Where("conversation_id =? and is_delete=0", conversationId).Order("create_time ASC").Find(&list)
	c.JSON(200, resp.Success(list, resp.Msg("查询成功")))
}

func UpdateConversation(c *gin.Context) {
	var err error
	var reqParams *args.CreateConversationArgs
	web.BindJSON(c, reqParams)
	if err = GptMapper.CreateConversation(reqParams); err != nil {
		c.JSON(500, resp.Error(err, resp.Msg("创建失败")))
		return
	}
	c.JSON(200, resp.Success(reqParams, resp.Msg("创建成功")))
}

func Send(c *gin.Context) {
	var reqParams args.SendMessageArgs
	web.BindJSON(c, &reqParams)
	begin := db.DB.Begin()
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
	begin.Create(data)
	begin.Commit()
	c.JSON(200, resp.Success(data, resp.Msg("发送成功")))
}

func GetMessageItem(c *gin.Context) {
	id := c.Query("id")
	var data *model.AppChatMessage
	db.DB.Where("id =?", id).First(&data)
	c.JSON(200, resp.Success(data, resp.Msg("查询成功")))
}

func DeleteMessage(c *gin.Context) {
	var reqParams args.DeleteChatMsg
	web.BindJSON(c, &reqParams)
	var data *model.AppChatMessage
	db.DB.Model(data).Where("id in ?", reqParams.Ids).Update("is_delete", 1)
	c.JSON(200, resp.Success(nil, resp.Msg("删除成功")))
}

func PluginList(c *gin.Context) {
	var list []*model.AppChatPlugin
	db.DB.Where("status =?", 1).Find(&list)
	c.JSON(200, resp.Success(list, resp.Msg("获取成功")))
}
