import { enableMediumZoom } from '@params';

// 正文图片缩放：库由第三方 partial 以独立 script 加载，初始化收编到模块入口
export function initMediumZoom() {
    if (!enableMediumZoom || typeof window.mediumZoom !== 'function') return;

    let imgNodes = document.querySelectorAll('div.post-body img');
    // <picture> 改变了 img 的直接父节点，链接图片判断改用祖先查找；
    // LQIP 占位图不参与缩放
    imgNodes = Array.from(imgNodes).filter(node => !node.closest('a') && !node.classList.contains('post-img-lqip'));

    window.mediumZoom(imgNodes, {
        background: 'hsla(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l), 0.95)'
    });
}
