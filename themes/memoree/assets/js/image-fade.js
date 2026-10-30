// 正文 LQIP 主图加载完成淡入：低清占位图保持可见，主图解码后做 opacity 渐变
export function initImageFade() {
    document.querySelectorAll('.post-img-main img').forEach((img) => {
        const reveal = () => img.classList.add('is-loaded');

        if (img.complete && img.naturalWidth > 0) {
            reveal();
        } else {
            img.addEventListener('load', reveal, { once: true });
        }
    });
}
