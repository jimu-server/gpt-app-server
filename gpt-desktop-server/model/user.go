package model

import "time"

// User 用户模型
type User struct {
	Id         string    `gorm:"column:id;primaryKey" json:"id"`       // id
	Name       string    `gorm:"column:name" json:"name"`              // 昵称
	Account    string    `gorm:"column:account" json:"account"`        // 账号
	Password   string    `gorm:"column:password" json:"-"`             // 密码
	Phone      string    `gorm:"column:phone" json:"phone"`            // 电话
	Email      string    `gorm:"column:email" json:"email"`            // 邮箱
	Picture    string    `gorm:"column:picture" json:"picture"`        // 头像
	Gender     int       `gorm:"column:gender" json:"gender"`          // 性别
	Age        int       `gorm:"column:age" json:"age"`                // 年龄
	Status     bool      `gorm:"column:status" json:"status"`          // 是否启用
	CreateTime time.Time `gorm:"column:create_time" json:"createTime"` // 创建时间
	UpdateTime time.Time `gorm:"column:update_time" json:"updateTime"` // 更新时间
}

func (*User) TableName() string {
	return "user"
}
