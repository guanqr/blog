window.addEventListener(
  'DOMContentLoaded',
  (event) => {
    /**
     * Measure header height for the scrolling fix
     */
    const header = document.querySelector('.header');

    if (header) {
      const headerHeight = window
        .getComputedStyle(header, null)
        .getPropertyValue('height');

      document.documentElement.style.setProperty(
        '--header-height',
        headerHeight
      );

      {{ if and .Site.Params.enableHeaderAutoHide (eq .Site.Params.headerLayout "flex") }}
      /**
       * Auto hide header
       */
      let lastScrollY = 0;
      let anchorY = 0;
      const minDelta = 50;

      window.addEventListener(
        'scroll',
        throttle(() => {
          // Don't hide if page content is shorter than viewport + header
          if (document.body.scrollHeight <= window.innerHeight + header.clientHeight) return;

          const delta = window.scrollY - anchorY;
          if (Math.abs(delta) < minDelta) return;

          const scrollingDown = window.scrollY > lastScrollY;
          if (scrollingDown) {
            header.classList.add('hide');
          } else {
            header.classList.remove('hide');
          }

          if (scrollingDown !== (delta > 0)) {
            anchorY = lastScrollY;
          }
          lastScrollY = window.scrollY;
        }, delayTime)
      );

      {{ end }}
    }
  },
  { once: true }
);
