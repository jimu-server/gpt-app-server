package sse

type Progress struct {
	Value   float64
	Message string
}

func NewProgress(value float64, message string) *Progress {
	return &Progress{Value: value, Message: message}
}
