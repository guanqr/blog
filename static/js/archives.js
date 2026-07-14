(function() {
    var panels = document.querySelectorAll('.archives-year');
    if (panels.length < 2) return;

    var yearMap = {};
    var years   = [];

    panels.forEach(function(p) {
        var y = parseInt(p.getAttribute('data-year'));
        yearMap[y] = p;
        years.push(y);
    });
    years.sort(function(a, b) { return a - b; });

    var currentYear  = null;
    var currentPanel = null;

    /* cache SVG icons for rebuilding nav (see template: the SVG is inside the
       a|span.archives-nav-side element itself) */
    function getLeftSVG()  { var s = document.querySelector('#archives-newer svg'); return s ? s.outerHTML : ''; }
    function getRightSVG() { var s = document.querySelector('#archives-older svg'); return s ? s.outerHTML : ''; }

    function getYearFromURL() {
        var m = location.pathname.match(/\/archives\/(\d{4})\/?$/);
        return m ? parseInt(m[1]) : null;
    }

    function buildNav(year) {
        var idx      = years.indexOf(year);
        var prevYear = idx > 0                ? years[idx - 1] : null;
        var nextYear = idx < years.length - 1 ? years[idx + 1] : null;
        var leftSVG  = getLeftSVG();
        var rightSVG = getRightSVG();

        var newerHTML, olderHTML;

        if (nextYear) {
            newerHTML = '<a class="archives-nav-side" id="archives-newer" href="/archives/' + nextYear + '/" data-year="' + nextYear + '" rel="next">' +
                leftSVG + '<span class="archives-nav-year">' + nextYear + '</span></a>';
        } else {
            newerHTML = '<span class="archives-nav-side is-disabled" id="archives-newer">' + leftSVG + '</span>';
        }

        if (prevYear) {
            olderHTML = '<a class="archives-nav-side" id="archives-older" href="/archives/' + prevYear + '/" data-year="' + prevYear + '" rel="prev">' +
                '<span class="archives-nav-year">' + prevYear + '</span>' + rightSVG + '</a>';
        } else {
            olderHTML = '<span class="archives-nav-side is-disabled" id="archives-older">' + rightSVG + '</span>';
        }

        document.getElementById('archives-newer').outerHTML = newerHTML;
        document.getElementById('archives-older').outerHTML = olderHTML;
    }

    function showYear(year, addToHistory) {
        var panel = yearMap[year];
        if (!panel || panel === currentPanel) return;

        if (currentPanel) currentPanel.style.display = 'none';
        panel.style.display = '';
        currentPanel = panel;
        currentYear  = year;

        buildNav(year);

        if (addToHistory !== false) {
            history.pushState({ year: year }, '', '/archives/' + year + '/');
        }
    }

    /* ---- init ---- */
    var urlYear  = getYearFromURL();
    var initYear = (urlYear && yearMap[urlYear]) ? urlYear : years[years.length - 1];

    panels.forEach(function(p) {
        if (parseInt(p.getAttribute('data-year')) === initYear) {
            p.style.display = '';
            currentPanel = p;
            currentYear  = initYear;
        } else {
            p.style.display = 'none';
        }
    });

    buildNav(initYear);
    history.replaceState({ year: initYear }, '', location.href);

    /* ---- events ---- */

    document.querySelector('.archives-nav').addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link) return;
        e.preventDefault();
        var year = parseInt(link.getAttribute('data-year'));
        if (year && yearMap[year]) showYear(year, true);
    });

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        var link;
        if (e.key === 'ArrowLeft')  link = document.querySelector('#archives-newer a');
        if (e.key === 'ArrowRight') link = document.querySelector('#archives-older a');
        if (link) { e.preventDefault(); link.click(); }
    });
})();
