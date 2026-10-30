import { throttle, delayTime } from './utils.js';
import { enableHeader, enableHeaderAutoHide } from '@params';

// 顶栏高度测量与自动隐藏（全局模块，DOMContentLoaded 后执行一次）
export function initHeader() {
    if (!enableHeader) return;

    const header = document.querySelector('.header');
    if (!header) return;

    const headerHeight = window
        .getComputedStyle(header, null)
        .getPropertyValue('height');

    document.documentElement.style.setProperty('--header-height', headerHeight);

    if (!enableHeaderAutoHide) return;

    let lastScrollY = 0;

    window.addEventListener(
        'scroll',
        throttle(() => {
            // 页面内容短于视口 + 顶栏时不隐藏
            if (document.body.scrollHeight <= window.innerHeight + header.clientHeight) return;

            window.scrollY > lastScrollY
                ? header.classList.add('hide')
                : header.classList.remove('hide');

            lastScrollY = window.scrollY;
        }, delayTime)
    );
}
