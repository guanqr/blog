(function() {
    // Progressive enhancement: keyboard navigation for archives year pages.
    // Left/right arrow keys navigate between adjacent years.

    var nav = document.querySelector('.archives-nav');
    if (!nav) return;

    var newerLink = nav.querySelector('a[rel="next"]');
    var olderLink = nav.querySelector('a[rel="prev"]');

    if (!newerLink && !olderLink) return;

    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.key === 'ArrowLeft' && newerLink) {
            e.preventDefault();
            newerLink.click();
        } else if (e.key === 'ArrowRight' && olderLink) {
            e.preventDefault();
            olderLink.click();
        }
    });
})();
