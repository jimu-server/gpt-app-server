package llm_sdk

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	jsoniter "github.com/json-iterator/go"
	"github.com/ollama/ollama/api"
	"github.com/ollama/ollama/format"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
)

var pool *sync.Pool

var ollama_host, ollama_port = "127.0.0.1", "11434"

type Executor func() (DataEvent[any], error)

type Option func(sdk *OllamaSdk)

var defaultSdk = newOllama()

func init() {
	// 初始化 sdk ollama 默认读取环境中的配置信息
	var err error
	ollama_host, ollama_port, err = net.SplitHostPort(strings.Trim(os.Getenv("OLLAMA_HOST"), "\"'"))
	if err != nil {
		ollama_host, ollama_port = "127.0.0.1", "11434"
		if ip := net.ParseIP(strings.Trim(os.Getenv("OLLAMA_HOST"), "[]")); ip != nil {
			ollama_host = ip.String()
		}
	}
	pool = &sync.Pool{New: func() interface{} {
		return &http.Client{}
	}}
}

type ollamaStream[T any] struct {
	entity T
	body   *bytes.Buffer
	err    error
	resp   *http.Response
}

func (s *ollamaStream[T]) Close() error {
	return s.resp.Body.Close()
}

func (s *ollamaStream[T]) Body() *bytes.Buffer {
	return s.body
}

func (s *ollamaStream[T]) Data() T {
	return s.entity
}

type DataEvent[T any] <-chan LLMStream[T]

// Chat
// 模型对话聊天
func Chat[T any](req *api.ChatRequest) (DataEvent[T], error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s:%s/api/chat", ollama_host, ollama_port)
	request, err = http.NewRequest(http.MethodPost, url, buffer)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	return stream[T](do)
}

func Pull[T any](req *api.PullRequest) (DataEvent[T], error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s:%s/api/pull", ollama_host, ollama_port)
	request, err = http.NewRequest(http.MethodPost, url, buffer)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	return stream[T](do)
}

