// LQIP 主图懒加载：低清占位随 HTML 直接加载，高清 picture 在接近视口时才换 src
export function initImageLazy() {
    const wrappers = document.querySelectorAll('.post-img');
    if (!wrappers.length) return;

    const load = (wrapper) => {
        wrapper.querySelectorAll('.post-img-main source[data-srcset]').forEach((source) => {
            source.srcset = source.dataset.srcset;
            source.removeAttribute('data-srcset');
        });

        const img = wrapper.querySelector('.post-img-main img[data-src]');
        if (!img) return;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    };

    if (!('IntersectionObserver' in window)) {
        wrappers.forEach(load);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            load(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '200px' });

    wrappers.forEach((wrapper) => observer.observe(wrapper));
}
