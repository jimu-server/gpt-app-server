// ckeditor.ts

import {BalloonEditor} from '@ckeditor/ckeditor5-editor-balloon';
// @ts-ignore
import {Alignment} from '@ckeditor/ckeditor5-alignment';
// @ts-ignore
import {Autoformat} from '@ckeditor/ckeditor5-autoformat';
// @ts-ignore
import {BlockQuote} from '@ckeditor/ckeditor5-block-quote';

// @ts-ignore
import {
    Bold,
    Code,
    Italic,
    ItalicUI,
    Strikethrough,
    Subscript,
    Superscript,
    Underline
} from '@ckeditor/ckeditor5-basic-styles';

import {Essentials} from '@ckeditor/ckeditor5-essentials';
import {Paragraph, ParagraphButtonUI} from '@ckeditor/ckeditor5-paragraph';
import {Clipboard} from '@ckeditor/ckeditor5-clipboard';
import {Image, ImageCaption, ImageInsert,} from '@ckeditor/ckeditor5-image';
import {Base64UploadAdapter} from "@ckeditor/ckeditor5-upload";
import {LinkImage} from '@ckeditor/ckeditor5-link';
import {MediaEmbed} from '@ckeditor/ckeditor5-media-embed';
import {WordCount} from '@ckeditor/ckeditor5-word-count';
// @ts-ignore
import {CodeBlock} from '@ckeditor/ckeditor5-code-block';
import {Heading, HeadingButtonsUI} from "@ckeditor/ckeditor5-heading";
// @ts-ignore
import {Highlight} from "@ckeditor/ckeditor5-highlight";
import FileBlockCard from "./editor_plugins/FileBlockPlugin/FileBlockCard";
import ImageBlockCard from "./editor_plugins/ImageBlockPlugin/ImageBlockCard";
import RefMessageCard from "./editor_plugins/RefMessageBlockPlugin/RefMessageCard";
import {Mention} from "@ckeditor/ckeditor5-mention";
// @ts-ignore
import {Style} from "@ckeditor/ckeditor5-style";


class Editor extends BalloonEditor {
}

Editor.builtinPlugins = [
    Essentials,
    Paragraph,
    Image,
    ImageCaption,
    ImageInsert,
    Base64UploadAdapter,
    LinkImage,
    MediaEmbed,
    Clipboard,
    WordCount,
    Code,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    Alignment,
    Autoformat,
    BlockQuote,
    CodeBlock,
    Heading,
    HeadingButtonsUI,
    ParagraphButtonUI,
    Highlight,
    Style,

];

Editor.defaultConfig = {};


export async function defaultEditor(element: HTMLElement, config?: any) {
    return await Editor.create(element, {
        ...config,
        //AutoCompletion
        plugins: [FileBlockCard, ImageBlockCard, RefMessageCard],
        extraPlugins: [
            Bold, Highlight, Essentials, Paragraph, Mention, Image,
            ImageInsert, Clipboard, WordCount, Code, CodeBlock, Heading,
            HeadingButtonsUI, ParagraphButtonUI, Italic, ItalicUI, Alignment
        ],
        alignment: {
            options: [
                {name: 'left', className: 'my-align-left'},
                {name: 'right', className: 'my-align-right'}
            ]
        },
        language: 'cn',
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'},
                {model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'},
                {model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'},
                {model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'}
            ]
        },
        codeBlock: {
            indentSequence: 2,
            languages: [
                {language: 'plaintext', label: 'text'}, // The default language.
                {language: 'go', label: 'go'},
                {language: 'c', label: 'c'},
                {language: 'java', label: 'java'},
                {language: 'cs', label: 'c#'},
                {language: 'cpp', label: 'c++'},
                {language: 'php', label: 'php'},
                {language: 'python', label: 'python'},
                {language: 'ruby', label: 'ruby'},
                {language: 'css', label: 'css'},
                {language: 'diff', label: 'diff'},
                {language: 'javascript', label: 'javascript'},
                {language: 'typescript', label: 'typescript'},
                {language: 'xml', label: 'xml'},
                {language: 'sql', label: 'sql'}
            ]
        },
        image: {
            upload: {
                types: ["png", "jpeg", "jpg", "gif", "bmp", "webp", "svg", "tiff", "tif", "tiff"]
            },
            resizeUnit: 'px',
            insert: {
                integrations: ['upload', 'assetManager', 'url'],
                // 插入类型 设置为内联
                type: 'inline'
            }
        },
    })
}

export async function createEditor(element: HTMLElement, config?: any) {
    return await Editor.create(element, {
        ...config,
        //AutoCompletion
        plugins: [FileBlockCard, ImageBlockCard, RefMessageCard],
        extraPlugins: [Essentials, Paragraph, Image, ImageInsert, Clipboard, WordCount, ParagraphButtonUI, Italic, ItalicUI, Alignment],
        language: 'cn',
        image: {
            upload: {
                types: ["png", "jpeg", "jpg", "gif", "bmp", "webp", "svg", "tiff", "tif", "tiff"]
            },
            resizeUnit: 'px',
            insert: {
                integrations: ['upload', 'assetManager', 'url'],
                // 插入类型 设置为内联
                type: 'inline'
            }
        },
    })
}


/*
 * @description 编辑器At 列表渲染列表项
 */
function customItemRenderer(item) {
    let insert = null
    insert = document.createElement("div")
    insert.appendChild(document.createTextNode(item.id))
    return insert;
}


