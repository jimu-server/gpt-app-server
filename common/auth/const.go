package auth

import "common/cache"

// UserId 从 gin.Context 中获取  用户ID
const UserId = "UserId"

// UserToken 从 gin.Context 中获取  用户Token
const UserToken = "UserToken"

const TokenCachePrefix = "user" + cache.Separator + "token" + cache.Separator
