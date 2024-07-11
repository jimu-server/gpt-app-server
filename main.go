package main

import (
	"fmt"
	_ "github.com/jimu-server/gpt-desktop/gpt"
	"github.com/jimu-server/gpt-desktop/logger"
	"github.com/jimu-server/gpt-desktop/web"
	"go.uber.org/zap"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%s", "0.0.0.0", "8080"),
		Handler: web.Engine,
	}
	go func() {
		if err := server.ListenAndServe(); err != nil {
			panic(err.Error())
		}
	}()

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
	select {
	case <-signals:
		if err := zap.L().Sync(); err != nil {
			logger.Logger.Error("sync zap log error", zap.Error(err))
		}
		if err := server.Close(); err != nil {
			logger.Logger.Error("close server error", zap.Error(err))
		}
		logger.Logger.Info("server shutdown")
	}
}
