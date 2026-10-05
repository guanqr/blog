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
