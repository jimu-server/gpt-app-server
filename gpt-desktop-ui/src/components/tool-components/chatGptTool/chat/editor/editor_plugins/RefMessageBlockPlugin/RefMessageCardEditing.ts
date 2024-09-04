import {Plugin} from '@ckeditor/ckeditor5-core';
import {toWidget, toWidgetEditable, Widget} from "@ckeditor/ckeditor5-widget";

import RefMessageCardCommand from './RefMessageCardCommand'; // ADDED
import './theme/ref.css';

export default class RefMessageCardEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        // 注册匹配的 指令到编辑器中
        this.editor.commands.add('insertRefMessageCard', new RefMessageCardCommand(this.editor));
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;


        schema.register('RefMessageCardBox', {
            inheritAllFrom: '$blockObject',
            isLimit: true,
            allowAttributes: ['ref']
        });
        schema.register('RefMessageCardBoxTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowIn: 'RefMessageCardBox',
            inheritAllFrom: '$inlineObject',
            isSelectable: false,
        });

        schema.register('RefMessageCardContent', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowIn: 'RefMessageCardBox',
            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        });

        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('RefMessageCardContent') && (childDefinition.name == 'RefMessageCardBox')) {
                return false;
            }
            if (context.endsWith('RefMessageCardBox') && (childDefinition.name == 'RefMessageCardBoxTitle')) {
                return true;
            }
        });
    }

    /*
    * @description 定义视图转换
    * */
    _defineConverters() {
        // ADDED 获取编辑器转换
        const conversion = this.editor.conversion;

        // RefMessageCardBox
        conversion.for('upcast').elementToElement({
            model: 'RefMessageCardBox',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'RefMessageCardBox',
            view: {
                name: 'section',
                classes: 'simple-box'
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'RefMessageCardBox',
            view: (modelElement, {writer: viewWriter}) => {
                const section = viewWriter.createContainerElement('section', {class: 'simple-box'});
                return toWidget(section, viewWriter);
            }
        });

        // RefMessageCardBoxTitle
        conversion.for('upcast').elementToElement({
            model: 'RefMessageCardBoxTitle',
            view: {
                name: 'div',
                classes: 'simple-box-title'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'RefMessageCardBoxTitle',
            view: {
                name: 'div',
                classes: 'simple-box-title'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'RefMessageCardBoxTitle',
            view: (modelElement, {writer: viewWriter}) => {
                var titleBox = viewWriter.createContainerElement('div', {class: 'simple-box-title'})
                titleBox._setAttribute("draggable", "false")
                // Note: You use a more specialized createEditableElement() method here.
                const title = viewWriter.createRawElement('div', null, function (domElement) {
                    domElement.innerText = "title"
                });
                viewWriter.insert(viewWriter.createPositionAt(titleBox, 0), title);
                return toWidget(titleBox, viewWriter);
            }
        });


        // RefMessageCardContent
        conversion.for('upcast').elementToElement({
            model: 'RefMessageCardContent',
            view: {
                name: 'div',
                classes: 'simple-box-description'
            }
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'RefMessageCardContent',
            view: {
                name: 'div',
                classes: 'simple-box-description'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'RefMessageCardContent',
            view: (modelElement, {writer: viewWriter}) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', {class: 'simple-box-description'});

                return toWidgetEditable(div, viewWriter);
            }
        });

    }

}
