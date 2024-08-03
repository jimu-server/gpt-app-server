drop table if exists app_setting;
create table app_setting
(
    id          varchar(30) primary key,
    name        varchar(100) not null,
    value       varchar(500) not null,
    setting     json                  default '{}',
    create_time timestamp(0) not null default current_timestamp
);

drop table if exists app_chat_conversation;
create table app_chat_conversation
(
    id          varchar(30) primary key,
    picture     varchar(500) not null default '',
    user_id     varchar(30)  not null,
    title       varchar(100) not null,
    last_model  varchar(30)           default '',
    last_msg    text                  default '',
    last_time   timestamp(0) not null default current_timestamp,
    is_delete   int          not null default 0,
    create_time timestamp(0) not null default current_timestamp
);

drop table if exists app_chat_message;
create table app_chat_message
(
    id              varchar(30) primary key,
    conversation_id varchar(30)  not null,
    message_id      varchar(30)  not null,
    user_id         varchar(30)  not null,
    model_id        varchar(30)  not null,
    picture         varchar(100) not null,
    role            varchar(30)  not null,
    content         text,
    is_delete       int          not null default 0,
    create_time     timestamp(0) not null default current_timestamp
);

drop table if exists app_chat_model;
create table app_chat_model
(
    id            varchar(30) primary key,
    pid           varchar(30)  not null,
    user_id       varchar(30)  not null,
    name          varchar(100) not null,
    model         varchar(100) not null,
    picture       varchar(100) not null,
    size          varchar(50)  not null,
    digest        varchar(100)          default '',
    model_details json                  default '{}',
    is_download   boolean               default false,
    create_time   timestamp(0) not null default current_timestamp
);
create index model_key on app_chat_model (model);


drop table if exists app_chat_knowledge_file;
create table app_chat_knowledge_file
(
    id          varchar(30) primary key,
    pid         varchar(30)  not null,
    user_id     varchar(30)  not null,
    file_name   varchar(100) not null,
    file_path   varchar(100) not null,
    file_type   int          not null,
    create_time timestamp(0) not null default ''
);


drop table if exists app_chat_knowledge_instance;
create table app_chat_knowledge_instance
(
    id                    varchar(30) primary key,
    user_id               varchar(30)  not null,
    knowledge_name        varchar(500) not null default '',
    knowledge_files       json         not null default '[]',
    knowledge_description varchar(500) not null default '',
    knowledge_type        int          not null default 0,
    create_time           timestamp(0) not null default current_timestamp
);

drop table if exists app_chat_plugin;
create table app_chat_plugin
(
    id          varchar(30) primary key,-- 插件id
    name        varchar(200) not null,-- 插件名
    code        varchar(100) not null,-- 插件代码
    icon        varchar(100)          default '',--插件图标
    model       varchar(100)          default '',--插件模型
    float_view  varchar(100)          default '',--插件悬浮菜单面板组件
    props       json                  default '{}',--插件悬浮菜单面板组件属性
    status      boolean               default true,--状态 0:未启用 1:启用
    create_time timestamp(0) not null default current_timestamp
);

/*
insert into app_chat_plugin(id, name, code, icon, model)
VALUES (1, 'AI 助手', 'default', 'jimu-ChatGPT', 'qwen2:7b');

insert into app_chat_plugin(id, name, code, icon, model, float_view)
VALUES (2, '编程助手', 'programming', 'jimu-code', 'llama3:latest', 'ProgrammingAssistantPanelView');

insert into app_chat_plugin(id, name, code, icon, model, float_view)
VALUES (3, '知识库', 'knowledge', 'jimu-zhishi', 'qwen2:7b', 'KnowledgePanelView');
*/
