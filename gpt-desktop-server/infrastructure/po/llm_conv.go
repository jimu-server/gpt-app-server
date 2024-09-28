package po

import "gpt-desktop/domain/entity"

func NewConversationEntity(po *ConversationPO) *entity.ConversationEntity {
	return &entity.ConversationEntity{
		ID:         po.ID,
		Picture:    po.Picture,
		Title:      po.Title,
		LastModel:  po.LastModel,
		LastMsg:    po.LastMsg,
		LastTime:   po.LastTime,
		IsDelete:   po.IsDelete,
		CreateTime: po.CreateTime,
	}
}
func NewConversationPO(conversationEntity *entity.ConversationEntity) *ConversationPO {
	return &ConversationPO{
		ID:         conversationEntity.ID,
		Picture:    conversationEntity.Picture,
		Title:      conversationEntity.Title,
		LastModel:  conversationEntity.LastModel,
		LastMsg:    conversationEntity.LastMsg,
		LastTime:   conversationEntity.LastTime,
		IsDelete:   conversationEntity.IsDelete,
		CreateTime: conversationEntity.CreateTime,
	}
}

func NewPluginEntity(po *PluginPO) *entity.PluginEntity {
	return &entity.PluginEntity{
		ID:         po.ID,
		Name:       po.Name,
		Code:       po.Code,
		Icon:       po.Icon,
		Model:      po.Model,
		FloatView:  po.FloatView,
		Props:      po.Props,
		Status:     po.Status,
		CreateTime: po.CreateTime,
	}
}
func NewPluginPO(pluginEntity *entity.PluginEntity) *PluginPO {
	return &PluginPO{
		ID:         pluginEntity.ID,
		Name:       pluginEntity.Name,
		Code:       pluginEntity.Code,
		Icon:       pluginEntity.Icon,
		Model:      pluginEntity.Model,
		FloatView:  pluginEntity.FloatView,
		Props:      pluginEntity.Props,
		Status:     pluginEntity.Status,
		CreateTime: pluginEntity.CreateTime,
	}
}

func NewMessageEntity(po *MessagePO) *entity.MessageEntity {
	return &entity.MessageEntity{
		ID:             po.ID,
		ConversationID: po.ConversationID,
		Picture:        po.Picture,
		MessageID:      po.MessageID,
		ModelID:        po.ModelID,
		Role:           po.Role,
		Content:        po.Content,
		CreateTime:     po.CreateTime,
		IsDelete:       po.IsDelete,
	}
}
func NewMessagePO(messageEntity *entity.MessageEntity) *MessagePO {
	return &MessagePO{
		ID:             messageEntity.ID,
		ConversationID: messageEntity.ConversationID,
		Picture:        messageEntity.Picture,
		MessageID:      messageEntity.MessageID,
		ModelID:        messageEntity.ModelID,
		Role:           messageEntity.Role,
		Content:        messageEntity.Content,
		CreateTime:     messageEntity.CreateTime,
		IsDelete:       messageEntity.IsDelete,
	}
}
