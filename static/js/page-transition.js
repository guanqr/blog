/**
 * Page transitions — SPA-like fade between pages.
 * Intercepts internal links, fetches target content, swaps #main
 * with a quick fade-out/fade-in, and updates the URL via pushState.
 * Pattern adapted from MimoRee photofolio.
 */
(function() {
    var main = document.getElementById('main');
    if (!main) return;

    /* ---- helpers ---- */

    function shouldIntercept(link) {
        return (
            link.host === location.host &&
            !link.hash &&
            !link.hasAttribute('download') &&
            link.target !== '_blank' &&
            link.getAttribute('href') !== '#' &&
            !link.closest('[data-no-transition]')
        );
    }

    function executeScripts(container) {
        var scripts = container.querySelectorAll('script');
        scripts.forEach(function(old) {
            var s = document.createElement('script');
            if (old.src) {
                s.src = old.src;
                s.async = false;
            } else {
                s.textContent = old.textContent;
            }
            old.parentNode.replaceChild(s, old);
        });
    }

    /* ---- navigation ---- */

    async function navigateTo(url) {
        history.pushState({ url: url }, '', url);
        await loadContent(url);
    }

    async function loadContent(url) {
        /* fade out */
        main.style.transition = 'opacity 0.15s ease';
        main.style.opacity = '0';

        await new Promise(function(r) { setTimeout(r, 150); });

        try {
            var res = await fetch(url);
            var html = await res.text();
            var doc = new DOMParser().parseFromString(html, 'text/html');

            var newMain = doc.getElementById('main');
            if (!newMain) { window.location = url; return; }

            /* swap content */
            main.innerHTML = newMain.innerHTML;

            /* update title */
            var newTitle = doc.querySelector('title');
            if (newTitle) document.title = newTitle.textContent;

            /* update active nav highlight */
            updateActiveNav(url);

            /* execute scripts injected inside #main (e.g. archives.js) */
            executeScripts(main);

            /* scroll to top */
            window.scrollTo(0, 0);

        } catch (err) {
            window.location = url;
            return;
        }

        /* fade in */
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                main.style.opacity = '1';
                setTimeout(function() { main.style.transition = ''; }, 200);
            });
        });
    }

    function updateActiveNav(url) {
        var links = document.querySelectorAll('.menu-item a');
        links.forEach(function(a) {
            a.parentElement.classList.remove('active');
            if (a.getAttribute('href') === url ||
                a.getAttribute('href') === url.replace(/\/+$/, '') ||
                a.getAttribute('href') === url + '/') {
                a.parentElement.classList.add('active');
            }
        });
        /* home page special case */
        if (url === location.origin + '/' || url === location.origin) {
            var homeLink = document.querySelector('.menu-item a[href="/"]');
            if (homeLink) homeLink.parentElement.classList.add('active');
        }
    }

    /* ---- event listeners ---- */

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link || !shouldIntercept(link)) return;
        e.preventDefault();
        navigateTo(link.href);
    });

    window.addEventListener('popstate', function() {
        loadContent(location.href);
    });

    /* seed initial history state */
    history.replaceState({ url: location.href }, '', location.href);
})();
