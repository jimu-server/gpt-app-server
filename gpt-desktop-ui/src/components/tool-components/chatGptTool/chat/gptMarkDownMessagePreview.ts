import markdownit from 'markdown-it'
import {escapeHtml} from 'markdown-it/lib/common/utils.mjs'
import Prism from 'prismjs';
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItAddr from 'markdown-it-abbr'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import {useThemeStore} from "@/components/system-components/store/theme";
import pinia from "@/pinia";

const md = markdownit({
    html: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        const theme = useThemeStore(pinia)
        let code = '';
        if (lang && Prism.languages[lang]) {
            try {
                code = Prism.highlight(str, Prism.languages[lang], lang)
            } catch (__) {
                code = md.utils.escapeHtml(str);
            }
        } else {
            code = md.utils.escapeHtml(str);
        }
        let copyButton = '<button class="code-copy-button" onclick="copyToClipboard(this)">复制</button>';
        if (theme.dark) {
            copyButton = '<button class="code-copy-button" theme="dark" onclick="copyToClipboard(this)">复制</button>'
            return `<pre class="markdown-code-block" theme="dark">${copyButton}<code>${code}</code></pre>`;
        }
        return `<pre class="markdown-code-block">${copyButton}<code>${code}</code></pre>`;
    }
})

/*
* @description: 覆盖原来的内联代码规则,接入判断当前主题,动态写入dark 属性
* */
md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
    const theme = useThemeStore(pinia)
    const token = tokens[idx]
    if (theme.dark) {
        return '<code theme="dark"' + slf.renderAttrs(token) + '>' + escapeHtml(token.content) + '</code>'
    }
    return '<code' + slf.renderAttrs(token) + '>' + escapeHtml(token.content) + '</code>'
}


md.use(MarkdownItMark)
md.use(MarkdownItSub)
md.use(MarkdownItSup)
md.use(MarkdownItIns)
md.use(MarkdownItContainer)
md.use(MarkdownItAddr)
md.use(MarkdownItFootnote)
md.use(MarkdownItDeflist)

export default md
