package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/jimu-server/common/resp"
)

// Key 从 gin.Context 中获取 Token 的key
const Key = "Token"

// GptAuthorization 身份验证中间件
// 解析当前用户 id 和当前组织信息
// urls 配置在用户访问权限中需要过滤放行的 url 接口
func GptAuthorization(urls ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		respResult := resp.Error(resp.AuthorizationExpired, resp.Msg("身份验证失败"), resp.Code(resp.TokenErr))
		tokenString := c.GetHeader("Authorization")
		orgId := c.GetHeader("Orgid")
		/*requestURI := c.Request.RequestURI
		if orgId == "" && !slices.Contains(urls, requestURI) {
			c.AbortWithStatusJSON(500, resp.Error(resp.AuthorizationExpired, resp.Msg("组织机构验证失败")))
		}
		if tokenString == "" {
			// websocket 身份校验
			if tokenString = c.GetHeader("Sec-Websocket-Protocol"); tokenString == "" {
				c.AbortWithStatusJSON(500, resp.Error(resp.AuthorizationExpired, resp.Msg("身份验证失败")))
				return
			}
		}
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = tokenString[7:]
		}*/
		v, err := ParseToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(500, respResult)
			return
		}
		v.Value = ""
		v.OrgId = orgId
		c.Set(Key, v)
		c.Next()
	}
}

func ParseToken(tokenString string) (*Token, error) {
	data := &Token{
		Id: "1",
	}
	/*	_, err := jwt.ParseWithClaims(tokenString, data, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); ok {
			return []byte(config.Evn.App.Key), nil
		}
		return []byte(config.Evn.App.Key), nil
	})*/

	/*	if err != nil {
		return nil, err
	}*/
	return data, nil
}

type Token struct {
	jwt.StandardClaims
	// 当前用户id
	Id string
	// token
	Value string
	// 当前用户所属机构id
	OrgId string
}
