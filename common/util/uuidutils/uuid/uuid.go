package uuid

import (
	"github.com/bwmarrin/snowflake"
	"github.com/jimu-server/config"
)

var node *snowflake.Node

func init() {
	var err error
	if node, err = snowflake.NewNode(config.Evn.App.Number); err != nil {
		panic(err)
	}
}

// String 生成UUID字符串
func String() string {
	return node.Generate().Base64()
}
