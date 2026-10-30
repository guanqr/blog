import { throttle, delayTime } from './utils.js';

// 返回顶部按钮滚动显隐（仅在 enableBackToTopAutoHide 开启时由入口调用）
export function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener(
        'scroll',
        throttle(function() {
            window.scrollY > 100 ? backToTop.classList.add('show') : backToTop.classList.remove('show');
        }, delayTime)
    );
}
