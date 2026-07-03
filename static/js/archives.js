(function() {
    var groups = document.querySelectorAll('.archives-year');
    if (groups.length < 2) return;

    var yearArr = [];
    groups.forEach(function(g) { yearArr.push(parseInt(g.getAttribute('data-year'))); });
    yearArr.sort(function(a, b) { return a - b; });

    var container = document.getElementById('archives-container');
    var current = parseInt(container.getAttribute('data-current'));
    var minYear = yearArr[0];
    var maxYear = yearArr[yearArr.length - 1];

    var labelNewer = document.getElementById('archives-year-newer');
    var labelOlder = document.getElementById('archives-year-older');
    var newerEl = document.getElementById('archives-newer');
    var olderEl = document.getElementById('archives-older');

    function showYear(y) {
        groups.forEach(function(g) { g.style.display = 'none'; });
        var target = document.querySelector('.archives-year[data-year="' + y + '"]');
        if (target) { target.style.display = ''; }
        var idx = yearArr.indexOf(y);
        var prevY = (idx < yearArr.length - 1) ? yearArr[idx + 1] : null;
        var nextY = (idx > 0) ? yearArr[idx - 1] : null;
        labelNewer.textContent = prevY || '';
        labelOlder.textContent = nextY || '';
        newerEl.style.visibility = prevY ? '' : 'hidden';
        olderEl.style.visibility = nextY ? '' : 'hidden';
        current = y;
    }

    newerEl.addEventListener('click', function() {
        var idx = yearArr.indexOf(current);
        if (idx < yearArr.length - 1) { showYear(yearArr[idx + 1]); }
    });
    olderEl.addEventListener('click', function() {
        var idx = yearArr.indexOf(current);
        if (idx > 0) { showYear(yearArr[idx - 1]); }
    });

    showYear(current);
})();