// Supjav 代理 Worker v1.1
// GET /?id=333438&fmt=json → JSON { url: "..." } 或 { error: "详细原因" }

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0";

async function getM3U8ById(id) {
  const r1 = await fetch("https://supjav.com/" + id + ".html", {
    headers: { referer: "https://supjav.com/", "user-agent": UA },
  });
  if (!r1.ok) throw new Error("Supjav HTTP " + r1.status + " (可尝试其他 IP)");

  const html = await r1.text();
  if (html.includes("cf-browser") || html.includes("Just a moment")) {
    throw new Error("Supjav Cloudflare 拦截 (详情页)");
  }

  // 匹配 data-link
  let dl = html.match(/data-link="([^"]+)"[^>]*>\s*TV\s*<\//i);
  if (!dl) {
    const preview = html.replace(/[\s\n]+/g, " ").slice(0, 500);
    throw new Error("未找到 TV data-link。页面内容: " + preview);
  }

  const rev = dl[1].split("").reverse().join("");
  const r2 = await fetch("https://lk1.supremejav.com/supjav.php?c=" + encodeURIComponent(rev), {
    headers: { referer: "https://supjav.com/", "user-agent": UA },
  });
  if (!r2.ok) throw new Error("supremejav API HTTP " + r2.status);

  const text = (await r2.text()).replace(/\\\//g, "/").replace(/&amp;/g, "&");
  const m = text.match(/urlPlay.*?(https?:\/\/[^\s"']+?\.m3u8[^\s"']*)/i);
  if (!m) throw new Error("API 未找到 m3u8。响应: " + text.slice(0, 300));

  return m[1];
}

async function searchId(q) {
  const r = await fetch("https://supjav.com/?s=" + encodeURIComponent(q), {
    headers: { referer: "https://supjav.com/", "user-agent": UA },
  });
  if (!r.ok) throw new Error("搜索页 HTTP " + r.status);
  const html = await r.text();
  if (html.includes("cf-browser") || html.includes("Just a moment")) {
    throw new Error("Supjav Cloudflare 拦截 (搜索页)");
  }
  const ids = [...html.matchAll(/href="(?:\/[a-z]{2})?\/(\d{4,8})\.html"/g)].map(m => m[1]);
  const unique = [...new Set(ids)];
  if (unique.length === 0) throw new Error("搜索无结果。页面: " + html.replace(/[\s\n]+/g, " ").slice(0, 300));
  return unique[0];
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    try {
      let masterUrl;
      if (url.searchParams.has("q")) {
        masterUrl = await getM3U8ById(await searchId(url.searchParams.get("q")));
      } else if (url.searchParams.has("id")) {
        const id = url.searchParams.get("id");
        if (!/^\d{4,8}$/.test(id)) throw new Error("id 必须是 4-8 位数字");
        masterUrl = await getM3U8ById(id);
      } else {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
        });
      }
      const body = JSON.stringify({ url: masterUrl });
      return new Response(body, {
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    } catch (e) {
      const body = JSON.stringify({ error: e.message, name: e.name });
      return new Response(body, {
        status: 500,
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    }
  },
};