// ModelInfo
// 获取模型信息
func ModelInfo(server string, req *api.ShowRequest) (*api.ShowResponse, error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s/api/show", server)
	request, err = http.NewRequest(http.MethodPost, url, buffer)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	var data *api.ShowResponse
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return nil, err
	}
	if err = jsoniter.Unmarshal(readAll, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func ModelList(server string) (*api.ListResponse, error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	url := fmt.Sprintf("%s/api/tags", server)
	request, err = http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	var data *api.ListResponse
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return nil, err
	}
	if err = jsoniter.Unmarshal(readAll, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func DeleteModel(req *api.DeleteRequest) error {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s:%s/api/delete", ollama_host, ollama_port)
	if request, err = http.NewRequest(http.MethodDelete, url, buffer); err != nil {
		return err
	}
	do, err := client.Do(request)
	if err != nil {
		return err
	}
	if do.StatusCode == http.StatusOK {
		return nil
	}
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return err
	}
	return errors.New(string(readAll))
}

func CreateModel[T any](req *api.CreateRequest) (DataEvent[T], error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s:%s/api/create", ollama_host, ollama_port)
	if request, err = http.NewRequest(http.MethodPost, url, buffer); err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	return stream[T](do)
}

func stream[T any](response *http.Response) (DataEvent[T], error) {
	send := make(chan LLMStream[T], 100)
	go func() {
		var err error
		var buf []byte
		var data T

		// 使用 bufio.NewReader 创建一个读取器，方便按行读取
		scanner := bufio.NewScanner(response.Body)
		scanBuf := make([]byte, 0, 512*format.KiloByte)
		scanner.Buffer(scanBuf, 512*format.KiloByte)
		// 创建一个通道
		defer close(send)
		for scanner.Scan() {
			buf = scanner.Bytes()
			streamData := &ollamaStream[T]{}
			if err = scanner.Err(); err == io.EOF {
				break // 文件结束
			} else if errors.Is(err, io.ErrUnexpectedEOF) || errors.Is(err, io.ErrClosedPipe) {
				streamData.err = err
				send <- streamData
				break
			} else if err != nil {
				streamData.err = err
				send <- streamData
				break
			}
			if err = jsoniter.Unmarshal(buf, &data); err != nil {
				streamData.err = err
				send <- streamData
				break
			}
			streamData.entity = data
			streamData.resp = response
			streamData.body = bytes.NewBuffer(buf)
			send <- streamData
		}
	}()
	return send, nil
}

func Host(host string) Option {
	return func(sdk *OllamaSdk) {
		sdk.host = host
	}
}
func Port(port string) Option {
	return func(sdk *OllamaSdk) {
		sdk.port = port
	}
}

func Scheme(scheme string) Option {
	return func(sdk *OllamaSdk) {
		sdk.scheme = scheme
	}
}

func newOllama(options ...Option) *OllamaSdk {
	o := &OllamaSdk{
		scheme: "http",
		host:   ollama_host,
		port:   ollama_port,
	}
	for _, option := range options {
		option(o)
	}
	o.url = fmt.Sprintf("%s://%s:%s", o.scheme, o.host, o.port)
	return o
}

func NewOllama(options ...Option) *OllamaSdk {
	sdk := newOllama(options...)
	defaultSdk = sdk
	return sdk
}

type OllamaSdk struct {
	scheme string
	url    string
	host   string
	port   string
}

func (sdk *OllamaSdk) Clone() *OllamaSdk {
	o := &OllamaSdk{
		scheme: sdk.scheme,
		url:    sdk.url,
		host:   sdk.host,
		port:   sdk.port,
	}
	return o
}

func (sdk *OllamaSdk) Host(host string) *OllamaSdk {
	clone := sdk.Clone()
	clone.host = host
	clone.url = fmt.Sprintf("%s://%s:%s", clone.scheme, clone.host, clone.port)
	return clone
}

func (sdk *OllamaSdk) Port(port string) *OllamaSdk {
	clone := sdk.Clone()
	clone.port = port
	clone.url = fmt.Sprintf("%s://%s:%s", clone.scheme, clone.host, clone.port)
	return clone
}

func (sdk *OllamaSdk) Scheme(scheme string) *OllamaSdk {
	clone := sdk.Clone()
	clone.scheme = scheme
	clone.url = fmt.Sprintf("%s://%s:%s", clone.scheme, clone.host, clone.port)
	return clone
}

func (sdk *OllamaSdk) DeleteModel(req *api.DeleteRequest) error {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s:%s/api/delete", ollama_host, ollama_port)
	if request, err = http.NewRequest(http.MethodDelete, url, buffer); err != nil {
		return err
	}
	do, err := client.Do(request)
	if err != nil {
		return err
	}
	if do.StatusCode == http.StatusOK {
		return nil
	}
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return err
	}
	return errors.New(string(readAll))
}

func (sdk *OllamaSdk) ModelInfo(server string, req *api.ShowRequest) (*api.ShowResponse, error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	marshal, err := jsoniter.Marshal(req)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(marshal)
	url := fmt.Sprintf("http://%s/api/show", server)
	request, err = http.NewRequest(http.MethodPost, url, buffer)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	var data *api.ShowResponse
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return nil, err
	}
	if err = jsoniter.Unmarshal(readAll, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func (sdk *OllamaSdk) ModelList(server string) (*api.ListResponse, error) {
	client := pool.Get().(*http.Client)
	var err error
	var request *http.Request
	url := fmt.Sprintf("%s/api/tags", server)
	request, err = http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	do, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	var data *api.ListResponse
	var readAll []byte
	if readAll, err = io.ReadAll(do.Body); err != nil {
		return nil, err
	}
	if err = jsoniter.Unmarshal(readAll, &data); err != nil {
		return nil, err
	}
	return data, nil
}

func (sdk *OllamaSdk) Stream(executor Executor) (DataEvent[any], error) {
	return executor()
}
