// 共享滚动工具：throttle 与 delayTime 供 header.js、nav-toggle.js、
// back-to-top.js 使用——这些脚本经 Hugo 管道合并进同一 bundle，
// 此处声明的 const 对同 bundle 的其余文件全局可见

// 节流：窗口首帧立即执行 + 窗口末尾补一次尾调用；
// 计时器随滚动自然归零，避免每次滚动事件都创建/取消定时器
const throttle = (fn, wait) => {
    let lastTime = 0;
    let timer = null;
    return function() {
        const context = this,
              args = arguments,
              now = Date.now(),
              remaining = wait - (now - lastTime);
        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastTime = now;
            fn.apply(context, args);
        } else if (!timer) {
            timer = setTimeout(function() {
                lastTime = Date.now();
                timer = null;
                fn.apply(context, args);
            }, remaining);
        }
    };
};

const delayTime = 420;
