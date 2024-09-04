// placeholder/placeholdercommand.js

import {Command} from '@ckeditor/ckeditor5-core';

export default class RefMessageCardCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertObject(createRefBox(writer));
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'RefMessageCardBox');
        this.isEnabled = allowedIn !== null;
    }
}

function createRefBox(writer) {
    const RefMessageCardBox = writer.createElement('RefMessageCardBox');
    const RefMessageCardBoxTitle = writer.createElement('RefMessageCardBoxTitle');
    const RefMessageCardContent = writer.createElement('RefMessageCardContent');

    writer.append(RefMessageCardBoxTitle, RefMessageCardBox);
    writer.append(RefMessageCardContent, RefMessageCardBox);

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement('paragraph', RefMessageCardContent);

    return RefMessageCardBox;
}
