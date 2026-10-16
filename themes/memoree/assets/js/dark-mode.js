// Two-State Dark Mode (Light ↔ Dark)

const defaultTheme = '{{ .Site.Params.defaultTheme | default "light" }}';

// Initialize — 主题决议由 head 内联脚本在样式表前完成并写入 data-theme，
// 此处以其结果为准（脚本早退时属性缺失，回退默认主题），避免双份维护
let theme = document.documentElement.getAttribute('data-theme') || defaultTheme;

window.addEventListener('DOMContentLoaded', () => {
    changeModeMeta();

    const switcher = document.getElementById('theme-switcher');
    if (switcher) {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            theme = theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            applyTheme(theme);
            changeModeMeta();
        });
    }
}, { once: true });

// Cross-tab sync
window.addEventListener('storage', (e) => {
    if (e.key !== 'theme') return;
    theme = e.newValue || defaultTheme;
    if (theme === 'system') theme = defaultTheme;
    applyTheme(theme);
    changeModeMeta();
});

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
}

function changeModeMeta() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '{{ .Site.Params.themeColorDark | default "#16171d" }}' : '{{ .Site.Params.themeColor | default "#fff" }}';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
}
