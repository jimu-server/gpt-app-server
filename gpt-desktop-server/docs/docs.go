// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/chat/conversation": {
            "post": {
                "description": "用户发送普通问答消息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "聊天"
                ],
                "summary": "发送消息",
                "parameters": [
                    {
                        "description": "消息参数",
                        "name": "args",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.ChatArgs"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/chat/conversation/message": {
            "get": {
                "description": "用户对话，发送问题消息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "聊天"
                ],
                "summary": "发送消息",
                "parameters": [
                    {
                        "type": "string",
                        "description": "消息参数",
                        "name": "conversationId",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/chat/msg": {
            "get": {
                "description": "根据消息id获取指定消息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "聊天"
                ],
                "summary": "获取指定消息",
                "parameters": [
                    {
                        "type": "string",
                        "description": "消息参数",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/chat/msg/delete": {
            "post": {
                "description": "删除指定消息记录",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "聊天"
                ],
                "summary": "删除消息",
                "parameters": [
                    {
                        "description": "消息参数",
                        "name": "args",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.DeleteChatMsg"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/chat/plugin": {
            "get": {
                "description": "获取全部插件列表信息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "插件"
                ],
                "summary": "获取插件列表",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/chat/send": {
            "post": {
                "description": "用户对话，发送问题消息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "聊天"
                ],
                "summary": "发送消息",
                "parameters": [
                    {
                        "description": "消息参数",
                        "name": "args",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.SendMessageArgs"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/api/login": {
            "post": {
                "description": "输入账号密码登录，登陆成功返回登录token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户"
                ],
                "summary": "用户登录",
                "parameters": [
                    {
                        "description": "登录参数l",
                        "name": "args",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/dto.LoginDTO"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/resp.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "code": {
                                            "type": "integer"
                                        },
                                        "data": {
                                            "type": "object"
                                        },
                                        "msg": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "dto.ChatArgs": {
            "type": "object"
        },
        "dto.ChatMode": {
            "type": "object",
            "properties": {
                "knowledge": {
                    "description": "知识库聊天",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        },
        "dto.DeleteChatMsg": {
            "type": "object",
            "properties": {
                "ids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        },
        "dto.LoginDTO": {
            "type": "object",
            "properties": {
                "password": {
                    "description": "密码",
                    "type": "string",
                    "example": "123456"
                },
                "username": {
                    "description": "用户名",
                    "type": "string",
                    "example": "root"
                }
            }
        },
        "dto.SendMessageArgs": {
            "type": "object",
            "required": [
                "avatar",
                "content",
                "conversationId",
                "modelId"
            ],
            "properties": {
                "avatar": {
                    "type": "string"
                },
                "content": {
                    "type": "string"
                },
                "conversationId": {
                    "type": "string"
                },
                "messageId": {
                    "type": "string"
                },
                "modelId": {
                    "type": "string"
                }
            }
        },
        "resp.Response": {
            "type": "object",
            "properties": {
                "code": {
                    "description": "业务状态码",
                    "type": "integer",
                    "example": 200
                },
                "data": {
                    "description": "响应数据"
                },
                "msg": {
                    "description": "附加消息",
                    "type": "string",
                    "example": "success"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
