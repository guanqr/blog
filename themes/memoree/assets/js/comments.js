// Waline 评论：全局函数
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
    newWaline();
}

async function newWaline() {
    const { init } = await import('https://unpkg.com/@waline/client@3/dist/waline.js');
    var locale = {
        nick: "{{ i18n "waline_nick" }}",
        mail: "{{ i18n "waline_mail" }}",
        placeholder: "{{ i18n "waline_placeholder" }}"
    };
    init({
        el: '#waline',
        serverURL: '{{ .Site.Params.walineServerURL }}',
        lang: '{{ .Site.Params.walineLang }}',
        locale: locale,
        emoji: {{ .Site.Params.walineEmoji | jsonify }},
        dark: 'html[data-theme="dark"]',
        commentSorting: '{{ .Site.Params.walineCommentSorting }}',
        meta: {{ .Site.Params.walineMeta | jsonify }},
        requiredMeta: {{ .Site.Params.walineRequiredMeta | jsonify }},
        login: '{{ .Site.Params.walineLogin }}',
        pageSize: {{ .Site.Params.walinePageSize }},
        imageUploader: {{ .Site.Params.walineImageUploader }},
        highlighter: {{ .Site.Params.walineHighlighter }},
        search: {{ .Site.Params.walineSearch }},
        copyright: {{ .Site.Params.walineCopyright }}
    });
}

window.addEventListener("DOMContentLoaded", event => {
    {{ if .Site.Params.autoLoadComments }}
        if (document.getElementById('waline')) {
            loadComments();
        }
    {{ else }}
        // 初始页面的加载按钮
        const commentsToggle = document.getElementById('load-comments');

        if (commentsToggle !== null) {
            commentsToggle.addEventListener('click', function () {
                loadComments();
                this.style = "display: none";
            });
        }
    {{  end }}
}, {once: true});
