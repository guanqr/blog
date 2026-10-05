// Freeze header/body transitions during window resize (all pages)
window.addEventListener("DOMContentLoaded", function() {
    var header = document.querySelector('.header');
    var body = document.body;
    var resizeTimer;
    window.addEventListener('resize', function() {
        if (header) header.style.transition = 'none';
        if (body) body.style.transition = 'none';
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (header) header.style.transition = '';
            if (body) body.style.transition = '';
        }, 300);
    });
});

// Escape 关闭侧栏（document 级，全局挂载一次，动态读取当前侧栏状态）
window.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        var sidebar = document.getElementById('sidebar');
        var sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebar && sidebar.classList.contains('open')) {
            if (typeof window.__memoreeCloseSidebar === 'function') {
                window.__memoreeCloseSidebar();
                if (sidebarToggle) sidebarToggle.focus();
            }
        }
    });
});

// Sidebar logic（页面级：SPA 切换后随新内容重跑）
function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebarDimmer = document.getElementById('sidebar-dimmer');

    if (!sidebar || !sidebarToggle || !sidebarDimmer) return;

    // 切换后重置推入布局（body 在切换区外，可能残留 open 状态）
    document.body.classList.remove('sidebar-open');

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

    // 供全局 Escape 监听调用
    window.__memoreeCloseSidebar = closeSidebar;

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
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                var link = headings.find(function(h) { return h.el === entry.target; });
                if (link) {
                    if (entry.isIntersecting) {
                        tocLinks.forEach(function(l) { l.classList.remove('active'); });
                        link.link.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-80px 0px -70% 0px' });

        headings.forEach(function(h) { observer.observe(h.el); });
    }
}

// 首次加载与 SPA 切换后均执行
window.addEventListener("DOMContentLoaded", initSidebar);
if (window.__memoreePageReinit) {
    window.__memoreePageReinit.register(initSidebar);
}
