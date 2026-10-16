/**
 * Service Worker（策略参考 MimoRee、按本站裁剪）：
 * - 页面导航（HTML）：NetworkFirst → 运行时缓存回退 → 预缓存首页回退
 *   （离线打开任意链接至少看到站点首页）
 * - /css/ /js/ 哈希产物、/fonts/ /icons/：Stale-While-Revalidate
 *   （缓存即用、后台更新——内容随 URL 哈希不可变，不会陈旧）
 * - 其余同源 GET：NetworkFirst 入运行时缓存
 * - 跨域（OSS 图片、CDN 字体）与非 GET 不拦截；Range 请求直接放行网络
 * - 版本号由构建时间自动注入（service-worker.html 的 ExecuteAsTemplate，
 *   每次发布自动换版）：shell 缓存随版本清理；运行时缓存跨版本保留、
 *   activate 时按条目上限裁剪（仅 activate 触发，浏览期不扫全表）
 */
const VERSION = '{{ .version }}'
const SHELL_CACHE = `memoree-shell-${VERSION}`
const RUNTIME = 'memoree-runtime'
const MAX_RUNTIME_ENTRIES = 500
const PRECACHE = ['/']
// 导航网络请求超时：弱网下连接挂起（既不 resolve 也不 reject）时 abort、
// 回退缓存/首页；本站为 MPA（无 SPA 侧共享超时），值唯一定义于此
const NAV_TIMEOUT_MS = 3000

// 运行时缓存句柄全生命周期复用（避免每个请求都 caches.open 一次）
const runtimeCache = caches.open(RUNTIME)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      // 逐条预缓存且容忍单点失败：cache.addAll 一损俱损——任一资源临时 5xx
      // 会阻塞整个升级（老 SW 继续服役），单个资源缺失不应阻挡换版
      .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 清理旧版本化缓存：shell 缓存随版本换名，旧版本在此回收；
    // 运行时缓存跨版本保留（用户资产不随发布清空）
    const keys = await caches.keys()
    await Promise.all(
      keys
        .filter((k) => k.startsWith('memoree-') && k !== SHELL_CACHE && k !== RUNTIME)
        .map((k) => caches.delete(k))
    )
    // 运行时缓存条目上限（防长期使用撑爆配额；按 keys 序淘汰最旧）
    try {
      const cache = await runtimeCache
      const entries = await cache.keys()
      if (entries.length > MAX_RUNTIME_ENTRIES) {
        await Promise.all(entries.slice(0, entries.length - MAX_RUNTIME_ENTRIES).map((r) => cache.delete(r)))
      }
    } catch { /* 裁剪失败不影响接管 */ }
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  // 仅同源 GET；跨域（OSS 图片、CDN 字体）与 Range 请求不拦截
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  // origin 精确比较而非字符串前缀：startsWith 会放行 guanqr.com.evil.com
  // 等前缀相同域名、把跨域响应写入运行时缓存
  if (url.origin !== self.location.origin) return
  if (request.headers.has('range')) return
  const isNavigation = request.mode === 'navigate'
  const isHashed = /^\/(css|js|fonts|icons)\//.test(url.pathname)
  // 缓存键去查询串：?y=/?p= 等客户端状态参数服务端返回同一份 HTML——
  // 旧版本按完整 URL 写入的条目不再命中（一次性离线回退损失，超限自动裁剪回收）
  const cacheKey = url.search && !isHashed
    ? new Request(url.origin + url.pathname)
    : request

  event.respondWith((async () => {
    const cache = await runtimeCache

    // 哈希产物/字体/图标：SWR——缓存即用、后台更新。
    // 单次 fetch 共享：未命中时返回同一个 promise（后台写缓存与响应共用），
    // 避免冷缓存时同一 URL 并发两次请求
    if (isHashed) {
      const cachedResponse = await cache.match(request)
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200) cache.put(request, res.clone())
          return res
        })
        .catch(() => null)
      return cachedResponse || network
    }

    // 页面与其余同源资源：NetworkFirst，离线回退缓存；
    // 导航再回退预缓存首页——caches.match 全局查找：首页由 install
    // 预缓存进 SHELL_CACHE，而运行时写入在 RUNTIME，只查后者会漏掉
    try {
      // 导航网络请求超时控制：AbortController 超时 abort（同时中断 headers
      // 到达后的正文流读取），abort 抛错走下方缓存/首页回退——败方请求不残留
      // 僵尸连接；计时器 settle 后必清（fetch 先完成时同样不挂死定时器）。
      // 非导航同源资源不加超时（其失败只影响单个资源、不阻塞页面呈现）
      let networkResponse
      if (isNavigation) {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), NAV_TIMEOUT_MS)
        try {
          networkResponse = await fetch(request, { signal: controller.signal })
        } finally {
          clearTimeout(timer)
        }
      } else {
        networkResponse = await fetch(request)
      }
      if (networkResponse.status === 200) cache.put(cacheKey, networkResponse.clone())
      return networkResponse
    } catch (e) {
      const cachedResponse = await cache.match(cacheKey)
      if (cachedResponse) return cachedResponse
      if (isNavigation) {
        const shell = await caches.match('/')
        if (shell) return shell
      }
      return Response.error()
    }
  })())
})
