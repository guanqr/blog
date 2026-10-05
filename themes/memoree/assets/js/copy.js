{{ $src := partial "utils/lib.html" (dict "$" . "type" "clipboard") }}

// Copy Button for Code Blocks

// References
// 1. https://tomspencer.dev/blog/2018/09/14/adding-click-to-copy-buttons-to-a-hugo-powered-blog/
// 2. https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/

function initCopyButtons() {
    const copyText = '{{ i18n "copy" }}';
    const copiedText = '{{ i18n "copied" }}';
    const copyIcon = '{{ index hugo.Data.SVG "clipboard" }}';
    const checkIcon = '{{ index hugo.Data.SVG "check" }}';

    document.querySelectorAll('.post-body > pre').forEach((e) => {
        const div = document.createElement('div');
        // 无语言的裸代码块也套用 mac 卡片样式，
        // 并作为复制按钮的绝对定位锚点（.highlight 具有 position: relative）
        div.className = 'highlight';
        e.parentNode.replaceChild(div, e);
        div.appendChild(e);
    });

    function addCopyButtons(clipboard) {
        const divs = document.querySelectorAll('table.lntable, .highlight > pre, .post-body > div > pre');

        divs.forEach((containerEl) => {
            // 定位锚点为 .highlight 卡片（position: relative），
            // 按钮绝对定位到头部右上角，与 mac 红黄绿圆点同一行
            const root = containerEl.closest('.highlight') || containerEl;

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.type = 'button';
            button.title = copyText;
            button.innerHTML = copyIcon;

            let codeBlock;
            if (containerEl.classList.contains('lntable')) {
                codeBlock = containerEl.querySelectorAll('.lntd')[1];
            } else {
                codeBlock = containerEl.querySelector('code');
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
    } else if (!window.__memoreeClipboardFallback) {
        window.__memoreeClipboardFallback = true;
        const script = document.createElement('script');
        script.src = '{{ $src }}';
        script.defer = true;
        script.onload = function() {
            addCopyButtons(clipboard);
        };

        document.head.appendChild(script);
    }
}

// 首次加载与 SPA 切换后均执行
window.addEventListener("DOMContentLoaded", initCopyButtons, { once: true });
if (window.__memoreePageReinit) {
    window.__memoreePageReinit.register(initCopyButtons);
}
