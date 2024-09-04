package auth

import (
	"common/resp"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"strings"
	"time"
)

type Token struct {
	jwt.StandardClaims `json:"jwt.StandardClaims"`
	Id                 any `json:"id"`
}

// GenAuth
// 生成token
// @param account 用户信息
// @param secret 密钥
// @param expire 过期时间
// @return token
func GenAuth[T int | int64 | string](userId T, secret string, expire int64) (string, error) {
	s := time.Now().Format(time.DateTime)
	// 设置token10天过期
	parse, err := time.Parse(time.DateTime, time.Now().Add(time.Duration(expire)*time.Second).Format(time.DateTime))
	if err != nil {
		return "", err
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodHS512, Token{
		StandardClaims: jwt.StandardClaims{
			Issuer:    s,
			ExpiresAt: parse.Unix(),
		},
		Id: userId,
	})
	var token string
	if token, err = claims.SignedString([]byte(secret)); err != nil {
		return "", err
	}
	return token, nil
}

func ParseToken(tokenString, secret string) (*Token, error) {
	data := &Token{}
	_, err := jwt.ParseWithClaims(tokenString, data, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); ok {
			return []byte(secret), nil
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	return data, err
}

// Authorization 身份验证中间件
// 解析当前用户 id 和当前组织信息
// urls 配置在用户访问权限中需要过滤放行的 url 接口
func Authorization(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		respResult := resp.Error(resp.AuthorizationExpired, resp.Msg("身份验证失败"), resp.Code(resp.TokenErr))
		tokenString := c.GetHeader("Authorization")
		// 校验 token 是否存在
		if tokenString == "" {
			// websocket 身份校验
			if tokenString = c.GetHeader("Sec-Websocket-Protocol"); tokenString == "" {
				c.AbortWithStatusJSON(500, resp.Error(resp.NotLoggedIn, resp.Code(resp.NotLoginCode)))
				return
			}
		}
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = tokenString[7:]
		}
		// 验证 token 是否有效
		if DefaultStatus.Get(TokenCachePrefix + tokenString) {
			c.AbortWithStatusJSON(500, resp.Error(resp.NotLoggedIn, resp.Code(resp.NotLoginCode)))
			return
		}
		v, err := ParseToken(tokenString, secret)
		if err != nil {
			c.AbortWithStatusJSON(500, respResult)
			return
		}
		// 设置当前用户信息
		c.Set(UserId, v.Id)
		// 设置当前用户 token
		c.Set(UserToken, tokenString)
		c.Next()
	}
}
