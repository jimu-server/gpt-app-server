package resp

import (
	jsoniter "github.com/json-iterator/go"
	"strings"
)

type Option func(*Response)

// Response 请求处理统一返回结果
type Response struct {
	Code int    `json:"code" example:"200"`    // 业务状态码
	Msg  string `json:"msg" example:"success"` // 附加消息
	Data any    `json:"data"`                  // 响应数据
}

// Unknown 未知操作
func Unknown() Response {
	return Response{
		Code: Err,
		Msg:  "unknown",
		Data: nil,
	}
}

func (msg Response) String() string {
	marshal, err := jsoniter.Marshal(msg)
	if err != nil {
		return ""
	}
	return string(marshal)
}

// Page 分页数据
type Page struct {
	Count int64 `json:"count" example:"100"`       //总数
	Rows  any   `json:"rows" example:"[]any data"` //数据内容
}

func NewPage(count int64, data any) *Page {
	return &Page{
		Count: count,
		Rows:  data,
	}
}

func Success(data any, option ...Option) Response {
	r := Response{
		Code: Ok,
		Data: data,
	}
	for _, o := range option {
		o(&r)
	}
	return r
}

// Error 错误响应
// err 代码错误信息
// option 配置项
func Error(err error, option ...Option) Response {
	msg := ""
	if err != nil {
		msg = err.Error()
	}
	r := Response{
		Code: Err,
		Msg:  msg,
	}
	for _, o := range option {
		o(&r)
	}
	return r
}

func Msg(msg ...string) Option {
	return func(r *Response) {
		msg = append(msg, r.Msg)
		r.Msg = strings.Join(msg, "")
	}
}

func Code(code int) Option {
	return func(r *Response) {
		r.Code = code
	}
}
