// Waline 评论：按页面标记延迟初始化
import { enableComments, autoLoadComments, waline } from '@params';

export function initComments() {
    if (!enableComments) return;

    if (autoLoadComments) {
        if (document.getElementById('waline')) {
            loadComments();
        }
        return;
    }

    // 初始页面的加载按钮
    const commentsToggle = document.getElementById('load-comments');

    if (commentsToggle !== null) {
        commentsToggle.addEventListener('click', function () {
            loadComments();
            this.style = 'display: none';
        });
    }
}

function loadComments() {
    if (!document.getElementById('waline')) return;
    // lazy-load CSS
    if (!document.getElementById('waline-css')) {
        var css = document.createElement('link');
        css.id = 'waline-css';
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/@waline/client@3/dist/waline.css';
        document.head.appendChild(css);
    }
    newWaline().catch((error) => console.error(error));
}

async function newWaline() {
    const { init } = await import('https://unpkg.com/@waline/client@3/dist/waline.js');
    init({
        el: '#waline',
        serverURL: waline.serverURL,
        lang: waline.lang,
        locale: waline.locale,
        emoji: waline.emoji,
        dark: 'html[data-theme="dark"]',
        commentSorting: waline.commentSorting,
        meta: waline.meta,
        requiredMeta: waline.requiredMeta,
        login: waline.login,
        pageSize: waline.pageSize,
        imageUploader: waline.imageUploader,
        highlighter: waline.highlighter,
        search: waline.search,
        copyright: waline.copyright
    });
}
