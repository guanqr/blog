window.addEventListener("DOMContentLoaded", function() {
    var sidebar = document.getElementById('sidebar');
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebarDimmer = document.getElementById('sidebar-dimmer');

    if (!sidebar || !sidebarToggle || !sidebarDimmer) return;

    var isOpen = false;

    var header = document.querySelector('.header');
    var body = document.body;

    function openSidebar() {
        if (isOpen) return;
        isOpen = true;
        if (header) header.style.transition = 'width 0.5s ease';
        if (body) body.style.transition = 'padding-right 0.5s ease';
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        sidebarDimmer.classList.add('open');
        sidebarDimmer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('sidebar-open');
        sidebarToggle.classList.add('open');
        setTimeout(function() {
            if (header) header.style.transition = '';
            if (body) body.style.transition = '';
        }, 500);
    }

    function closeSidebar() {
        if (!isOpen) return;
        isOpen = false;
        if (header) header.style.transition = 'width 0.5s ease';
        if (body) body.style.transition = 'padding-right 0.5s ease';
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
        sidebarDimmer.classList.remove('open');
        sidebarDimmer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sidebar-open');
        sidebarToggle.classList.remove('open');
        setTimeout(function() {
            if (header) header.style.transition = '';
            if (body) body.style.transition = '';
        }, 500);
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

});
