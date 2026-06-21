// ==================== 测试 Step 2: 发送离线下载任务 ====================
// 用法:
//   COOKIE_115="..." node test-offline-step2.js "<magnet-link>"
//
// 流程:
//   1. 从 Cookie 首段提取 uid
//   2. 获取 space token (sign + time)
//   3. POST 磁力链到 115 离线任务 API
//   4. 打印成功/失败信息

const fs = require("fs");

// -------------------------------------------------------
// 1. Mock Widget 全局
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
    post: async (url, body, opts) => {
      const headers = Object.assign(
        { "Content-Type": "application/x-www-form-urlencoded" },
        opts?.headers || {}
      );
      const res = await fetch(url, { method: "POST", headers, body, redirect: "follow" });
      const text = await res.text();
      return { data: text, statusCode: res.status };
    },
  },
  html: { load: () => null },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } },
};
global.WidgetMetadata = {};

// -------------------------------------------------------
// 2. 载入 pan115 模块
// -------------------------------------------------------
eval(fs.readFileSync("./forward_player/pan115_v1.1.0-stable.js", "utf8"));

// -------------------------------------------------------
// 3. 参数 + Cookie
// -------------------------------------------------------
const MAGNET = process.argv[2];
if (!MAGNET) {
  console.error("❌ 请传入磁力链接作为第一个参数");
  console.error("   COOKIE_115=\"...\" node test-offline-step2.js \"magnet:?xt=urn:btih:...\"");
  process.exit(1);
}

const COOKIE = (process.env.COOKIE_115 || "").trim();
if (!COOKIE) {
  console.error("❌ 请通过环境变量 COOKIE_115 传入 Cookie");
  process.exit(1);
}

// 从 Cookie 首段提取 uid（格式: "UID=123456; CID=...; ..." → "123456"）
const firstEntry = COOKIE.split(";")[0].trim();
const uid = firstEntry.includes("=") ? firstEntry.split("=").slice(1).join("=") : "";
console.log("✅ Cookie 已读取, 长度:", COOKIE.length, "字符");
console.log("   提取 uid:", uid || "(空)");
console.log("   磁力链:", MAGNET.slice(0, 80) + (MAGNET.length > 80 ? "..." : ""));

// -------------------------------------------------------
// 4. 获取 space token
// -------------------------------------------------------
async function getSpaceToken() {
  const url = "https://115.com/?ct=offline&ac=space&_=" + Date.now();
  const raw = await httpGet(url, { headers: cookieHeader(COOKIE) });
  const json = JSON.parse(String(raw));
  if (!json.state) throw new Error("space 返回 state=false: " + JSON.stringify(json));
  return json; // { sign, time }
}

// -------------------------------------------------------
// 5. 发送离线任务
// -------------------------------------------------------
async function sendOffline(magnet, token) {
  // 按 laosiji 逻辑: 只取前 60 字符（恰好保留完整的 btih hash）
  const maglink = String(magnet).substring(0, 60);

  const body = "url=" + encodeURIComponent(maglink)
             + "&uid=" + encodeURIComponent(uid)
             + "&sign=" + encodeURIComponent(token.sign)
             + "&time=" + encodeURIComponent(token.time);

  console.log("\n📤 POST 离线任务");
  console.log("   发送 url 参数:", maglink);

  try {
    const raw = await Widget.http.post(
      "https://115.com/web/lixian/?ct=lixian&ac=add_task_url",
      body,
      {
        headers: Object.assign(cookieHeader(COOKIE), {
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      }
    );

    const text = String(raw.data || "");
    console.log("   原始响应:", text.slice(0, 500));

    const json = JSON.parse(text);

    if (json.state === true) {
      console.log("\n🎉 离线任务提交成功!");
      console.log("   前往 https://115.com/?tab=offline&mode=wangpan 查看进度");
      return true;
    }

    console.log("\n❌ 离线任务失败");
    if (json.errcode === "911") {
      console.log("   错误码 911: 账号使用异常，请手工验证");
    } else {
      console.log("   错误:", json.error_msg || json.error || JSON.stringify(json));
    }
    return false;
  } catch (err) {
    console.error("\n❌ 请求异常:", err.message || err);
    if (err.stack) console.error(err.stack);
    return false;
  }
}

// -------------------------------------------------------
// 6. 执行
// -------------------------------------------------------
(async () => {
  console.log("=".repeat(56));
  console.log("  Step 2 — 115 离线下载任务测试");
  console.log("=".repeat(56));

  console.log("\n--- 获取 space token ---");
  const token = await getSpaceToken();
  console.log("   sign:", token.sign);
  console.log("   time:", token.time);
  console.log("   容量:", token.size, "| 单任务上限:", Math.round(token.limit / 1024 / 1024 / 1024) + "GB");

  console.log("\n--- 发送离线任务 ---");
  const ok = await sendOffline(MAGNET, token);

  process.exit(ok ? 0 : 1);
})().catch((err) => {
  console.error("❌ 未捕获异常:", err);
  process.exit(1);
});

