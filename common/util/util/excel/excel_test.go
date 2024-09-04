package excel

import (
	"github.com/xuri/excelize/v2"
	"testing"
)

func TestToJson(t *testing.T) {
	file, err := excelize.OpenFile("税屋全部数据.xlsx")
	if err != nil {
		t.Error(err.Error())
		return
	}
	defer func() {
		err := file.Close()
		if err != nil {
			t.Error(err.Error())
			return
		}
	}()
	var rows [][]string
	if rows, err = file.GetRows("Sheet1"); err != nil {
		t.Error(err.Error())
		return
	}
	file.GetCols("Sheet1")
	t.Log(len(rows))
}
