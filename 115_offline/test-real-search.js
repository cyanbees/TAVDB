// ==================== 115 真实搜索测试 ====================
// 用法: COOKIE_115="你的cookie" node test-real-search.js
const fs = require("fs");
const COOKIE = (process.env.COOKIE_115 || "").trim();
if (!COOKIE) { console.error("❌ 请设置 COOKIE_115 环境变量"); process.exit(1); }

global.Widget = {
  http: {
    get: async (url, opts) => {
      const headers = Object.assign(
        { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15" },
        opts?.headers || {}
      );
      const res = await fetch(url, { headers, redirect: "follow" });
      const text = await res.text();
      return { data: text, statusCode: res.status };
    },
    post: async () => { return { data: "{}", statusCode: 200 }; },
  },
  tmdb: {
    get: async (api, opts) => {
      console.log("[TMDB] 搜索:", api, JSON.stringify(opts?.params));
      return { results: [] }; // 离线模拟，不调用真实 TMDB
    }
  },
  html: { load: () => null },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } },
};
global.WidgetMetadata = {};

eval(fs.readFileSync("./115_offline/movie-tv-stream.js", "utf8"));

(async () => {
  // 测试 1: 直接搜索
  console.log("\n═══ 搜索: 香港探秘地图 ═══");
  try {
    const files = await searchFilesWithPath(COOKIE, "香港探秘地图");
    console.log("结果数:", files.length);
    files.forEach((f, i) => {
      console.log(`  [${i}] ${f.filename} | ${(f.size/1e9).toFixed(1)}GB | cid=${f.cid} | pickcode=${f.pickcode.slice(0,8)}...`);
    });
  } catch (e) {
    console.log("搜索失败:", e.message);
  }

  // 测试 2: 用 loadResource 模拟宿主调用
  console.log("\n═══ loadResource 测试 ═══");
  const params = {
    title: "香港探秘地图第一季第一集",
    seriesName: "香港探秘地图",
    season: 1,
    episode: 1,
    cookie: COOKIE
  };
  const result = await loadResource(params);
  console.log("返回 stream sources:", result.length);
  result.forEach((s, i) => {
    console.log(`  [${i}] ${s.description} | ${s.url.slice(0, 60)}...`);
  });
})().catch(e => { console.error("异常:", e.message, e.stack); process.exit(1); });
