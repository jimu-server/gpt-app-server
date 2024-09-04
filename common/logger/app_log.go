package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type AppLog struct {
	*zap.Logger
	filename   string
	maxSize    int
	maxBackups int
	maxAge     int
	level      string
	path       string
}

type Option func(*AppLog)

func Level(level string) Option {
	return func(log *AppLog) {
		log.level = level
	}
}
func FileName(filename string) Option {
	return func(log *AppLog) {
		log.filename = filename
	}
}

func MaxSize(size int) Option {
	return func(log *AppLog) {
		log.maxSize = size
	}
}

func FilePath(path string) Option {
	return func(log *AppLog) {
		log.path = path
	}
}

func MaxBackups(backups int) Option {
	return func(log *AppLog) {
		log.maxBackups = backups
	}
}

func MaxAge(maxage int) Option {
	return func(log *AppLog) {
		log.maxAge = maxage
	}
}

func NewAppLog(options ...Option) *AppLog {
	a := &AppLog{}
	for _, option := range options {
		option(a)
	}
	if a.filename == "" {
		a.filename = "app"
	}
	if a.level == "" {
		a.level = "info"
	}
	FilePath := a.path
	FileName := a.filename
	MaxSize := a.maxSize // megabytes
	MaxBackups := a.maxBackups
	MaxAge := a.maxAge // days
	Level := a.level
	var zapLevel zapcore.Level
	err := zapLevel.Set(Level)
	if err != nil {
		panic(err.Error())
	}
	// 处理对应 Level 日志
	consoleFileOutput := ConsoleFileOutput(FilePath, FileName, MaxSize, MaxBackups, MaxAge)
	// 控制台输出正常文本编码
	consoleWriteSyncer := zapcore.AddSync(ConsoleOutput())
	core := zapcore.NewCore(ConsoleEncoder(), consoleWriteSyncer, zapLevel)
	// 持久化日志写入 json编码
	fileWriteSyncer := zapcore.AddSync(consoleFileOutput)
	fileCore := zapcore.NewCore(JSONEncoder(), fileWriteSyncer, zapLevel)
	// 只处理 error级别错误写入
	errorFileOutput := ErrorFileOutput(FilePath, FileName, MaxSize, MaxBackups, MaxAge)
	errCore := zapcore.NewCore(JSONEncoder(), zapcore.AddSync(errorFileOutput), zapcore.ErrorLevel)
	Tree := zapcore.NewTee(core, fileCore, errCore)
	l := zap.New(Tree, zap.AddCaller())
	zap.ReplaceGlobals(l)
	return &AppLog{
		Logger: l,
	}
}
