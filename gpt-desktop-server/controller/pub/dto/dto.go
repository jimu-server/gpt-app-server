package dto

type LoginDTO struct {
	// 用户名
	Username string `json:"username" example:"root"`
	// 密码
	Password string `json:"password" example:"123456"`
}
