// PPnix Proxy Worker
// 部署到 Cloudflare Workers 后，模块 globalParams 的 host 改为本 Worker 地址即可
// 无需手动获取 cf_clearance cookie

const TARGET = "https://www.ppnix.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 构造目标 URL：把 Worker 的路径原样拼到 PPnix 上
    const targetUrl = TARGET + url.pathname + url.search;

    // 转发请求头 — 模拟真实浏览器
    const headers = new Headers({
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Referer": TARGET + "/cn/",
    });

    // 透传原始请求中的 Cookie（如果有的话，可选）
    const origCookie = request.headers.get("Cookie");
    if (origCookie) headers.set("Cookie", origCookie);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
    });

    // 透传返回
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
};
