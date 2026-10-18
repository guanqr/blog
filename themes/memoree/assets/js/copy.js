{{ $src := partial "utils/lib.html" (dict "page" . "type" "clipboard") }}

// Copy Button for Code Blocks

// References
// 1. https://tomspencer.dev/blog/2018/09/14/adding-click-to-copy-buttons-to-a-hugo-powered-blog/
// 2. https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/

function initCopyButtons() {
    const copyText = '{{ i18n "copy" }}';
    const copiedText = '{{ i18n "copied" }}';
    const copyIcon = '{{ partial "utils/icon.html" (dict "name" "clipboard") }}';
    const checkIcon = '{{ partial "utils/icon.html" (dict "name" "check") }}';

    // 无语言的裸代码块包一层 .highlight：
    // 统一外边距规则，并作为复制按钮的绝对定位锚点
    function wrapInHighlight(pre) {
        const div = document.createElement('div');
        div.className = 'highlight';
        pre.parentNode.replaceChild(div, pre);
        div.appendChild(pre);
        return div;
    }

    document.querySelectorAll('.post-body > pre').forEach((e) => {
        wrapInHighlight(e);
    });

    function addCopyButtons(clipboard) {
        const divs = document.querySelectorAll('table.lntable, .highlight > pre, .post-body > div > pre');

        divs.forEach((containerEl) => {
            // 定位锚点为 .highlight（position: relative），按钮绝对定位到右上角；
            // 短代码（如 notice）内的裸 pre 没有 .highlight 祖先，先就地包裹
            let root = containerEl.closest('.highlight');
            if (!root && containerEl.tagName === 'PRE') {
                root = wrapInHighlight(containerEl);
            }
            if (!root) root = containerEl;

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.type = 'button';
            button.title = copyText;
            button.innerHTML = copyIcon;

            let codeBlock;
            if (containerEl.classList.contains('lntable')) {
                codeBlock = containerEl.querySelectorAll('.lntd')[1];
            } else {
                // 裸 HTML <pre>（无 code 子元素）回退到 pre 本身的文本
                codeBlock = containerEl.querySelector('code') || containerEl;
            }

            button.addEventListener('click', () => {
                clipboard.writeText(codeBlock.innerText).then(() => {
                    /* Chrome doesn't seem to blur automatically,
                       leaving the button in a focused state. */
                    button.blur();

                    button.innerHTML = checkIcon;
                    button.title = copiedText;

                    setTimeout(() => {
                        button.innerHTML = copyIcon;
                        button.title = copyText;
                    }, 1000);
                }).catch((error) => {
                    console.error(error);
                });
            });

            root.appendChild(button);

            {{ if .Site.Params.enableCopyAutoHide }}
                root.addEventListener('mouseover', () => {
                    button.style = 'visibility: visible; opacity: 1';
                });

                root.addEventListener('mouseout', () => {
                    button.style = 'visibility: hidden; opacity: 0';
                });
            {{ end }}
        });
    }

    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    } else if (typeof clipboard !== 'undefined') {
        addCopyButtons(clipboard);
    } else {
        const script = document.createElement('script');
        script.src = '{{ $src }}';
        script.onload = function() {
            addCopyButtons(clipboard);
        };
        // 无剪贴板 API 时 polyfill 是唯一路径：加载失败需留痕便于诊断
        script.onerror = function() {
            console.error('clipboard polyfill failed to load: ' + script.src);
        };

        document.head.appendChild(script);
    }
}

window.addEventListener("DOMContentLoaded", initCopyButtons, { once: true });
