// Sidebar logic
function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebarDimmer = document.getElementById('sidebar-dimmer');

    if (!sidebar || !sidebarToggle || !sidebarDimmer) return;

    var isOpen = false;

    function openSidebar() {
        if (isOpen) return;
        isOpen = true;
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        sidebarDimmer.classList.add('open');
        sidebarDimmer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('sidebar-open');
        sidebarToggle.classList.add('open');
    }

    function closeSidebar() {
        if (!isOpen) return;
        isOpen = false;
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
        sidebarDimmer.classList.remove('open');
        sidebarDimmer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sidebar-open');
        sidebarToggle.classList.remove('open');
    }

    // Escape 关闭侧栏（监听注册于所属模块内，直接调用本地 closeSidebar）
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        if (sidebar.classList.contains('open')) {
            closeSidebar();
            sidebarToggle.focus();
        }
    });

    function toggleSidebar() {
        if (isOpen) { closeSidebar(); } else { openSidebar(); }
    }

    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSidebar();
    });

    sidebarToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    sidebarDimmer.addEventListener('click', function() {
        closeSidebar();
    });

    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Highlight active TOC item based on scroll position
    // rootMargin 手调值：上边距 -80px 让位顶栏高度；
    // 下边距 -70% 把「当前阅读位置」限定在视口上部 30% 区域
    var tocLinks = document.querySelectorAll('.sidebar-toc a');
    var headings = [];
    tocLinks.forEach(function(link) {
        var id = link.getAttribute('href');
        if (id && id.startsWith('#')) {
            var el = document.getElementById(id.substring(1));
            if (el) headings.push({ link: link, el: el });
        }
    });

    if (headings.length) {
        // el → link 映射：观察回调按元素取对应链接，O(1) 替代数组线性查找
        var linkByEl = new Map(headings.map(function(h) { return [h.el, h.link]; }));
        var activeLink = null;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                var link = linkByEl.get(entry.target);
                if (!link) return;
                // 任何时刻仅一个 active：只摘除上一次的链接，无需全量遍历
                if (activeLink) activeLink.classList.remove('active');
                activeLink = link;
                link.classList.add('active');
            });
        }, { rootMargin: '-80px 0px -70% 0px' });

        headings.forEach(function(h) { observer.observe(h.el); });
    }
}

window.addEventListener("DOMContentLoaded", initSidebar);
