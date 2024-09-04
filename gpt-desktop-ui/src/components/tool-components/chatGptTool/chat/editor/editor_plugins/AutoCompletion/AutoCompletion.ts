import {Plugin} from '@ckeditor/ckeditor5-core';
import AutoCompletionUI
    from "./AutoCompletionUI";
import AutoCompletionEditing
    from "./AutoCompletionEditing";




export default class AutoCompletion extends Plugin {
    static get requires() {
        return [AutoCompletionUI, AutoCompletionEditing];
    }
}
