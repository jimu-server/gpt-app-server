package accountutil

import (
	"golang.org/x/crypto/bcrypt"
)

// Password 生成加密密码
// @param password 输入的密码
func Password(password string) (string, error) {
	fromPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(fromPassword), nil
}

// VerifyPasswd 验证密码是否正确
// @param source 数据库密码
// @param passwd 用户输入的密码
// @return bool true 密码验证成功 false 密码验证失败
func VerifyPasswd(source, passwd string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(source), []byte(passwd)); err != nil {
		return false
	}
	return true
}
