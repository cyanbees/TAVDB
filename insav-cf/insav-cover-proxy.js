/**
 * Insav 4K 封面图片代理 Worker
 * 
 * 4k.insav.tv 的图片存储于 CDN (ut.lnh7.com) 并需要正确请求头，
 * 此 Worker 代理图片请求，添加必要的 Referer 和 Origin 头。
 * 
 * 部署方式：
 *   1. 登录 https://dash.cloudflare.com
 *   2. Workers 和 Pages → 创建应用程序 → 创建 Worker
 *   3. 粘贴本文件内容 → 部署
 *   4. 在 insav 插件的「封面代理」参数中填入:
 *      https://你的子域名.workers.dev
 */

// 尝试的 CDN 域名列表
const CDN_DOMAINS = [
  "ut.lnh7.com",
  "img.lnh7.com",
  "cdn.lnh7.com",
  "static.lnh7.com",
  "lnh7.com",
];

// 请求头（模拟浏览器）
const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
  "Referer": "https://4k.insav.tv/",
  "Origin": "https://4k.insav.tv",
  "Sec-Fetch-Dest": "image",
  "Sec-Fetch-Mode": "no-cors",
  "Sec-Fetch-Site": "cross-site",
  // CDN 检查的客户端头
  "client-channel": "4k",
  "client-lang": "zh",
  "client-type": "2",
  "client-version": "1.0.0",
};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    let imagePath = url.searchParams.get("url") || url.pathname;

    // 如果 path 是完整 URL，提取路径部分
    if (imagePath.startsWith("http")) {
      try {
        imagePath = new URL(imagePath).pathname + new URL(imagePath).search;
      } catch (e) {
        imagePath = url.pathname;
      }
    }

    // 确保路径以 / 开头
    if (!imagePath.startsWith("/")) {
      imagePath = "/" + imagePath;
    }

    // 尝试多个 CDN 域名
    const errors = [];
    for (const domain of CDN_DOMAINS) {
      try {
        const cdnUrl = "https://" + domain + imagePath;
        const response = await fetch(cdnUrl, {
          method: request.method,
          headers: {
            ...FETCH_HEADERS,
            "Host": domain,
          },
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "";
          
          // 如果是图片，返回内容
          if (contentType.startsWith("image/")) {
            // 复制响应头
            const responseHeaders = new Headers();
            responseHeaders.set("Content-Type", contentType);
            responseHeaders.set("Cache-Control", "public, max-age=86400");
            responseHeaders.set("Access-Control-Allow-Origin", "*");

            // 如果有内容长度
            const contentLength = response.headers.get("content-length");
            if (contentLength) {
              responseHeaders.set("Content-Length", contentLength);
            }

            return new Response(response.body, {
              status: 200,
              headers: responseHeaders,
            });
          }

          // 如果不是图片（比如返回了 HTML），继续尝试下一个
          errors.push(`${domain}: 非图片响应 (${contentType})`);
          continue;
        }

        if (response.status === 403) {
          errors.push(`${domain}: 403 Forbidden`);
          continue;
        }

        if (response.status === 404) {
          errors.push(`${domain}: 404 Not Found`);
          continue;
        }

        // 其他状态码
        errors.push(`${domain}: ${response.status} ${response.statusText}`);
        continue;
      } catch (e) {
        errors.push(`${domain}: ${e.message}`);
        continue;
      }
    }

    // 所有 CDN 都失败
    const errorMsg = `图片加载失败: ${errors.join("; ")}`;
    
    // 返回一个 1x1 透明像素作为 fallback（避免 broken image 图标）
    return new Response(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      {
        status: 200,
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-cache",
          "X-Proxy-Error": errorMsg,
        },
      }
    );
  },
};
