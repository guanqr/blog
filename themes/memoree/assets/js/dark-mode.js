// Two-State Dark Mode (Light ↔ Dark)

const defaultTheme = '{{ .Site.Params.defaultTheme | default "light" }}';

// Initialize — convert legacy 'system' to default
let theme = localStorage.getItem('theme');
if (!theme || theme === 'system') theme = defaultTheme;
applyTheme(theme);

window.addEventListener('DOMContentLoaded', () => {
    changeModeMeta();
    updateIcons(theme);

    const switcher = document.getElementById('theme-switcher');
    if (switcher) {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            theme = theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            applyTheme(theme);
            changeModeMeta();
            updateIcons(theme);
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
    updateIcons(theme);
});

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
}

function updateIcons(t) {
    document.querySelectorAll('.theme-icon-light, .theme-icon-dark, .theme-icon-system')
        .forEach(icon => icon.style.display = 'none');
    const icon = document.querySelector('.theme-icon-' + t);
    if (icon) icon.style.display = 'inline-block';
}

function changeModeMeta() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '{{ .Site.Params.themeColorDark }}' : '{{ .Site.Params.themeColor }}';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
}
