window.addEventListener("DOMContentLoaded", event => {
    // Create nav toggle icon

    const navToggleLabel = document.querySelector('.nav-toggle');
    const navToggleLabelInner = document.createElement('div');

    navToggleLabelInner.className = 'nav-toggle-inner';
    navToggleLabel.appendChild(navToggleLabelInner);

    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');

        navToggleLabelInner.appendChild(span);
    }


    // Main function

    const navToggle = document.getElementById('nav-toggle');
    const header = document.querySelector('.header');
    const navCurtain = document.querySelector('.nav-curtain');

    navToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            header.classList.add('open');
            navToggleLabel.classList.add('open');

            header.classList.remove('fade');

            navCurtain.style = 'display: block';
        } else {
            header.classList.remove('open');
            navToggleLabel.classList.remove('open');

            header.classList.add('fade');

            // Cannot remove `display: block` immediately, or CSS animation
            // will failed. The workaround is down below.

            // navCurtain.removeAttribute('style');
        }
    });


    // Fix animation failed caused by removing `display: block`

    navCurtain.addEventListener('animationend', (e) => {
        if (!navToggle.checked) {
            e.target.removeAttribute('style');
            // fade 动画结束后摘除 fade 类：.header.fade .nav 的
            // display:block 随之失效——残留该类会在跨越断点时
            // 重放「菜单收回」动画（闪现展开又收起）
            header.classList.remove('fade');
        }
    });


    const maxWidth = window.getComputedStyle(document.documentElement, null).getPropertyValue('--max-width');
    let mediaQuery = window.matchMedia(`(max-width: ${maxWidth})`);

    // 仅在窄屏（导航按钮可见）时挂载滚动监听，桌面端不产生滚动开销
    let scrollHandler = null;

    function attachScroll() {
        if (scrollHandler) return;
        scrollHandler = throttle(function() {
            // Close nav when window is scrolled by user
            checkInput();
        }, delayTime);
        window.addEventListener('scroll', scrollHandler);
    }

    function detachScroll() {
        if (!scrollHandler) return;
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
    }

    function onMediaChange(e) {
        if (!e.matches) {
            // We are no longer in responsive mode, close nav
            closeNav(true);
            detachScroll();
        } else {
            attachScroll();
        }
        // 跨断点即清除 fade 残留（动画未播完就变宽等边缘路径），
        // 保证再次进入窄屏时菜单直接处于收起状态
        header.classList.remove('fade');
    }

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onMediaChange);
    } else {
        mediaQuery.addListener(onMediaChange);
    }

    if (mediaQuery.matches) {
        attachScroll();
    }


    function checkInput() {
        closeNav();
    }

    function closeNav(noFade) {
        if (navToggle.checked) {
            navToggle.checked = false;

            header.classList.remove('open');
            navToggleLabel.classList.remove('open');

            if (noFade) {
                navCurtain.removeAttribute("style");
            }
            else {
                header.classList.add('fade');
            }
        }
    }
}, {once: true});
