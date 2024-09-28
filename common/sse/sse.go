package sse

import (
	"bytes"
	jsoniter "github.com/json-iterator/go"
	"net/http"
	"sync"
)

var pool *sync.Pool

const (
	segmentation = "\n"
)

// Reader 自定义第三方 SSE 实现读取
type Reader func(write chan<- any)

func init() {
	pool = &sync.Pool{New: func() interface{} {
		return &http.Client{}
	}}
}

type HttpSSE interface {
	// Writer 向SSE中写入数据
	Writer(data any) error
	// Read reader中读取SSE数据 到 <-chan T
	Read(reader Reader) <-chan any
}

type Options func(sse *SSE)

type SSE struct {
	writer chan any
	http.ResponseWriter
	http.Flusher
}

func NewSSE(w http.ResponseWriter, opts ...Options) HttpSSE {
	sse := &SSE{
		writer:         make(chan any),
		ResponseWriter: w,
	}
	if w != nil {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		sse.Flusher = w.(http.Flusher)
	}
	for _, opt := range opts {
		opt(sse)
	}
	return sse
}

func WithDataChannelSize(size int) Options {
	return func(sse *SSE) {
		sse.writer = make(chan any, size)
	}
}

func (s *SSE) Writer(data any) error {
	var buf []byte
	var err error
	defer s.Flusher.Flush()
	switch v := data.(type) {
	case string:
		if _, err = s.ResponseWriter.Write([]byte(v + segmentation)); err != nil {
			return err
		}
	default:
		if buf, err = jsoniter.Marshal(v); err != nil {
			return err
		}
		buffer := bytes.NewBuffer(buf)
		buffer.WriteString(segmentation)
		if _, err = buffer.WriteTo(s.ResponseWriter); err != nil {
			return err
		}
	}
	return nil
}

func (s *SSE) Read(reader Reader) <-chan any {
	go reader(s.writer)
	return s.writer
}
