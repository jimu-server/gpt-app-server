package gpt

import (
	"embed"
	"fmt"
	"github.com/jimu-server/gpt-desktop/auth"
	"github.com/jimu-server/gpt-desktop/db"
	"github.com/jimu-server/gpt-desktop/gpt/control"
	"github.com/jimu-server/gpt-desktop/logger"
	"github.com/jimu-server/gpt-desktop/web"
	"go.uber.org/zap"
	"os/exec"
)

//go:embed mapper/file/*.xml
var mapperFile embed.FS

//go:embed app_gpt_sqlite.sql
var initSQL embed.FS

func init() {
	initFileDb()
	chat := web.Engine.Group("/api/chat", auth.GptAuthorization())
	chat.GET("/plugin", control.PluginList)                                   // 获取插件列表
	chat.GET("/model/list", control.GetLLmModel)                              // 获取模型 可以走第三方获取
	chat.POST("/model/pull", control.PullLLmModel)                            // 获取模型 只能操作本地
	chat.POST("/model/delete", control.DeleteLLmModel)                        // 删除模型 只能操作本地
	chat.POST("/user/model/create", control.CreateLLmModel)                   // 创建模型 只能操作本地
	chat.POST("/user/model/delete", control.DeleteLLmModel)                   // 删除用户模型  只能操作本地
	chat.POST("/conversation/create", control.CreateConversation)             // 创建会话
	chat.POST("/conversation/del", control.DelConversation)                   // 删除会话
	chat.POST("/conversation/message/delete", control.DelConversationMessage) // 清空会话消息
	chat.GET("/conversation/get", control.GetConversation)                    // 查询会话列表
	chat.GET("/conversation/message", control.GetConversationHistory)         // 查询会话历史数据
	chat.POST("/conversation/update", control.UpdateConversation)             // 修改会话
	chat.POST("/send", control.Send)                                          // 发送消息
	chat.GET("/msg", control.GetMessageItem)                                  // 查询指定消息
	chat.POST("/msg/delete", control.DeleteMessage)                           // 删除消息

	// 聊天操作
	chat.POST("/conversation", control.ChatStream)                    // 默认聊天问答
	chat.POST("/conversation/knowledge", control.KnowledgeChatStream) // 知识库聊天问答

	// 知识库操作
	chat.POST("/knowledge/file/create", control.CreateKnowledgeFile) // 创建知识库文件
	chat.GET("/knowledge/file/list", control.GetKnowledgeFileList)   // 查询知识库文件列表
	chat.GET("/knowledge/list", control.GetKnowledgeList)            // 查询知识库
	chat.POST("/knowledge/gen", control.GenKnowledge)                // 生成知识库
	chat.POST("/knowledge/del", control.DeleteKnowledges)            // 生成知识库
}

func initFileDb() {
	var err error
	var file []byte
	check := 0
	db.DB.Raw("SELECT count(*) FROM sqlite_master WHERE type = 'table'").Scan(&check)
	if check == 0 {
		// 初始化db
		if file, err = initSQL.ReadFile("app_gpt_sqlite.sql"); err != nil {
			logger.Logger.Panic("failed to initialize database", zap.Error(err))
		}
		err = executeSQLScript("gpt.db", string(file))
		if err != nil {
			logger.Logger.Panic("failed to initialize database", zap.Error(err))
		}
		logger.Info("init gpt.db success")
	}
}

// executeSQLScript runs the given SQL script on the specified SQLite database
func executeSQLScript(dbFile string, script string) error {
	cmd := exec.Command("sqlite3", dbFile, script)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to execute SQL script: %s, output: %s", err, output)
	}
	logger.Info("executeSQLScript success", zap.String("output", string(output)))

	// 初始化 llm 插件
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model)\nVALUES (1, 'AI 助手', 'default', 'jimu-ChatGPT', 'qwen2:7b')")
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model, float_view)\nVALUES (2, '编程助手', 'programming', 'jimu-code', 'llama3:latest', 'ProgrammingAssistantPanelView')")
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model, float_view)\nVALUES (3, '知识库', 'knowledge', 'jimu-zhishi', 'qwen2:7b', 'KnowledgePanelView')")
	db.DB.Exec("insert into app_setting(id, name, value)\nVALUES (1, 'API', 'ApiSetting')")

	return nil
}
