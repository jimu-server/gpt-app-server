package llm

type LLM interface {
	ChatStream(string)
	ChatComplete(string)
	Gen()
}
