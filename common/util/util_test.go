package util

import (
	"github.com/bwmarrin/snowflake"
	"log"
	"testing"
)

func TestUUID(t *testing.T) {

}

func isValid(s string) bool {
	if len(s) == 1 || len(s) == 0 || len(s)%2 != 0 {
		return false
	}
	buf := []byte(s)
	stack := make([]byte, len(s))
	stack[0] = buf[0]
	if buf[0] == 41 || buf[0] == 93 || buf[0] == 125 || buf[len(buf)-1] == 40 || buf[len(buf)-1] == 91 || buf[len(buf)-1] == 123 {
		return false
	}
	index := 0
	for i := 1; i < len(buf); i++ {
		if index+1 == len(stack) {
			return false
		}
		if index == 0 && stack[index] == 0 {
			stack[index] = buf[i]
			continue
		}
		if buf[i] > 41 && stack[index]+2 != buf[i] {
			index++
			stack[index] = buf[i]
			continue
		}
		if buf[i] <= 41 && stack[index]+1 != buf[i] {
			index++
			stack[index] = buf[i]
			continue
		}

		if buf[i] > 41 && stack[index]+2 == buf[i] {
			if index != 0 {
				stack[index] = 0
				index--
				continue
			}
			stack[index] = 0
		}
		if buf[i] <= 41 && stack[index]+1 == buf[i] {
			if index != 0 {
				stack[index] = 0
				index--
				continue
			}
			stack[index] = 0
		}
	}
	return index == 0
}

func addStrings(num1 string, num2 string) string {
	// 判断大小数
	maxv := num1
	minv := num2
	if len(num2) > len(num1) {
		maxv = num2
		minv = num1
	}
	// 预留进位
	maxa := make([]byte, 1)
	maxa = append(maxa, []byte(maxv)...)
	maxa[0] = 48
	mina := []byte(minv)
	// 数字对齐
	sub := len(maxa) - len(mina)
	// 进位标识
	add := 0
	for i := len(mina) - 1; i >= 0; i-- {
		v1 := int(maxa[sub+i] - 48)
		v2 := int(mina[i] - 48)
		value := v1 + v2 + add
		if value >= 10 {
			v := value % 10
			maxa[sub+i] = byte(v + 48)
			add = 1
			continue
		}
		maxa[sub+i] = byte(value + 48)
		add = 0
	}
	for i := sub - 1; i >= 0; i-- {
		if add != 0 {
			v1 := int(maxa[i]-48) + add
			if v1 >= 10 {
				add = 1
				maxa[i] = byte(48)
				continue
			}
			maxa[i] = byte(v1 + 48)
			add = 0
		}
	}
	if maxa[0] == 48 {
		return string(maxa[1:])
	}
	return string(maxa)
}

func search(nums []int, target int) int {
	if len(nums) == 0 {
		return -1
	}
	index := len(nums) / 2
	for index >= 0 && index < len(nums) {
		if nums[index] == target {
			return index
		}
		if nums[index] < target {
			if i := search(nums[index+1:], target); i != -1 {
				return index + i
			}
		}
		if nums[index] > target {
			if i := search(nums[:index], target); i != -1 {
				return index + i
			}
		}
	}
	return -1
}

func TestName(t *testing.T) {
	var err error
	var node *snowflake.Node
	if node, err = snowflake.NewNode(0); err != nil {
		return
	}
	id := node.Generate()
	log.Println(len(id.Base64()))
	log.Println(len(id.String()))
	log.Println(id.Int64())
}
