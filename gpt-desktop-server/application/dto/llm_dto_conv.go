package dto

import "gpt-desktop/domain/entity"

func NewMessageEntity(dto *MessageDTO) *entity.MessageEntity {
	return &entity.MessageEntity{
		ID:             dto.ID,
		ConversationID: dto.ConversationID,
		Picture:        dto.Picture,
		MessageID:      dto.MessageID,
		ModelID:        dto.ModelID,
		Role:           dto.Role,
		Content:        dto.Content,
		IsDelete:       dto.IsDelete,
		CreateTime:     dto.CreateTime,
	}
}

func NewMessageDTO(entity *entity.MessageEntity) *MessageDTO {
	return &MessageDTO{
		ID:             entity.ID,
		ConversationID: entity.ConversationID,
		Picture:        entity.Picture,
		MessageID:      entity.MessageID,
		ModelID:        entity.ModelID,
		Role:           entity.Role,
		Content:        entity.Content,
		IsDelete:       entity.IsDelete,
		CreateTime:     entity.CreateTime,
	}
}

func NewConversationEntity(dto *ConversationDTO) *entity.ConversationEntity {
	return &entity.ConversationEntity{
		ID:         dto.ID,
		Picture:    dto.Picture,
		Title:      dto.Title,
		LastModel:  dto.LastModel,
		LastMsg:    dto.LastMsg,
		LastTime:   dto.LastTime,
		IsDelete:   dto.IsDelete,
		CreateTime: dto.CreateTime,
	}
}

func NewConversationDTO(entity *entity.ConversationEntity) *ConversationDTO {
	return &ConversationDTO{
		ID:         entity.ID,
		Picture:    entity.Picture,
		Title:      entity.Title,
		LastModel:  entity.LastModel,
		LastMsg:    entity.LastMsg,
		LastTime:   entity.LastTime,
		IsDelete:   entity.IsDelete,
		CreateTime: entity.CreateTime,
	}
}

func NewPluginEntity(dto *PluginDTO) *entity.PluginEntity {
	return &entity.PluginEntity{
		ID:   dto.ID,
		Name: dto.Name,
		Code: dto.Code,
	}
}
