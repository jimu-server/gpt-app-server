package req

type PageDTO struct {
	// 页码
	PageNum int `json:"pageNum" example:"1"`
	// 每页数量
	PageSize int `json:"pageSize" example:"10"`
}
