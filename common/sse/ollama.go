package sse

import (
	"bufio"
	"errors"
	jsoniter "github.com/json-iterator/go"
	"github.com/ollama/ollama/format"
	"go.uber.org/zap"
	"io"
	"net/http"
)

func OllamaStream(req *http.Request) Reader {
	return func(write chan<- any) {
		defer close(write)
		defer func() {
			if err := recover(); err != nil {
				switch e := err.(type) {
				case string:
					zap.L().Error("OllamaStream panic", zap.String("panic", e))
				case error:
					zap.L().Error("OllamaStream error", zap.Error(e))
				default:
					zap.L().Error("OllamaStream panic", zap.Any("panic", e))
				}
				return
			}
		}()
		var err error
		var buf []byte
		var data any
		client := pool.Get().(*http.Client)
		response, err := client.Do(req)
		// 使用 bufio.NewReader 创建一个读取器，方便按行读取
		scanner := bufio.NewScanner(response.Body)
		scanBuf := make([]byte, 0, 512*format.KiloByte)
		scanner.Buffer(scanBuf, 512*format.KiloByte)
		for scanner.Scan() {
			buf = scanner.Bytes()
			if err = scanner.Err(); err == io.EOF {
				break // 文件结束
			} else if errors.Is(err, io.ErrUnexpectedEOF) || errors.Is(err, io.ErrClosedPipe) {
				zap.L().Error("OllamaStream read data error", zap.Error(err))
				break
			} else if err != nil {
				zap.L().Error("OllamaStream unmarshal data error", zap.Error(err))
				break
			}
			if err = jsoniter.Unmarshal(buf, &data); err != nil {
				zap.L().Error("OllamaStream unmarshal data error", zap.Error(err))
				break
			}
			write <- data
		}
	}
}
