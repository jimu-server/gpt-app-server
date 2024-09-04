import {
    ListItemView,
    ListView,
} from "@ckeditor/ckeditor5-ui";
import ViewCollection from "@ckeditor/ckeditor5-ui/src/viewcollection";
import Rect from '@ckeditor/ckeditor5-utils/src/dom/rect';
import './theme/autoui.css';

export default class AutoCompletionView extends ListView {
    selected: any
    constructor(locale) {
        super(locale);

        this.extendTemplate({

        })
    }

    selectFirst() {
        this.select(0);
    }

    selectNext() {
        const item = this.selected;
        const index = this.items.getIndex( item );

        this.select( index + 1 );
    }

    selectPrevious() {
        const item = this.selected;
        const index = this.items.getIndex( item );

        this.select( index - 1 );
    }

    select(index) {
        let indexToGet = 0;

        if (index > 0 && index < this.items.length) {
            indexToGet = index;
        } else if (index < 0) {
            indexToGet = this.items.length - 1;
        }

        const item = this.items.get(indexToGet);

        // Return early if item is already selected.
        if (this.selected === item) {
            return;
        }

        // Remove highlight of previously selected item.
        if (this.selected) {
            this.selected.removeHighlight();
        }

        this.selected = item;

        // Scroll the mentions view to the selected element.
        if (!this._isItemVisibleInScrolledArea(item)) {
            this.element.scrollTop = item.element.offsetTop;
        }
    }
    executeSelected() {
        this.selected.fire( 'execute' );
    }


    _isItemVisibleInScrolledArea(item) {
        return new Rect(this.element).contains(new Rect(item.element));
    }
}


export class AutoCompletionListItemView extends ListItemView {
    highlight() {
        const child = this.children.first;
    }
    removeHighlight() {
        const child = this.children.first;
    }
}

