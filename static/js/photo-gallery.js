document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.querySelector('.photo-gallery');
    if (!gallery) return;
  
    const allItems = document.querySelectorAll('.photo-item');
    const btn = document.querySelector('.load-more-btn');
    const perLoad = 6;
    let loadedNum = 0;
    const GAP = 4; // 与 SCSS 上下间距完全一致
  
    let columnHeights = [0, 0];
    let isMobile = window.innerWidth <= 480;
  
    // 窗口缩放：流畅重排
    function smoothReLayout() {
        columnHeights = [0, 0];
        isMobile = window.innerWidth <= 480;
        const showItems = Array.from(allItems).filter(i => i.style.display === 'block');
    
        showItems.forEach(item => {
            const h = item.offsetHeight || 300;
            if (isMobile) {
                item.style.top = columnHeights[0] + 'px';
                item.style.left = '0';
                item.classList.remove('col-right');
                columnHeights[0] += h + GAP;
            } else {
                const col = columnHeights[0] <= columnHeights[1] ? 0 : 1;
                item.style.top = columnHeights[col] + 'px';
                if (col === 1) {
                    item.style.left = 'calc(50% + 2px)';
                    item.classList.add('col-right');
                } else {
                    item.style.left = '0';
                    item.classList.remove('col-right');
                }
                columnHeights[col] += h + GAP;
            }
        });
        gallery.style.height = Math.max(...columnHeights) + 'px';
    }
  
    // 加载更多：无动画、不跳动、不空白
    function quietAddItem(item) {
        item.style.setProperty('transition', 'none', 'important'); // 加载新图片永远无动画
        const h = item.offsetHeight || 300;
    
        if (isMobile) {
            item.style.top = columnHeights[0] + 'px';
            item.style.left = '0';
            item.classList.remove('col-right');
            columnHeights[0] += h + GAP;
        } else {
            const col = columnHeights[0] <= columnHeights[1] ? 0 : 1;
            item.style.top = columnHeights[col] + 'px';
            if (col === 1) {
                item.style.left = 'calc(50% + 2px)';
                item.classList.add('col-right');
            } else {
                item.style.left = '0';
                item.classList.remove('col-right');
            }
            columnHeights[col] += h + GAP;
        }
        gallery.style.height = Math.max(...columnHeights) + 'px';

        setTimeout(() => {
            item.style.transition = 'top 0.35s ease, left 0.35s ease';
        }, 50);
    }
  
    // 加载更多逻辑
    function loadMore() {
        let count = 0;
        const total = allItems.length;
    
        for (let i = loadedNum; i < total; i++) {
            if (count >= perLoad) break;
            const item = allItems[i];
            const img = item.querySelector('.lazy-image');
            item.style.display = 'block';
    
            const renderItem = () => {
                img.classList.add('loaded');
                quietAddItem(item);
            };
    
            img.onload = renderItem;
            img.src = img.dataset.src;
            if (img.complete) renderItem();
    
            loadedNum++;
            count++;
        }
    
        if (loadedNum >= total) {
            setTimeout(() => btn.style.display = 'none', 200);
        }
    }
  
    // 缩放防抖
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(smoothReLayout, 150);
    });
  
    window.addEventListener('load', smoothReLayout);
  
    if (btn) {
        btn.addEventListener('click', loadMore);
        loadMore();
    }
});