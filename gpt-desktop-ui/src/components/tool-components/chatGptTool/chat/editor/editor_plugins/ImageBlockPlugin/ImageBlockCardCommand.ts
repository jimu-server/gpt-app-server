// placeholder/placeholdercommand.js

import {Command} from '@ckeditor/ckeditor5-core';
import {SchemaContextDefinition} from "@ckeditor/ckeditor5-engine/src/model/schema";

export default class ImageBlockCardCommand extends Command {
    execute({src}) {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        editor.model.change((writer) => {
            const ImageCard = writer.createElement('ImageCard', {
                ...Object.fromEntries(selection.getAttributes()),
                src: src,
            });
            editor.model.insertObject(ImageCard, null, null, {setSelection: 'after'});
            // 获取编辑器焦点
            editor.editing.view.focus();
        })
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        this.isEnabled = model.schema.checkChild(selection.focus.parent as SchemaContextDefinition, 'ImageCard');
    }
}
