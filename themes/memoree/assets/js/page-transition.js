// 页面切换：拦截站内导航，仅替换 .main-content 区域，header/footer 不重载
// 参考 photofolio 主题 page-transition.js 移植

// 页面级模块钩子：每次切换后重跑（代码块复制按钮、目录监听、图片缩放等）
window.__memoreePageReinit = {
    handlers: [],
    register(fn) {
        this.handlers.push(fn);
    },
    run() {
        this.handlers.forEach((fn) => {
            try {
                fn();
            } catch (e) {
                console.error(e);
            }
        });
    }
};

// 进入时的 URL：切换容器外的持久区域（header/footer 等）不会随
// pushState 更新，其中的相对链接必须固定按此基准解析，
// 否则在 /tags/ 页点击 ./archives/ 会解析成 /tags/archives/
const entryURL = location.href;

// 解析链接：主内容区链接随每次切换更新，按当前 URL 解析即可
function resolveLink(link) {
    const raw = link.getAttribute('href');
    if (!raw) return null;
    if (!link.closest('.main-content')) {
        return new URL(raw, entryURL).href;
    }
    return link.href;
}

window.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 拦截站内链接点击
    document.addEventListener('click', (e) => {
        if (reduceMotion) return;
        // 修饰键组合（新标签页/新窗口等）交给浏览器
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const link = e.target.closest('a');
        if (!link) return;
        const url = resolveLink(link);
        if (!url || !shouldIntercept(link, url)) return;
        e.preventDefault();
        navigateTo(url);
    });

    // 浏览器前进/后退
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            loadContent(e.state.url);
        }
    });
});

function shouldIntercept(link, url) {
    return (
        new URL(url).host === location.host &&
        !link.hash &&
        !link.hasAttribute('download') &&
        link.target !== '_blank' &&
        link.getAttribute('href') !== '#'
    );
}

async function navigateTo(url) {
    history.pushState({ url }, '', url);
    await loadContent(url);
}

async function loadContent(url) {
    const main = document.querySelector('.main-content');
    if (!main) return;

    // 淡出
    main.classList.add('is-leaving');
    await sleep(150);

    try {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const newMain = doc.querySelector('.main-content');
        if (!newMain) {
            window.location = url;
            return;
        }

        // 替换主内容
        main.innerHTML = newMain.innerHTML;

        // 更新标题与描述
        const newTitle = doc.querySelector('title');
        if (newTitle) document.title = newTitle.textContent;
        const newDesc = doc.querySelector('meta[name="description"]');
        if (newDesc) {
            const curDesc = document.querySelector('meta[name="description"]');
            if (curDesc) curDesc.setAttribute('content', newDesc.getAttribute('content'));
        }

        // 菜单当前项高亮
        updateActiveNav(url);

        // header 宽度类随页面类型变化（single/list/wide）
        const curHeader = document.querySelector('.header-inner');
        const newHeader = doc.querySelector('.header-inner');
        if (curHeader && newHeader) curHeader.className = newHeader.className;

        // 回顶（instant 避免 smooth-scroll 产生动画）
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        } catch (err) {
            window.scrollTo(0, 0);
        }

        // 页面级模块重跑
        window.__memoreePageReinit.run();

        // 自动加载评论的页面切换后立即挂载
        {{ if .Site.Params.autoLoadComments }}
        if (document.getElementById('waline') && typeof loadComments === 'function') {
            loadComments();
        }
        {{ end }}

        // GA 页面浏览统计
        {{ if and .Site.Params.enableGoogleAnalytics (eq hugo.Environment "production") }}
        const pagePath = new URL(url).pathname;
        {{ if eq .Site.Params.trackingCodeType "gtag" }}
        if (typeof gtag === 'function') {
            gtag('config', '{{ .Site.Params.trackingID }}', { 'page_path': pagePath });
        }
        {{ else }}
        if (typeof ga === 'function') {
            ga('set', 'page', pagePath);
            ga('send', 'pageview');
        }
        {{ end }}
        {{ end }}
    } catch (err) {
        // 网络错误等回退到完整导航
        window.location = url;
        return;
    }

    // 淡入
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            main.classList.remove('is-leaving');
        });
    });
}

function updateActiveNav(url) {
    const path = new URL(url).pathname;
    let best = null;
    let bestLen = -1;

    document.querySelectorAll('.menu a').forEach((a) => {
        const li = a.closest('.menu-item');
        if (!li) return;
        const resolved = resolveLink(a);
        if (!resolved || new URL(resolved).host !== location.host) return;
        const linkPath = new URL(resolved).pathname;
        li.classList.remove('active');

        if (path === linkPath) {
            li.classList.add('active');
            return;
        }
        // 分区前缀匹配（activeInSection 行为），取最长前缀
        if (linkPath !== '/' && path.startsWith(linkPath) && linkPath.length > bestLen) {
            best = li;
            bestLen = linkPath.length;
        }
    });

    if (best && !document.querySelector('.menu-item.active')) {
        best.classList.add('active');
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
