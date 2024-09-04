import {App, Component} from "vue";
import ModelManagePage from "@/components/tool-components/chatGptTool/manage/ModelManagePage.vue";
import Login from "@/components/system-components/Login.vue";
import OllamaSetting from "@/components/tool-components/chatGptTool/setting/ApiSetting.vue";
import UserInfoSetting from "@/components/system-components/avatar/UserInfoSetting.vue";
import ManageTool from "@/components/system-tool/manageTool/ManageTool.vue";
import NotifyTool from "@/components/system-tool/notifyTool/NotifyTool.vue";
import UserManagePage from "@/components/system-tool/manageTool/page/UserManagePage.vue";
import OrgManagePage from "@/components/system-tool/manageTool/page/OrgManagePage.vue";
import RouterManagePage from "@/components/system-tool/manageTool/page/RouterManagePage.vue";
import FunManagePage from "@/components/system-tool/manageTool/page/FunManagePage.vue";
import ToolManagePage from "@/components/system-tool/manageTool/page/ToolManagePage.vue";
import DefaultNotifyBody from "@/components/system-tool/notifyTool/notifyBody/DefaultNotifyBody.vue";
import LoginNotifyBody from "@/components/system-tool/notifyTool/notifyBody/LoginNotifyBody.vue";
import DefaultBtn from "@/components/system-tool/btn/DefaultBtn.vue";
import NotifyBtn from "@/components/system-tool/notifyTool/NotifyBtn.vue";
import GptBtn from "@/components/tool-components/chatGptTool/GptBtn.vue";
import KnowledgePanelView
    from "@/components/tool-components/chatGptTool/chat/editor-tool-bar/plugins/plugin-instance/knowledge/KnowledgePanelView.vue";
import ProgrammingAssistantPanelView
    from "@/components/tool-components/chatGptTool/chat/editor-tool-bar/plugins/plugin-instance/programming-assistant/ProgrammingAssistantPanelView.vue";
import ChatGPT from "@/components/tool-components/chatGptTool/ChatGPT.vue";


// 处理 electron 中文件上传
if (typeof window.FormData === 'undefined') {
    // window.FormData = require('form-data');
}

const components = [
    NotifyTool,
    DefaultNotifyBody,
    LoginNotifyBody,
    ManageTool,
    NotifyBtn,
    GptBtn,
    DefaultBtn,
    UserManagePage,
    OrgManagePage,
    RouterManagePage,
    FunManagePage,
    ToolManagePage,
    ModelManagePage,
    Login,
    OllamaSetting,
    UserInfoSetting,
    KnowledgePanelView,
    ProgrammingAssistantPanelView,
    ChatGPT
]

export function init(app: App) {
    components.forEach(component => {
        if (component.__name !== undefined) {
            app.component(component.__name, component)
        }
        if (component.name !== undefined) {
            app.component(component.name, component)
        }
    })
}