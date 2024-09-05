package pub

import (
	"common/auth"
	"common/resp"
	"common/util/accountutil"
	"common/web"
	"errors"
	"github.com/gin-gonic/gin"
	"gpt-desktop/config"
	"gpt-desktop/model"

	"gpt-desktop/controller/pub/dto"
	"gpt-desktop/db"
	"gpt-desktop/logs"
)

// Login
// @Summary      用户登录
// @Description  输入账号密码登录，登陆成功返回登录token
// @Tags         用户
// @Accept       json
// @Param        args body  dto.LoginDTO true "登录参数l"
// @Produce      json
// @Success      200  {object}  resp.Response{code=int,data=any,msg=string}
// @Failure      500  {object}  resp.Response{code=int,data=any,msg=string}
// @Router       /api/login [post]
func Login(c *gin.Context) {
	var err error
	var user model.User
	loginDTO := web.BindJSON[*dto.LoginDTO](c)
	if loginDTO.Password, err = accountutil.Password(loginDTO.Password); err != nil {
		resp.ERROR(c, err)
		return
	}
	find := db.DB.Where("account=?", loginDTO.Username).Find(&user)
	if find.Error != nil {
		logs.Log.Error("数据库查询错误")
		resp.ERROR(c, find.Error)
		return
	}
	// 校验密码
	if accountutil.VerifyPasswd(user.Password, loginDTO.Password) {
		resp.ERROR(c, errors.New("用户名或密码错误"))
		return
	}
	// 生成token
	token, err := auth.GenAuth(user.Id, config.Evn.Auth.AccessSecret, config.Evn.Auth.AccessExpire)
	if err != nil {
		logs.Log.Error("用户 Token 生成失败")
		resp.ERROR(c, errors.Join(err, errors.New("token generation failed")))
		return
	}
	auth.DefaultStatus.Put(auth.TokenCachePrefix + token)
	resp.SUCCESS(c, map[string]string{
		"token": token,
	})
	return
}
