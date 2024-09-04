package logger

import (
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
	"os"
	"path/filepath"
	"time"
)

func GetEncoderConfig() zapcore.EncoderConfig {
	return zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,   // 日志换行符号
		EncodeLevel:    zapcore.CapitalLevelEncoder, // 大写编码器
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder, // 路径编码器
		EncodeName:     zapcore.FullNameEncoder,
		EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
			// 自定义时间编码格式
			enc.AppendString(t.Format(time.DateTime))
		},
	}
}

// ErrorFileOutput
// zap 错误日志输出文件配置
func ErrorFileOutput(dir, filename string, size, backups, age int) zapcore.WriteSyncer {
	// 创建ERROR日志持久化
	filename = filepath.Join(dir, filename)
	errorLog := &lumberjack.Logger{
		Filename:   filename + "-err.log",
		MaxSize:    size,
		MaxBackups: backups,
		MaxAge:     age,
	}
	return zapcore.AddSync(errorLog)
}

// ConsoleFileOutput
// zap 控制台日志持久化
func ConsoleFileOutput(dir, filename string, size, backups, age int) zapcore.WriteSyncer {
	// 创建控制台日志持久化
	filename = filepath.Join(dir, filename)
	consoleLog := &lumberjack.Logger{
		Filename:   filename + ".log",
		MaxSize:    size, // megabytes
		MaxBackups: backups,
		MaxAge:     age, //days
	}
	return zapcore.AddSync(consoleLog)
}

// ConsoleOutput
// zap 控制台日志输出
func ConsoleOutput() zapcore.WriteSyncer {
	return zapcore.AddSync(os.Stdout)
}

func ConsoleEncoder() zapcore.Encoder {
	return zapcore.NewConsoleEncoder(GetEncoderConfig())
}

func JSONEncoder() zapcore.Encoder {
	return zapcore.NewJSONEncoder(GetEncoderConfig())
}
