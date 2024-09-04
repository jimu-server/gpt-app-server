import Prism from 'prismjs';

import 'prismjs/themes/prism.min.css'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'


Prism.plugins.toolbar.registerButton('copy-code', {
    text: 'Copy', // required
    onClick: function (env) { // optional
        alert('This code snippet is written in ' + env.language + '.');
    }
});