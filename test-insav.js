// ============================================================
//  insav 模块测试脚本
//  运行: node test-insav.js
//  注意: 需要 node-fetch 等依赖（已在 package.json）
//  如果缺少依赖，先 npm install node-fetch fetch-cookie
// ============================================================
const fs = require("fs");

// Mock Widget 环境
const calls = [];

// 简易 fetch（如果有 node-fetch 就用，否则用 http/https 模块）
let fetchImpl;
try {
  fetchImpl = require("node-fetch");
  console.log("✅ 使用 node-fetch");
} catch (e) {
  // 使用原生 http/https 模块
  const http = require("http");
  const https = require("https");
  fetchImpl = async (url, opts = {}) => {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith("https") ? https : http;
      const { hostname, pathname, search } = new URL(url);
      const options = {
        hostname,
        path: pathname + search,
        method: opts.method || "GET",
        headers: opts.headers || {},
      };
      if (opts.body) options.headers["Content-Length"] = Buffer.byteLength(opts.body);
      const req = lib.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: res.headers,
            json: async () => JSON.parse(data),
            text: async () => data,
            buffer: async () => Buffer.from(data),
          });
        });
      });
      req.on("error", reject);
      if (opts.body) req.write(opts.body);
      req.end();
    });
  };
  console.log("✅ 使用内置 http/https 模块");
}

global.Widget = {
  http: {
    get: async (url, opts = {}) => {
      calls.push("GET " + url);
      console.log(`  [GET] ${url}`);
      const res = await fetchImpl(url, { method: "GET", headers: opts.headers });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(e) { data = text; }
      console.log(`  ← ${res.status} (${typeof data === 'string' ? data.substring(0,60) : JSON.stringify(data).substring(0,80)})`);
      return { data, status: res.status, headers: res.headers };
    },
    post: async (url, body, opts = {}) => {
      calls.push("POST " + url);
      console.log(`  [POST] ${url}`);
      const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
      const res = await fetchImpl(url, { method: "POST", headers, body });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(e) { data = text; }
      console.log(`  ← ${res.status} (${typeof data === 'string' ? data.substring(0,60) : JSON.stringify(data).substring(0,120)})`);
      return { data, status: res.status, headers: res.headers };
    },
  },
  storage: {
    _store: {},
    get: async (k) => global.Widget.storage._store[k],
    set: async (k, v) => { global.Widget.storage._store[k] = v; },
  },
  html: { load: () => {} },
};

global.WidgetMetadata = {};

// 加载模块
console.log("\n===== 加载 insav.js =====");
eval(fs.readFileSync("./insav.js", "utf8"));
console.log("✅ 模块加载成功\n");

// ============================================================
//  测试 1: 获取 Token
// ============================================================
async function testGetToken() {
  console.log("===== 测试 1: 获取 Token =====");
  try {
    var result = await getToken();
    if (result && result.token) {
      console.log("✅ Token 获取成功:", result.token.substring(0, 20) + "...");
      return result.token;
    } else {
      console.log("⚠️ Token 获取失败或为空:", JSON.stringify(result));
      return null;
    }
  } catch (e) {
    console.error("❌ Token 获取异常:", e.message);
    return null;
  }
}

// ============================================================
//  测试 2: 调用视频列表 API
// ============================================================
async function testVideoList() {
  console.log("\n===== 测试 2: 视频列表 =====");
  try {
    var items = await loadLatestVideos({ page: 1 });
    if (items && items.length > 0) {
      console.log("✅ 获取到", items.length, "个视频");
      console.log("   第一个:", JSON.stringify(items[0], null, 2).substring(0, 200));
      return items;
    } else {
      console.log("⚠️ 列表为空或不存在");
      return [];
    }
  } catch (e) {
    console.error("❌ 列表获取异常:", e.message);
    return [];
  }
}

// ============================================================
//  测试 3: 搜索
// ============================================================
async function testSearch() {
  console.log("\n===== 测试 3: 搜索 =====");
  try {
    var items = await searchVideos({ keyword: "test", page: 1 });
    if (items && items.length > 0) {
      console.log("✅ 搜索到", items.length, "个结果");
      console.log("   第一个:", JSON.stringify(items[0], null, 2).substring(0, 200));
    } else {
      console.log("ℹ️ 搜索无结果或接口不可用");
    }
    return items;
  } catch (e) {
    console.error("❌ 搜索异常:", e.message);
    return [];
  }
}

// ============================================================
//  测试 4: 视频详情
// ============================================================
async function testDetail(videoId) {
  console.log("\n===== 测试 4: 视频详情 =====");
  try {
    var detail = await loadDetail("detail:" + videoId);
    if (detail) {
      console.log("✅ 详情获取成功");
      console.log("   标题:", detail.title);
      console.log("   播放地址:", detail.videoUrl ? detail.videoUrl.substring(0, 80) + "..." : "无");
      if (detail.relatedItems && detail.relatedItems.length > 0) {
        console.log("   相关推荐:", detail.relatedItems.length, "个");
      }
    } else {
      console.log("⚠️ 详情获取失败");
    }
    return detail;
  } catch (e) {
    console.error("❌ 详情异常:", e.message);
    return null;
  }
}

// ============================================================
//  主测试流程
// ============================================================
(async () => {
  try {
    var token = await testGetToken();

    var items = await testVideoList();

    // 如果有视频，测试第一个的详情
    if (items && items.length > 0) {
      var firstId = items[0].id;
      console.log("\n  测试详情，视频 ID:", firstId);
      await testDetail(firstId);
    }

    await testSearch();

    console.log("\n===== 测试完成 =====");
    console.log("共发起", calls.length, "个HTTP请求:");
    calls.forEach((c, i) => console.log("  " + (i + 1) + ".", c));
  } catch (e) {
    console.error("\n❌ 测试异常:", e.message);
  }
})();
