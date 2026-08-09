window.addEventListener("DOMContentLoaded", function() {
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

        var activeItem = sidebar.querySelector('.sidebar-toc a.active');
        if (activeItem) {
            setTimeout(function() {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 350);
        }
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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeSidebar();
            sidebarToggle.focus();
        }
    });

    // Tab switching: TOC / Overview
    var sidebarInnerEl = document.querySelector('.sidebar-inner');
    var navTabs = document.querySelectorAll('.sidebar-nav li');
    if (sidebarInnerEl && navTabs.length) {
        navTabs.forEach(function(tab, index) {
            tab.addEventListener('click', function() {
                sidebarInnerEl.classList.replace(
                    index === 0 ? 'sidebar-overview-active' : 'sidebar-toc-active',
                    index === 0 ? 'sidebar-toc-active' : 'sidebar-overview-active'
                );
            });
        });
    }

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

    // Prevent header wobble during window resize
    var header = document.querySelector('.header');
    var resizeTimer;
    window.addEventListener('resize', function() {
        if (header) header.style.transition = 'width 0s';
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (header) header.style.transition = '';
        }, 250);
    });
});
