import {Plugin} from '@ckeditor/ckeditor5-core';
import {Widget} from "@ckeditor/ckeditor5-widget";
import './theme/auto.css';
import AutoCompletionCommand from "./AutoCompletionCommand";

// @ts-ignore



export default class AutoCompletionEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        // 注册匹配的 指令到编辑器中
        this.editor.commands.add('autoCompletion', new AutoCompletionCommand(this.editor));
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;

    }

    /*
    * @description 定义视图转换
    * */
    _defineConverters() {

    }

}
