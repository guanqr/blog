import { enableForceHTTPS, siteHost } from '@params';

// 站内 HTTP → HTTPS 跳转（仅在 enableForceHTTPS 开启的生产构建中生效）
export function initForceHttps() {
    if (!enableForceHTTPS) return;

    if (window.location.host === siteHost && window.location.protocol !== 'https:') {
        window.location.protocol = 'https';
    }
}
