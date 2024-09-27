package main

import (
	"common/web"
	"embed"
	"fmt"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"
	"gpt-desktop/config"

	"gpt-desktop/db"
	"gpt-desktop/docs"
	"gpt-desktop/logs"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	_ "gpt-desktop/controller/chat"
	_ "gpt-desktop/controller/pub"
)

func init() {
	docs.SwaggerInfo.Title = "gpt"
	docs.SwaggerInfo.Description = "gpt-api 文档"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.BasePath = "/"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// https://github.com/swaggo/swag
	// 初始化文档使用 swag init -g main.go -pd
	web.Engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

//go:embed app_gpt_sqlite.sql
var initSQL embed.FS

func main() {
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%s", config.Evn.Host, config.Evn.Port),
		Handler: web.Engine,
	}
	initFileDb()
	go func() {
		logs.Log.Info("server start docs url http://localhost:8080/swagger/index.html")
		if err := server.ListenAndServe(); err != nil {
			panic(err.Error())
		}
	}()

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-signals:
		if err := zap.L().Sync(); err != nil {
			logs.Log.Error("sync zap log error", zap.Error(err))
		}
		if err := server.Close(); err != nil {
			logs.Log.Error("close server error", zap.Error(err))
		}
		logs.Log.Info("server shutdown")
	}
}

func initFileDb() {
	var err error
	var file []byte
	check := 0
	db.DB.Raw("SELECT count(*) FROM sqlite_master WHERE type = 'table'").Scan(&check)
	if check == 0 {
		// 初始化db
		if file, err = initSQL.ReadFile("app_gpt_sqlite.sql"); err != nil {
			logs.Log.Panic("failed to initialize database", zap.Error(err))
		}
		err = executeSQLScript("gpt.db", string(file))
		if err != nil {
			logs.Log.Panic("failed to initialize database", zap.Error(err))
		}
		logs.Log.Info("init gpt.db success")
	}
}

// executeSQLScript runs the given SQL script on the specified SQLite database
func executeSQLScript(dbFile string, script string) error {
	cmd := exec.Command("sqlite3", dbFile, script)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to execute SQL script: %s, output: %s", err, output)
	}
	logs.Log.Info("executeSQLScript success", zap.String("output", string(output)))

	// 初始化 llm 插件
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model)\nVALUES (1, 'AI 助手', 'default', 'jimu-ChatGPT', 'qwen2.5:3b')")
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model, float_view)\nVALUES (2, '编程助手', 'programming', 'jimu-code', 'llama3:latest', 'ProgrammingAssistantPanelView')")
	db.DB.Exec("insert into app_chat_plugin(id, name, code, icon, model, float_view)\nVALUES (3, '知识库', 'knowledge', 'jimu-zhishi', 'qwen2:7b', 'KnowledgePanelView')")
	db.DB.Exec("insert into app_setting(id, name, value)\nVALUES (1, 'API', 'ApiSetting')")

	return nil
}
