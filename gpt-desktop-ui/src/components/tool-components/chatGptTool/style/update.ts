export function updateTheme(dark: boolean) {
    let elements = []
    elements.push(document.querySelectorAll('.markdown-message.gpt-message'))
    elements.push(document.querySelectorAll('.markdown-message :not(pre) > code'))
    elements.push(document.querySelectorAll('.markdown-message pre'))
    elements.push(document.querySelectorAll('.gpt-fold'))
    elements.push(document.querySelectorAll('.typing-cursor'))
    elements.push(document.querySelectorAll('.code-copy-button'))
    if (dark) {
        for (const element of elements) {
            element.forEach(item => {
                item.setAttribute('theme', 'dark')
            })
        }
        return
    }
    for (const element of elements) {
        element.forEach(item => {
            item.setAttribute('theme', 'light')
        })
    }

}