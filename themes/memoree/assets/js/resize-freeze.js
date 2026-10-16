// 窗口 resize 期间冻结 header/body 过渡，防止拖动窗口时动画重放。
// 全局行为（所有页面），无开关、常驻加载；与 sidebar.js 相邻排布
window.addEventListener("DOMContentLoaded", function() {
    var header = document.querySelector('.header');
    var body = document.body;
    var resizeTimer;
    window.addEventListener('resize', function() {
        if (header) header.style.transition = 'none';
        if (body) body.style.transition = 'none';
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (header) header.style.transition = '';
            if (body) body.style.transition = '';
        }, 300);
    });
});
