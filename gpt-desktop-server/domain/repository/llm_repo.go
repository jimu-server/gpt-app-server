package repository

type IChat interface {
	SaveMessage() error
	UpdateMessage() error
	DeleteMessage() error
	GetMessages() ([]string, error)
}
