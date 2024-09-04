// placeholder/placeholdercommand.js

import {Command} from '@ckeditor/ckeditor5-core';
import {SchemaContextDefinition} from "@ckeditor/ckeditor5-engine/src/model/schema";
import {toMap} from "@ckeditor/ckeditor5-utils";

export default class FileBlockCardCommand extends Command {
    execute({name, path, type, size}) {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        editor.model.change((writer) => {
            const FileCard = writer.createElement('FileCard', {
                ...Object.fromEntries( selection.getAttributes() ),
                name :name,
                path :path,
                type :type,
                size :size
            });
            editor.model.insertObject(FileCard, null, null, {setSelection: 'after'});
            // 获取编辑器焦点
            editor.editing.view.focus();
        })
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        this.isEnabled = model.schema.checkChild(selection.focus.parent as SchemaContextDefinition, 'FileCard');
    }
}
