import {Plugin} from '@ckeditor/ckeditor5-core';
import RefMessageCardUI from "./RefMessageCardUI";
import RefMessageCardEditing from "./RefMessageCardEditing";


export default class RefMessageCard extends Plugin {
    static get requires() {
        return [RefMessageCardUI, RefMessageCardEditing];
    }
}
