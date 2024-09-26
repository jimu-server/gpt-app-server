package aichat_po

type ConversationItem struct {
	Id         string `gorm:"column:id;primaryKey"json:"id"`
	Picture    string `gorm:"column:picture"json:"picture"`
	Title      string `gorm:"column:title"json:"title"`
	LastModel  string `gorm:"column:last_model"json:"lastModel"`
	LastMsg    string `gorm:"column:last_msg"json:"lastMsg"`
	LastTime   string `gorm:"column:last_time"json:"lastTime"`
	IsDelete   int    `gorm:"column:is_delete"json:"isDelete"`
	CreateTime string `gorm:"column:create_time"json:"createTime"`
}

func (receiver *ConversationItem) TableName() string {
	return "app_chat_conversation"
}

type Message struct {
	Id             string `gorm:"column:id;primaryKey"json:"id"`
	ConversationId string `gorm:"column:conversation_id"json:"conversationId"`
	Picture        string `gorm:"column:picture"json:"picture"`
	MessageId      string `gorm:"column:message_id"json:"messageId"`
	ModelId        string `gorm:"column:model_id"json:"modelId"`
	Role           string `gorm:"column:role"json:"role"`
	Content        string `gorm:"column:content"json:"content"`
	CreateTime     string `gorm:"column:create_time"json:"createTime"`
	IsDelete       int    `gorm:"column:is_delete"json:"isDelete"`
}

func (receiver *Message) TableName() string {
	return "app_chat_message"
}

type LLmModel struct {
	Id           string `json:"id"`
	Pid          string `json:"pid"`
	UserId       string `json:"userId"`
	Name         string `json:"name"`
	Model        string `json:"model"`
	Picture      string `json:"picture"`
	Size         string `json:"size"`
	IsDownload   bool   `json:"isDownload"`
	Digest       string `json:"digest"`
	ModelDetails string `json:"modelDetails"`
	CreateTime   string `json:"createTime"`
}

func (receiver *LLmModel) TableName() string {
	return "llm_model"
}

type KnowledgeFile struct {
	Id         string `gorm:"column:id;primaryKey"json:"id"`
	Pid        string `gorm:"column:pid"json:"pid"`
	Check      bool   `gorm:"column:check"json:"check"`
	FileName   string `gorm:"column:file_name"json:"fileName"`
	FilePath   string `gorm:"column:file_path"json:"filePath"`
	FileType   int    `gorm:"column:file_type"json:"fileType"`
	CreateTime string `gorm:"column:create_time"json:"createTime"`
}

func (receiver *KnowledgeFile) TableName() string {
	return "app_chat_knowledge_file"
}

func (receiver *KnowledgeFile) GetId() string {
	return receiver.Id
}

func (receiver *KnowledgeFile) GetPid() string {
	return receiver.Pid
}

func (receiver *KnowledgeFile) GetName() string {
	return receiver.FileName
}

type KnowledgeInstance struct {
	Id                   string `gorm:"column:id;primaryKey"json:"id"`
	KnowledgeName        string `gorm:"column:knowledge_name"json:"knowledgeName"`
	KnowledgeFiles       string `gorm:"column:knowledge_files"json:"knowledgeFiles"`
	KnowledgeDescription string `gorm:"column:knowledge_description"json:"knowledgeDescription"`
	KnowledgeType        int    `gorm:"column:knowledge_type"json:"knowledgeType"`
	CreateTime           string `gorm:"column:create_time"json:"createTime"`
	Check                bool   `gorm:"column:check"json:"check"`
}

func (receiver *KnowledgeInstance) TableName() string {
	return "app_chat_knowledge_instance"
}

type EmbeddingAnalysis struct {
	FileName string `json:"fileName"`
	FileBody []byte `json:"fileBody"`
	Block    []string
}

//	Plugin
//
// GPT 插件实体
type Plugin struct {
	Id         string `gorm:"column:id;primaryKey"json:"id"`
	Name       string `gorm:"column:name"json:"name"`
	Code       string `gorm:"column:code"json:"code"`
	Icon       string `gorm:"column:icon"json:"icon"`
	Model      string `gorm:"column:model"json:"model"`
	FloatView  string `gorm:"column:float_view"json:"floatView"`
	Props      string `gorm:"column:props"json:"props"`
	Status     bool   `gorm:"column:status"json:"status"`
	CreateTime string `gorm:"column:create_time"json:"createTime"`
}

func (receiver *Plugin) TableName() string {
	return "app_chat_plugin"
}
