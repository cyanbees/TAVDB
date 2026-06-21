// ============================================================
//  test-supjav-stream.js - Supjav 播放源模块本地回测
//  运行: node test-supjav-stream.js
// ============================================================

const fs = require("fs");
const assert = require("assert/strict");

const MASTER_M3U8_URL = "https://cdn2.turboviplay.com/data1/6a0c1c9b5cfd2/6a0c1c9b5cfd2.m3u8";
const WORKER_BASE = "https://supjav-proxy.cybees7.workers.dev";

// ==================== Mock Widget 环境 ====================

const calls = [];

global.Widget = {
  http: {
    get: async (url, options = {}) => {
      calls.push(url);

      // Worker 成功
      if (url.includes("supjav-proxy.cybees7.workers.dev")) {
        const u = new URL(url);
        if (u.searchParams.has("id") || u.searchParams.has("q")) {
          return { statusCode: 200, data: JSON.stringify({ url: MASTER_M3U8_URL }) };
        }
      }

      // Worker 失败场景（用于测试 fallback）
      if (url.includes("fail")) {
        return { statusCode: 500, data: JSON.stringify({ error: "模拟失败" }) };
      }

      throw new Error("未 mock 的 URL: " + url);
    }
  },
  html: { load: (h) => { try { return require("cheerio").load(h); } catch(e) { return { find:()=>[], each:()=>{} }; } } },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } }
};

global.WidgetMetadata = {};

// ==================== 加载模块 ====================

console.log("\n=== 加载模块 ===");
eval(fs.readFileSync("./supjav-stream.js", "utf8"));

assert.ok(typeof reverseString === "function", "reverseString 应该是一个函数");
assert.ok(typeof extractSearchCode === "function", "extractSearchCode 应该是一个函数");
assert.ok(typeof loadResource === "function", "loadResource 应该是一个函数");
console.log("✅ 所有函数已导出");

// ==================== 测试工具函数 ====================

console.log("\n=== 测试 reverseString ===");
{
  const result = reverseString("abc123");
  assert.equal(result, "321cba", "反转结果应正确");
  console.log("✅ reverseString 正确");
}

console.log("\n=== 测试 extractSearchCode ===");
{
  assert.equal(extractSearchCode("SSNI-123"), "SSNI-123", "JAV 番号应提取");
  assert.equal(extractSearchCode("ONEX-067"), "ONEX-067", "ONEX 番号应提取（通用匹配）");
  assert.equal(extractSearchCode("MIMK-280"), "MIMK-280", "MIMK 番号应提取（已知厂商列表）");
  assert.equal(extractSearchCode("MNGS-055"), "MNGS-055", "MNGS 番号应提取（通用匹配）");
  assert.equal(extractSearchCode("422598"), "422598", "纯数字 ID 应提取");
  assert.equal(extractSearchCode("FC2-PPV-12345"), "FC2-12345", "FC2 番号应去掉 PPV 后缀");
  assert.equal(extractSearchCode(""), "", "空输入应返回空字符串");
  console.log("✅ extractSearchCode 全部正确");
}

console.log("\n=== 测试 headersFor ===");
{
  const headers = headersFor(MASTER_M3U8_URL);
  assert.ok(headers["Referer"], "应包含 Referer");
  assert.ok(headers["User-Agent"], "应包含 User-Agent");
  assert.ok(headers["Accept"], "应包含 Accept");
  console.log("✅ headersFor 正确:", headers["Referer"]);
}

// ==================== 测试 loadResource ====================

console.log("\n=== 测试 loadResource (纯数字 ID → Worker) ===");
(async () => {
  try {
    calls.length = 0;
    const items = await loadResource({ code: "422598" });

    assert.ok(Array.isArray(items), "应返回数组");
    assert.equal(items.length, 1, "应返回 1 个 stream item");

    const item = items[0];
    assert.equal(item.name, "[422598] 1080P", "名称应为 [ID] 1080P");
    assert.equal(item.url, MASTER_M3U8_URL, "URL 应为 master m3u8");
    assert.ok(item.customHeaders, "应有 customHeaders");
    console.log("  ✅ 名称:", item.name);
    console.log("  ✅ 调用 Worker:", calls.some(c => c.includes("id=422598")) ? "是" : "否");

  } catch (error) {
    console.error("❌ 失败:", error.message || error);
    process.exit(1);
  }
})().then(() => {
  console.log("\n=== 测试 loadResource (JAV 番号 → Worker) ===");
  return (async () => {
    try {
      calls.length = 0;
      const items = await loadResource({ code: "MIMK-280" });

      assert.ok(Array.isArray(items), "应返回数组");
      assert.equal(items.length, 1, "应返回 1 个 stream item");
      assert.equal(items[0].name, "[MIMK-280] 1080P", "名称应为 [番号] 1080P");
      console.log("  ✅ 名称:", items[0].name);
      console.log("  ✅ 调用 Worker:", calls.some(c => c.includes("q=MIMK-280")) ? "是" : "否");

    } catch (error) {
      console.error("❌ 失败:", error.message || error);
      process.exit(1);
    }
  })();
}).then(() => {
  console.log("\n=== 测试 loadResource (无 code 返回空) ===");
  return (async () => {
    try {
      calls.length = 0;
      const items = await loadResource({ title: "some random title without id" });

      assert.ok(Array.isArray(items), "应返回数组");
      assert.equal(items.length, 0, "无 code 时应返回空数组");
      console.log("  ✅ 返回空数组，无 fallback");

    } catch (error) {
      console.error("❌ 失败:", error.message || error);
      process.exit(1);
    }
  })();
}).then(() => {
  console.log("\n=== 测试 Worker 失败 → 返回空 ===");
  return (async () => {
    // 模拟 Worker 返回 500
    const origGet = Widget.http.get;
    Widget.http.get = async (url) => {
      if (url.includes("supjav-proxy.cybees7.workers.dev")) {
        return { statusCode: 500, data: JSON.stringify({ error: "模拟失败" }) };
      }
      return origGet(url);
    };

    try {
      const items = await loadResource({ code: "422598" });
      assert.equal(items.length, 0, "Worker 失败应返回空数组而不是 fallback");
      console.log("  ✅ Worker 失败，返回空数组，不播放错误内容");

    } catch (error) {
      console.error("❌ 失败:", error.message || error);
      process.exit(1);
    } finally {
      Widget.http.get = origGet;
    }
  })();
}).then(() => {
  console.log("\n🎉 所有测试通过!");
}).catch((e) => {
  console.error("\n❌ 测试失败:", e.message || e);
  process.exit(1);
});
