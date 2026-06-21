// ddys Proxy Worker
// 部署后模块 globalParams 的 cookie 可以清空，host 改为本 Worker 地址
// cookie 过期时只需要在 Worker 环境变量中更新，无需修改模块

const TARGET = "https://ddys.app";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;

    const headers = new Headers({
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Referer": TARGET + "/",
    });

    // 从环境变量读取 cookie（在 Cloudflare Dashboard → Worker → 设置 → 变量 中配置）
    // 变量名: DDYS_COOKIE, 值: ddys_protect_xxx=xxxx
    const ddysCookie = env.DDYS_COOKIE || "";
    if (ddysCookie) headers.set("Cookie", ddysCookie);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
};
