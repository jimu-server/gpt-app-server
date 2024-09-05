package pub

import (
	"common/web"
)

func init() {
	group := web.Engine.Group("/api")
	group.POST("/login", Login)
}
