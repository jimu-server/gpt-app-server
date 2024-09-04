package resp

const (
	Err = 999 // 业务失败
	Ok  = 200 // 业务成功

	WebErr       = 1000 // 系统错误
	WebArgsErr   = 1001 // 参数解析错误
	TokenErr     = 1002 // 身份验证失败
	NotLoginCode = 1003 // 未登录
	LoginExpired = 1004 // 登录已过期

	CheckPasswordErr = 1003 // 密码错误

	EmailVerifyErr = 1004 // 邮箱验证失败业务代码

	PhoneCodeTimeError = 1005 // 手机验证码过期
)
