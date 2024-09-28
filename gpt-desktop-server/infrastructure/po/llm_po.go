package po

type ConversationPO struct {
	ID         string `gorm:"column:id;primaryKey"json:"id"`
	Picture    string `gorm:"column:picture"json:"picture"`
	Title      string `gorm:"column:title"json:"title"`
	LastModel  string `gorm:"column:last_model"json:"lastModel"`
	LastMsg    string `gorm:"column:last_msg"json:"lastMsg"`
	LastTime   string `gorm:"column:last_time"json:"lastTime"`
	IsDelete   int    `gorm:"column:is_delete"json:"isDelete"`
	CreateTime string `gorm:"column:create_time"json:"createTime"`
}

func (receiver *ConversationPO) TableName() string {
	return "app_chat_conversation"
}

type MessagePO struct {
	ID             string `gorm:"column:id;primaryKey"json:"id"`
	ConversationID string `gorm:"column:conversation_id"json:"conversationId"`
	Picture        string `gorm:"column:picture"json:"picture"`
	MessageID      string `gorm:"column:message_id"json:"messageId"`
	ModelID        string `gorm:"column:model_id"json:"modelId"`
	Role           string `gorm:"column:role"json:"role"`
	Content        string `gorm:"column:content"json:"content"`
	CreateTime     string `gorm:"column:create_time"json:"createTime"`
	IsDelete       int    `gorm:"column:is_delete"json:"isDelete"`
}

func (receiver *MessagePO) TableName() string {
	return "app_chat_message"
}

type LLmModelPO struct {
	ID           string `json:"id"`
	PID          string `json:"pid"`
	UserID       string `json:"user_id"`
	Name         string `json:"name"`
	Model        string `json:"model"`
	Picture      string `json:"picture"`
	Size         string `json:"size"`
	IsDownload   bool   `json:"isDownload"`
	Digest       string `json:"digest"`
	ModelDetails string `json:"modelDetails"`
	CreateTime   string `json:"createTime"`
}

//	Plugin
//
// GPT 插件实体
type PluginPO struct {
	ID         string `gorm:"column:id;primaryKey"json:"id"`
	Name       string `gorm:"column:name"json:"name"`
	Code       string `gorm:"column:code"json:"code"`
	Icon       string `gorm:"column:icon"json:"icon"`
	Model      string `gorm:"column:model"json:"model"`
	FloatView  string `gorm:"column:float_view"json:"floatView"`
	Props      string `gorm:"column:props"json:"props"`
	Status     bool   `gorm:"column:status"json:"status"`
	CreateTime string `gorm:"column:create_time"json:"createTime"`
}

func (receiver *PluginPO) TableName() string {
	return "app_chat_plugin"
}
