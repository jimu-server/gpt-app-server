package pageutils

import (
	"errors"
	"strconv"
)

/*
PageHelp 手动分页助手
@Param data 待分页数据
@Param page 页码
@Param size 条数
@Return result 分页数据
@Return count 数据总条数
*/
func PageHelp(data []interface{}, page, size interface{}) (result []interface{}, count int64, err error) {
	if data == nil {
		return
	}
	sum := len(data)
	count = int64(sum)
	limit, offset := 0, 0
	if limit, offset, err = PageNumber(page, size); err != nil {
		return
	}
	// 首页
	if offset == 0 && sum <= limit {
		result = data
	}
	// 尾页
	if offset+limit > sum {
		sp := offset + limit - sum
		r := limit - sp
		result = data[sum-r:]
	}
	if offset+limit < sum {
		result = data[offset : offset+limit]
	}
	return
}

/*
PageNumber 解析分页页号
@Param page 当前切换到的页号
@Param size 分页大小
@Return limit 返回分页limit参数
@Return offset 返回分页offset参数
*/
func PageNumber(page, size any) (limit, offset int, err error) {
	var start, count int
	if start, err = getInt(page); err != nil {
		return
	}
	if count, err = getInt(size); err != nil {
		return
	}
	if start-1 < 0 {
		return -1, -1, errors.New("页码错误")
	}
	limit = count
	offset = (start - 1) * count
	return
}

func getInt(value any) (int, error) {
	var err error
	var v int
	switch value.(type) {
	case string:
		v, err = strconv.Atoi(value.(string))
	case int:
		v = value.(int)
	case float64:
		v = int(value.(float64))
	}
	return v, err
}
