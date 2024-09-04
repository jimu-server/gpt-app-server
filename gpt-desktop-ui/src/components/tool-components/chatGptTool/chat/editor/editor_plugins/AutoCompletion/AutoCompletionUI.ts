import {Plugin} from '@ckeditor/ckeditor5-core';
import {BalloonPanelView, ButtonView, clickOutsideHandler, ContextualBalloon} from "@ckeditor/ckeditor5-ui";
import {keyCodes} from "@ckeditor/ckeditor5-utils/src/keyboard";
import {createRegExp} from "@ckeditor/ckeditor5-mention/src/mentionui";
import {TextWatcher} from "@ckeditor/ckeditor5-typing";
import DomWrapperView from "@ckeditor/ckeditor5-mention/src/ui/domwrapperview";
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import AutoCompletionView, {AutoCompletionListItemView} from "./AutoCompletionView";

// The key codes that mention UI handles when it is open.
const handledKeyCodes = [
    keyCodes.arrowup,
    keyCodes.arrowdown,
    keyCodes.enter,
    keyCodes.tab,
    keyCodes.space,
    keyCodes.esc
];
export default class AutoCompletionUI extends Plugin {
    static get pluginName() {
        return 'AutoCompletionUI';

    }

    view: AutoCompletionView
    items: Collection<any>
    config: Map<string, any>
    _balloon: ContextualBalloon

    static get requires() {
        return [ContextualBalloon];
    }

    constructor(editor) {
        super(editor);
        this.view = this._createAutoCompletionView()
        this.config = new Map();
    }

    init() {
        const editor = this.editor;
        this._balloon = editor.plugins.get(ContextualBalloon);

        // Key listener that handles navigation in mention view.
        editor.editing.view.document.on('keydown', (evt, data) => {
            if (isHandledKey(data.keyCode) && this._isUIVisible) {
                data.preventDefault();
                evt.stop(); // Required for Enter key overriding.
                if (data.keyCode == keyCodes.arrowdown) {
                    this.view.selectNext();
                }
                if (data.keyCode == keyCodes.arrowup) {
                    this.view.selectPrevious();
                }
                if (data.keyCode == keyCodes.enter || data.keyCode == keyCodes.tab || data.keyCode == keyCodes.space) {
                    this.view.executeSelected();
                }
                if (data.keyCode == keyCodes.esc) {
                    this._hideUIAndRemoveMarker();
                }
            }
        }, {priority: 'highest'}); // Required to override the Enter key.

        clickOutsideHandler({
            emitter: this.view,
            activator: () => this._isUIVisible,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUIAndRemoveMarker()
        });

        // https://ckeditor.com/docs/ckeditor5/latest/api/module_typing_textwatcher-TextWatcher.html
        // 创建文本观器 观察 '/' 字符出现以后的文本l
        const watcher = new TextWatcher(editor.model, createTestCallback('/', 0));
        watcher.on('matched', (evt, data) => {
            const selection = editor.model.document.selection;
            const focus = selection.focus;
            if (hasExistingMention(focus)) {
                this._hideUIAndRemoveMarker();
                return;
            }

            this._showUI()
            console.log(data)
        });
        watcher.on('unmatched', () => {
            this._hideUIAndRemoveMarker();
        });
    }

    /**
     * @inheritDoc
     */


    get _isUIVisible() {
        return this._balloon.visibleView === this.view;
    }

    _hideUIAndRemoveMarker() {
        // Remove the mention view from balloon before removing marker - it is used by balloon position target().
        if (this._balloon.hasView(this.view)) {
            this._balloon.remove(this.view);
        }
        this.editor.editing.view.focus();
    }

    _showUI() {
        if (this._isUIVisible) {
            this._balloon.updatePosition(this._getBalloonPositionData())
        } else {
            this._balloon.add({
                view: this.view,
            });
        }
    }



    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        let target = null;

        // Set a target position by converting view selection range to DOM.
        target = () => view.domConverter.viewRangeToDom(
            viewDocument.selection.getFirstRange()
        );
        const positions = BalloonPanelView.defaultPositions;
        return {
            target,
        };
    }


    _createAutoCompletionView() {
        const editor = this.editor
        let view = new AutoCompletionView(editor.locale)
        this.items = new Collection()
        view.items.bindTo(this.items).using(data => {
            console.log(data)
            const {item, marker} = data;
            const listItemView = new AutoCompletionListItemView(this.editor.locale);
            const view = this._renderItem(item, marker);
            view.delegate('execute').to(listItemView);
            listItemView.children.add(view);
            listItemView.on('execute', () => {
                view.fire('execute', {
                    item,
                    marker
                });
            });
            return listItemView
        })
        return view
    }

    _renderItem(item, marker) {
        const editor = this.editor;

        let view;
        let label = item.id;

        const renderer = this._getItemRenderer(marker);

        if (renderer) {
            const renderResult = 'aaa'

            if (typeof renderResult != 'string') {
                view = new DomWrapperView(editor.locale, renderResult);
            } else {
                label = renderResult;
            }
        }

        if (!view) {
            const buttonView = new ButtonView(editor.locale);

            buttonView.label = label;
            buttonView.withText = true;

            view = buttonView;
        }

        return view;
    }

    _getItemRenderer(marker) {
        const {itemRenderer} = this.config.get(marker);

        return itemRenderer;
    }

}

function isHandledKey(keyCode) {
    return handledKeyCodes.includes(keyCode);
}

function checkIfStillInCompletionMode(editor) {
    return editor.model.markers.has('mention');
}

// Creates a test callback for the marker to be used in the text watcher instance.
//
// @param {String} marker
// @param {Number} minimumCharacters
// @returns {Function}
function createTestCallback(marker, minimumCharacters) {
    const regExp = createRegExp(marker, minimumCharacters);

    return text => regExp.test(text);
}

const VERTICAL_SPACING = 3;

function hasExistingMention(position) {
    // The text watcher listens only to changed range in selection - so the selection attributes are not yet available
    // and you cannot use selection.hasAttribute( 'mention' ) just yet.
    // See https://github.com/ckeditor/ckeditor5-engine/issues/1723.
    const hasMention = position.textNode && position.textNode.hasAttribute('mention');

    const nodeBefore = position.nodeBefore;

    return hasMention || nodeBefore && nodeBefore.is('text') && nodeBefore.hasAttribute('mention');
}


