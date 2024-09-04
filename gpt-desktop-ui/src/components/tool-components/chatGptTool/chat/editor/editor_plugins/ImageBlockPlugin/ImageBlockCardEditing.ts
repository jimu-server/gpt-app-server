import {Plugin} from '@ckeditor/ckeditor5-core';
import {toWidget, Widget} from "@ckeditor/ckeditor5-widget";
import './theme/ref.css';
import ImageBlockCardCommand from "./ImageBlockCardCommand";
import {h, render} from "vue";
import EditImageCard from "../../widget/EditImageCard.vue";

export default class ImageBlockCardEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        // 注册匹配的 指令到编辑器中
        this.editor.commands.add('addImage', new ImageBlockCardCommand(this.editor));
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;
        // 定义卡片块数据
        schema.register('ImageCard', {
            inheritAllFrom: '$inlineObject',
            // 定义使用插件时候需要传递的参数,在后续的步骤才可以通过 message 此属性在代码中获取到数据
            allowAttributes: ['src']
        });


    }

    /*
    * @description 定义视图转换
    * */
    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['image-block-card']
            },
            // 创建模型数据
            model: (viewElement, {writer: modelWriter}) => {
                const el = viewElement.getChild(0) as unknown as HTMLElement
                let src = el.getAttribute('src');
                let value = {
                    src: src,
                }
                return modelWriter.createElement('ImageCard', {
                    ...value
                });
            }
        })
        // 定义向下转化 dataDowncast 用于将模型数据转换为输出HTML数据;
        conversion.for('dataDowncast').elementToElement({
            model: 'ImageCard',
            view: (modelItem, {writer: viewWriter}) => createFileBlockCardView(modelItem, viewWriter)
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'ImageCard',
            view: (modelItem, {writer: viewWriter}) => {
                const widgetElement = createFileBlockCardView(modelItem, viewWriter);
                return toWidget(widgetElement, viewWriter);
            }
        })


        function createFileBlockCardView(modelItem, viewWriter) {
            let card = viewWriter.createContainerElement('span', {
                class: 'image-block-card',
            })
            let src = modelItem.getAttribute('src')
            let content = viewWriter.createRawElement('div', {
                src: src,
            }, function (domElement) {
                let vNode = h(EditImageCard, {
                    src: src,
                })
                render(vNode, domElement)
            });

            viewWriter.insert(viewWriter.createPositionAt(card, 0), [content]);
            return card;
        }

    }

}
