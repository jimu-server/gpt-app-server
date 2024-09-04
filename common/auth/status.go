package auth

import "sync"

var DefaultStatus CacheStatus = NewDefaultCacheStatusManage()

type CacheStatus interface {
	// 向缓存添加token状态
	Put(token string) error
	// 从缓存中获取token状态 true表示已登录 false表示未登录
	Get(token string) bool
	// 删除token状态
	Delete(token string) error
}

// DefaultCacheStatusManage
// 默认的缓存状态管理器, 基于map实现简单提供缓存功能
type DefaultCacheStatusManage struct {
	cache map[string]struct{}
	mx    sync.RWMutex
}

func (receiver *DefaultCacheStatusManage) Put(token string) error {
	receiver.mx.Lock()
	defer receiver.mx.Unlock()
	receiver.cache[token] = struct{}{}
	return nil
}

func (receiver *DefaultCacheStatusManage) Get(token string) bool {
	receiver.mx.RLock()
	defer receiver.mx.RUnlock()
	if _, ok := receiver.cache[token]; ok {
		return true
	}
	return false
}

func (receiver *DefaultCacheStatusManage) Delete(token string) error {
	receiver.mx.Lock()
	defer receiver.mx.Unlock()
	delete(receiver.cache, token)
	return nil
}

func NewDefaultCacheStatusManage() *DefaultCacheStatusManage {
	return &DefaultCacheStatusManage{
		cache: make(map[string]struct{}),
	}
}
