// 站点 JS 入口（js.Build ES 模块）：集中初始化顺序与功能开关守卫
import { initForceHttps } from './force-https.js';
import { initHeader } from './header.js';
import { initNavToggle } from './nav-toggle.js';
import { initBackToTop } from './back-to-top.js';
import { initDarkMode } from './dark-mode.js';
import { initCopyButtons } from './copy.js';
import { initComments } from './comments.js';
import { initResizeFreeze } from './resize-freeze.js';
import { initSidebar } from './sidebar.js';
import { initMediumZoom } from './medium-zoom-init.js';
import { initImageLazy } from './image-lazy.js';
import { initImageFade } from './image-fade.js';
import { enableHeader, enableNavToggle, enableBackToTopAutoHide } from '@params';

// HTTPS 跳转尽早执行（模块求值即可，不等 DOMContentLoaded）
initForceHttps();

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    if (enableHeader && enableNavToggle) initNavToggle();
    if (enableBackToTopAutoHide) initBackToTop();
    initDarkMode();
    initCopyButtons();
    initComments();
    initResizeFreeze();
    initSidebar();
    initMediumZoom();
    initImageLazy();
    initImageFade();
}, { once: true });
