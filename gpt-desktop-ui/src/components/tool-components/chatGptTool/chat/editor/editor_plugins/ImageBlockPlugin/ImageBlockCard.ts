import {Plugin} from '@ckeditor/ckeditor5-core';
import ImageBlockCardEditing from "./ImageBlockCardEditing";
import ImageBlockCardCardUI from "./ImageBlockCardCardUI";



export default class ImageBlockCard extends Plugin {
    static get requires() {
        return [ImageBlockCardCardUI,ImageBlockCardEditing];
    }
}
