package web

import (
	"github.com/gin-gonic/gin"
	"gpt-desktop/logs"
	"net/http"
)

var Engine = gin.New()

func init() {
	Engine.Use(logs.GinLogger(), GlobalException(), Cors())
}

// Cors 跨域处理
func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin) // 可将将 * 替换为指定的域名
			c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
			c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,Orgid")
			c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
			c.Header("Access-Control-Allow-Credentials", "true")
		}
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}

func BindJSON[T any](ctx *gin.Context) T {
	var data T
	if err := ctx.BindJSON(&data); err != nil {
		panic(ArgsErr(err.Error()))
	}
	return data
}

func ShouldJSON[T any](ctx *gin.Context) T {
	var data T
	if err := ctx.ShouldBind(&data); err != nil {
		panic(ArgsErr(err.Error()))
	}
	return data
}
func ShouldBindUri[T any](ctx *gin.Context) T {
	var data T
	if err := ctx.ShouldBindUri(&data); err != nil {
		panic(ArgsErr(err.Error()))
	}
	return data
}
