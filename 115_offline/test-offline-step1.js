// ==================== 测试 Step 1: 115 离线 Token 接口 (space) ====================
// 用法:
//   COOKIE_115="你的完整cookie" node test-offline-step1.js
//
// 测试目标:
//   - Cookie 鉴权是否通过
//   - 能否正常获取 sign / time
//   - 响应是 JSON (已登录) 还是 HTML (未登录跳转)

const fs = require("fs");

// -------------------------------------------------------
// 1. Mock Widget 全局 — live 模式，http.get 代理到真实 fetch
// -------------------------------------------------------
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
    post: async () => { throw new Error("post not mocked for step1"); },
  },
  html: { load: () => null },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } },
};
global.WidgetMetadata = {};

// -------------------------------------------------------
// 2. 载入 pan115 模块，拿到 httpGet / cookieHeader / BASE_HEADERS
// -------------------------------------------------------
eval(fs.readFileSync("./forward_player/pan115_v1.1.0-stable.js", "utf8"));

// -------------------------------------------------------
// 3. 读取 Cookie
// -------------------------------------------------------
const COOKIE = (process.env.COOKIE_115 || "").trim();
if (!COOKIE) {
  console.error("❌ 请通过环境变量传入 Cookie:");
  console.error("   COOKIE_115=\"...\" node test-offline-step1.js");
  process.exit(1);
}
console.log("✅ Cookie 已读取，长度:", COOKIE.length, "字符");
console.log("   前 40 位:", COOKIE.slice(0, 40) + "...");

// -------------------------------------------------------
// 4. 测试 space 端点
// -------------------------------------------------------
async function testSpace() {
  const url = "https://115.com/?ct=offline&ac=space&_=" + Date.now();
  console.log("\n🌐 请求:", url);

  try {
    const raw = await httpGet(url, { headers: cookieHeader(COOKIE) });
    console.log("📦 原始响应 (前 200 字符):", String(raw).slice(0, 200));

    // 判断是 JSON 还是 HTML
    const trimmed = String(raw).trim();
    if (trimmed.startsWith("{")) {
      const json = JSON.parse(trimmed);
      console.log("\n✅ 返回 JSON — Cookie 鉴权通过");
      console.log("   完整 JSON:", JSON.stringify(json, null, 2));

      if (json.sign && json.time) {
        console.log("\n🎉 sign 和 time 均获取成功!");
        console.log("   sign:", json.sign);
        console.log("   time:", json.time);
        return json;
      } else {
        console.log("\n⚠️  缺少 sign/time 字段，响应结构:", Object.keys(json));
        return json;
      }
    } else if (trimmed.includes("<html") || trimmed.includes("<!DOCTYPE")) {
      console.log("\n❌ 返回 HTML — 未登录 / Cookie 无效，被重定向到了登录页");
      console.log("   前 300 字符:", trimmed.slice(0, 300));
      return null;
    } else {
      console.log("\n⚠️  响应不是 JSON 也不是 HTML，无法判断:");
      console.log(trimmed.slice(0, 300));
      return null;
    }
  } catch (err) {
    console.error("\n❌ 请求异常:", err.message || err);
    if (err.stack) console.error(err.stack);
    return null;
  }
}

// -------------------------------------------------------
// 5. 执行
// -------------------------------------------------------
(async () => {
  console.log("=".repeat(56));
  console.log("  Step 1 — 115 离线 Token 接口测试");
  console.log("=".repeat(56));

  const result = await testSpace();

  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
})().catch((err) => {
  console.error("❌ 未捕获异常:", err);
  process.exit(1);
});

