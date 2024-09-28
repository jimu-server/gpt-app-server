package dto

type ModelDTO struct {
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

// PluginDTO LLM模型插件
type PluginDTO struct {
	ID         string `json:"id"`
	Name       string `json:"name"`       // 模型名称
	Code       string `json:"code"`       // 模型代码
	Icon       string `json:"icon"`       // 图标
	Model      string `json:"model"`      // LLM模型
	FloatView  string `json:"floatView"`  // 窗口
	Props      string `json:"props"`      // 属性
	Status     bool   `json:"status"`     // 状态
	CreateTime string `json:"createTime"` // 创建时间
}

type ConversationDTO struct {
	ID         string `json:"id,omitempty"`
	Picture    string `json:"picture,omitempty"`
	Title      string `json:"title,omitempty"`
	LastModel  string `json:"last_model,omitempty"`
	LastMsg    string `json:"last_msg,omitempty"`
	LastTime   string `json:"last_time,omitempty"`
	IsDelete   int    `json:"is_delete,omitempty"`
	CreateTime string `json:"create_time,omitempty"`
}

type MessageDTO struct {
	ID             string `json:"id,omitempty"`
	ConversationID string `json:"conversation_id,omitempty"`
	Picture        string `json:"picture,omitempty"`
	MessageID      string `json:"message_id,omitempty"`
	ModelID        string `json:"model_id,omitempty"`
	Role           string `json:"role,omitempty"`
	Content        string `json:"content,omitempty"`
	CreateTime     string `json:"create_time,omitempty"`
	IsDelete       int    `json:"is_delete,omitempty"`
}
