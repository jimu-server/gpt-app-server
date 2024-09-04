package resp

import "errors"

var (
	// token 失效
	AuthorizationExpired = errors.New("token expired")
	// 用户未登录
	NotLoggedIn = errors.New("Not logged in")
)
