import {Plugin} from '@ckeditor/ckeditor5-core';
import {toWidget, Widget} from "@ckeditor/ckeditor5-widget";
import './theme/ref.css';

import {h, render} from "vue";

import domtoimage from 'dom-to-image';
// @ts-ignore
import * as child_process from "child_process";

import FileBlockCardCommand
    from "./FileBlockCardCommand";
import EditorFileCard from "@/components/tool-components/chatGptTool/chat/editor/widget/EditorFileCard.vue";


export default class FileBlockCardEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        // 注册匹配的 指令到编辑器中
        this.editor.commands.add('insertFile', new FileBlockCardCommand(this.editor));
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;
        // 定义卡片块数据
        schema.register('FileCard', {
            inheritAllFrom: '$inlineObject',
            isSelectable: false,
            // 定义使用插件时候需要传递的参数,在后续的步骤才可以通过 message 此属性在代码中获取到数据
            allowAttributes: ['name', 'path', 'type', 'size']
        });


    }

    /*
    * @description 定义视图转换
    * */
    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: ['file-block-card']
            },
            // 创建模型数据
            model: (viewElement, {writer: modelWriter}) => {
                const el = viewElement.getChild(0) as unknown as HTMLElement
                let name = el.getAttribute('name');
                let path = el.getAttribute('path');
                let type = el.getAttribute('type');
                let size = el.getAttribute('size');
                let value = {
                    name: name,
                    path: path,
                    type: type,
                    size: size
                }
                return modelWriter.createElement('FileCard', {
                    ...value
                });
            }
        })
        // 定义向下转化 dataDowncast 用于将模型数据转换为输出HTML数据;
        conversion.for('dataDowncast').elementToElement({
            model: 'FileCard',
            view: (modelItem, {writer: viewWriter}) => createFileBlockCardView(modelItem, viewWriter)
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'FileCard',
            view: (modelItem, {writer: viewWriter}) => {
                const widgetElement = createFileBlockCardView(modelItem, viewWriter);
                return toWidget(widgetElement, viewWriter);
            }
        })


        function createFileBlockCardView(modelItem, viewWriter) {
            let name = modelItem.getAttribute('name')
            let path = modelItem.getAttribute('path')
            let type = modelItem.getAttribute('type')
            let size = modelItem.getAttribute('size')
            let card = viewWriter.createContainerElement('div', {
                class: 'file-block-card',
                name: name,
                path: path,
                type: type,
                size: size,
            })
            let content = viewWriter.createRawElement('div', null, function (domElement) {
                let vNode = h(EditorFileCard, {
                    name: name,
                    path: path,
                    type: type,
                    size: size
                })
                let htmlDivElement = document.createElement("div");
                render(vNode, htmlDivElement);
                document.body.appendChild(htmlDivElement);
                domtoimage.toPng(htmlDivElement.firstChild)
                    .then(function (dataUrl) {
                        var img = new Image();
                        img.src = dataUrl;
                        img.draggable = false
                        img.ondblclick = function (event) {
                            child_process.exec(`start explorer ` + path);
                        }
                        img.onclick = function (event) {

                        }
                        domElement.appendChild(img);
                        document.body.removeChild(htmlDivElement)
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
            });
            viewWriter.insert(viewWriter.createPositionAt(card, 0), [content]);
            return card;
        }

    }

}
