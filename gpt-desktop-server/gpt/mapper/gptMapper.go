package mapper

import (
	"database/sql"
	"github.com/jimu-server/model"
)

type GptMapper struct {
	InitCheck func() (int64, error)

	SelectMessageItem func(any) (*model.AppChatMessage, error)

	// 创建会话
	CreateConversation func(any) error
	// 删除会话
	DelConversation func(any, *sql.Tx) error
	// 删除会话的所有消息
	DeleteConversationMessage func(any, *sql.Tx) error
	ConversationList          func(any) ([]model.AppChatConversationItem, error)
	ConversationHistory       func(any) ([]model.AppChatMessage, error)
	UpdateConversationLastMsg func(any, *sql.Tx) error

	SelectModel func(any) (*model.LLmModel, error)
	ModelExists func(any) (bool, error)
	ModelInfo   func(any) (*model.LLmModel, error)
	CreateModel func(any) error

	CreateMessage func(any, *sql.Tx) error
	// 删除消息
	DeleteMessage func(any) error

	// 查询用户可用模型
	ModelList func(any) ([]model.LLmModel, error)

	// 管理擦汗寻查询 内置基础模型
	BaseModelList func(any) ([]model.LLmModel, error)

	// 更新模型状态
	UpdateModelDownloadStatus func(any) error

	DeleteModel func(any) error

	GetUserAvatar  func(any) (string, error)
	GetModelAvatar func(any) (string, error)

	InsertKnowledgeFile func(any) error

	// 查询知识库列表
	KnowledgeFileList     func(any) ([]*model.AppChatKnowledgeFile, error)
	KnowledgeFileListById func(any) ([]*model.AppChatKnowledgeFile, error)
	KnowledgeList         func(any) ([]*model.AppChatKnowledgeInstance, error)

	CreateKnowledge func(any) error

	DeleteKnowledge func(any) error

	GetGptPlugin func() ([]*model.AppChatPlugin, error)
}
