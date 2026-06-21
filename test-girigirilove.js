// ============================================================
//  test-girigirilove.js - ギリギリ动漫模块本地回测
//  运行: node test-girigirilove.js
// ============================================================

const fs = require("fs");
const assert = require("assert/strict");

// ==================== Mock Widget 环境 ====================

const calls = [];

global.Widget = {
  http: {
    get: async (url, options = {}) => {
      calls.push("GET " + url);
      const headers = options.headers || {};
      const resp = await fetch(url, {
        headers: Object.assign({}, headers, { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" }),
      });
      const text = await resp.text();
      return { statusCode: resp.status, data: text };
    },
    post: async (url, body, options = {}) => {
      calls.push("POST " + url);
      const headers = options.headers || {};
      const resp = await fetch(url, {
        method: "POST",
        body: body,
        headers: Object.assign({}, headers, { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" }),
      });
      const text = await resp.text();
      return { statusCode: resp.status, data: text };
    },
  },
  html: { load: (h) => require("cheerio").load(h) },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } },
};

// Placeholder — eval will overwrite
global.WidgetMetadata = {};

// 加载待测模块
eval(fs.readFileSync("./widgets/girigirilove.js", "utf8"));

// ==================== 测试用例 ====================

async function testList() {
  console.log("\n--- testList: loadJapanese (日番) ---");
  const items = await loadJapanese({ page: 1 });
  console.log("  返回条目数:", items.length);
  assert.ok(items.length > 0, "应返回至少1条结果");
  const first = items[0];
  console.log("  第一条:", JSON.stringify(first, null, 2).slice(0, 200));
  assert.ok(first.id, "应有 id");
  assert.ok(first.title, "应有 title");
  assert.ok(first.link, "应有 link");
  assert.equal(first.type, "url");
  console.log("  ✅ loadJapanese OK");
}

async function testListMovie() {
  console.log("\n--- testList: loadMovie (剧场版) ---");
  const items = await loadMovie({ page: 1 });
  console.log("  返回条目数:", items.length);
  assert.ok(items.length > 0, "应返回至少1条结果");
  console.log("  ✅ loadMovie OK");
}

async function testDetail() {
  console.log("\n--- testDetail ---");
  const items = await loadJapanese({ page: 1 });
  assert.ok(items.length > 0);

  const detail = await loadDetail(items[0].link);
  console.log("  标题:", detail ? detail.title : "null");
  assert.ok(detail, "应有详情");
  assert.ok(detail.title, "应有标题");

  if (detail.episodeItems && detail.episodeItems.length > 0) {
    console.log("  剧集数:", detail.episodeItems.length);
    console.log("  第一集:", JSON.stringify(detail.episodeItems[0]));
  }

  if (detail.relatedItems && detail.relatedItems.length > 0) {
    console.log("  相关推荐数:", detail.relatedItems.length);
  }

  console.log("  ✅ loadDetail OK");
}

async function testResolveEpisode() {
  console.log("\n--- testResolveEpisode ---");
  const items = await loadJapanese({ page: 1 });
  assert.ok(items.length > 0);

  const detail = await loadDetail(items[0].link);
  assert.ok(detail, "应有详情");

  if (detail.episodeItems && detail.episodeItems.length > 0) {
    // Test resolving the first episode
    const epLink = detail.episodeItems[0].link;
    console.log("  解析剧集链接:", epLink);
    const epDetail = await loadDetail(epLink);
    console.log("  解析结果:", JSON.stringify(epDetail, null, 2).slice(0, 200));

    if (epDetail && epDetail.videoUrl) {
      console.log("  videoUrl:", epDetail.videoUrl.slice(0, 100) + "...");
      assert.ok(epDetail.videoUrl.startsWith("http"), "videoUrl 应为 URL");
    }
  }

  console.log("  ✅ resolveEpisode OK");
}

async function testSearch() {
  console.log("\n--- testSearch ---");
  const results = await search({ keyword: "Re：从零开始的异世界生活", page: 1 });
  console.log("  搜索结果数:", results.length);
  if (results.length > 0) {
    console.log("  第一条:", JSON.stringify(results[0], null, 2).slice(0, 200));
    assert.ok(results[0].id);
    assert.ok(results[0].title);
  }
  console.log("  ✅ search OK");
}

// ==================== 执行 ====================

(async () => {
  try {
    await testList();
    await testListMovie();
    await testDetail();
    await testResolveEpisode();
    await testSearch();
    console.log("\n🎉 全部测试通过!");
  } catch (e) {
    console.error("\n❌ 测试失败:", e.message || e);
    console.error(e.stack);
    process.exit(1);
  }
})();
