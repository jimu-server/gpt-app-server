package resp

import (
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
)

func SUCCESS(c *gin.Context, data any) {
	c.JSON(http.StatusOK, Success(data))
}

func ERROR(c *gin.Context, err error) {
	c.JSON(http.StatusBadGateway, Error(errors.Join(errors.New("系统错误"), err)))
}
