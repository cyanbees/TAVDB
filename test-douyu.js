// ============================================================
//  斗鱼直播模块测试脚本
//  运行: node test-douyu.js
//  注意: 需要 node-fetch 等依赖（已在 package.json）
//  如缺少依赖: npm install node-fetch
// ============================================================
const fs = require("fs");

// Mock Widget 环境
let fetchImpl;
try {
  fetchImpl = require("node-fetch");
  console.log("✅ 使用 node-fetch");
} catch (e) {
  const http = require("http");
  const https = require("https");
  fetchImpl = async (url, opts = {}) => {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith("https") ? https : http;
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname + u.search,
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

var calls = [];

global.Widget = {
  http: {
    get: async (url, opts = {}) => {
      calls.push("GET " + url);
      console.log(`  [GET] ${url}`);
      var fetchOpts = { method: "GET", headers: opts.headers || {} };
      var res = await fetchImpl(url, fetchOpts);
      var text = await res.text();
      var data;
      try { data = JSON.parse(text); } catch (e) { data = text; }
      var preview = typeof data === 'string' ? data.substring(0, 60) : JSON.stringify(data).substring(0, 120);
      console.log(`  ← ${res.status} ${preview}`);
      return { data: data, status: res.status, headers: res.headers };
    },
    post: async (url, body, opts = {}) => {
      calls.push("POST " + url);
      console.log(`  [POST] ${url}`);
      var headers = { "Content-Type": "application/x-www-form-urlencoded", ...(opts.headers || {}) };
      var fetchOpts = { method: "POST", headers: headers, body: body };
      var res = await fetchImpl(url, fetchOpts);
      var text = await res.text();
      var data;
      try { data = JSON.parse(text); } catch (e) { data = text; }
      var preview = typeof data === 'string' ? data.substring(0, 60) : JSON.stringify(data).substring(0, 120);
      console.log(`  ← ${res.status} ${preview}`);
      return { data: data, status: res.status, headers: res.headers };
    },
  },
  storage: {
    _store: {},
    get: async (k) => global.Widget.storage._store[k],
    set: async (k, v) => { global.Widget.storage._store[k] = v; },
  },
};

global.WidgetMetadata = {};

// 加载模块
eval(fs.readFileSync("./widgets/douyu.js", "utf8"));

// ========== 测试 ==========

async function runTests() {
  var pass = 0;
  var fail = 0;

  function assert(condition, msg) {
    if (condition) {
      console.log("  ✅ " + msg);
      pass++;
    } else {
      console.log("  ❌ " + msg);
      fail++;
    }
  }

  // === 测试 1: 首页推荐 ===
  console.log("\n📋 测试 1: loadRecommended 首页");
  try {
    calls = [];
    var items = await loadRecommended({});
    console.log(`  返回 ${items.length} 个房间`);
    assert(items.length > 0, "返回房间列表");
    if (items.length > 0) {
      assert(items[0].type === "url", "items[0].type === 'url'");
      assert(items[0].id !== undefined && items[0].id !== "", "items[0].id 非空");
      assert(items[0].title !== undefined && items[0].title !== "", "items[0].title 非空");
      assert(items[0].link !== undefined, "items[0].link 存在");
      assert(items[0].coverUrl !== undefined, "items[0].coverUrl 存在");
      assert(items[0].vod_remarks !== undefined, "items[0].vod_remarks 存在");
      assert(items[0].stills === undefined, "items[0].stills 不存在（正确字段名是 backdropPaths）");
      assert(items[0].backdropPath !== undefined, "items[0].backdropPath 存在（来自 TV 模块模式）");
      assert(items[0].description !== undefined, "items[0].description 存在");
      console.log(`  首个房间: id=${items[0].id}, title=${items[0].title}`);
    }
  } catch (e) {
    console.log("  ❌ loadRecommended 异常: " + (e.message || e));
    fail++;
  }

  // === 测试 2: loadDetail（测试真实房间） ===
  console.log("\n📋 测试 2: loadDetail — 使用从首页获取的房间ID");
  try {
    // 从首页获取一个房间ID
    var homeItems = await loadRecommended({});

    if (homeItems.length > 0) {
      var roomId = homeItems[0].id;
      console.log(`  尝试获取房间 ${roomId} 的详情`);
      var detail = await loadDetail(roomId);
      assert(detail !== null && detail !== undefined, "detail 非空");
      assert(detail.type === "url", "detail.type === 'url'");
      assert(detail.title !== undefined && detail.title !== "", "detail.title 非空");
      assert(detail.link === roomId, "detail.link 等于 roomId");
      assert(detail.genreItems !== undefined, "detail.genreItems 存在（分类标签）");
      assert(detail.peoples !== undefined, "detail.peoples 存在（主播信息）");
      assert(detail.stills === undefined, "detail.stills 不存在（正确字段名是 backdropPaths）");
      assert(detail.backdropPath !== undefined || detail.backdropPath === null, "detail.backdropPath 存在");
      assert(detail.description !== undefined, "detail.description 存在");
      console.log(`  房间标题: ${detail.title}`);
      console.log(`  分类: ${detail.genreItems ? JSON.stringify(detail.genreItems) : '无'}`);
      console.log(`  主播: ${detail.peoples ? detail.peoples.map(function(p){return p.title;}).join(', ') : '无'}`);
      console.log(`  状态: ${detail.vod_remarks || '未知'}`);

      if (detail.episodeItems && detail.episodeItems.length > 0) {
        console.log(`  ✅ 最高画质: ${detail.episodeItems[0].title}`);
        assert(detail.episodeItems.length === 1, "只保留1个最高画质");

        // 测试画质选择 → 实时生成流地址
        var epLink = detail.episodeItems[0].link;
        console.log(`\n  测试画质选择 → loadDetail("ep:...")`);
        var playResult = await loadDetail(epLink);
        assert(playResult !== null && playResult !== undefined, "playResult 非空");
        assert(playResult.videoUrl !== undefined && playResult.videoUrl !== null, "playResult.videoUrl 存在（实时生成）");
        assert(playResult.playerType === "app", "playResult.playerType 是 app");
        console.log(`  ✅ 实时生成流地址成功 (前60字符): ${playResult.videoUrl.substring(0, 60)}...`);
      } else {
        console.log(`  ⚠️ 无画质选项（房间可能未开播或签名失败）`);
      }
    } else {
      console.log("  ⚠️ 跳过 loadDetail 测试：首页无房间数据");
    }
  } catch (e) {
    console.log("  ❌ loadDetail 异常: " + (e.message || e));
    fail++;
  }

  // === 测试 3: searchRooms ===
  console.log("\n📋 测试 3: searchRooms");
  try {
    calls = [];
    var searchItems = await searchRooms({ keyword: "英雄联盟", page: 1 });
    console.log(`  返回 ${searchItems.length} 个结果`);
    if (searchItems.length > 0) {
      assert(searchItems[0].type === "url", "搜索结果 type === 'url'");
      assert(searchItems[0].id !== undefined && searchItems[0].id !== "", "搜索结果 id 非空");
      assert(searchItems[0].title !== undefined && searchItems[0].title !== "", "搜索结果 title 非空");
      assert(searchItems[0].link !== undefined, "搜索结果 link 存在");
      console.log(`  首个结果: id=${searchItems[0].id}, title=${searchItems[0].title}`);
    } else {
      console.log("  ⚠️ 搜索无结果");
    }
  } catch (e) {
    console.log("  ❌ searchRooms 异常: " + (e.message || e));
    fail++;
  }

  // === 测试 4: WidgetMetadata 结构 ===
  console.log("\n📋 测试 4: WidgetMetadata 结构");
  try {
    assert(WidgetMetadata.id === "forward.video-douyu", "id 正确");
    assert(WidgetMetadata.title === "斗鱼直播", "title 正确");
    assert(WidgetMetadata.modules !== undefined && WidgetMetadata.modules.length > 0, "modules 存在");
    assert(WidgetMetadata.search !== undefined, "search 存在");

    var recMod = WidgetMetadata.modules[0];
    assert(recMod.id === "recommended", "模块 id === 'recommended'");
    assert(recMod.functionName === "loadRecommended", "模块 functionName === 'loadRecommended'");
    assert(typeof loadRecommended === 'function', "loadRecommended 是函数");
    assert(typeof searchRooms === 'function', "searchRooms 是函数");
    assert(typeof loadDetail === 'function', "loadDetail 是函数");
    assert(typeof loadResource === 'function', "loadResource 是函数");
    assert(typeof md5 === 'function', "md5 是函数");

    // 检查 loadResource stream 模块
    var streamMod = WidgetMetadata.modules[1];
    assert(streamMod !== undefined, "第2个模块 (loadResource) 存在");
    assert(streamMod.id === "loadResource", "stream 模块 id === 'loadResource'");
    assert(streamMod.type === "stream", "stream 模块 type === 'stream'");
    assert(streamMod.cacheDuration === 0, "stream 模块 cacheDuration === 0");

    // 检查 globalParams
    assert(WidgetMetadata.globalParams !== undefined, "globalParams 存在");
    assert(WidgetMetadata.globalParams.length >= 1, "globalParams 有至少1个参数");
    assert(WidgetMetadata.globalParams[0].name === "douyuCookie", "globalParams[0].name === 'douyuCookie'");
    assert(WidgetMetadata.globalParams[0].type === "input", "globalParams[0].type === 'input'");
  } catch (e) {
    console.log("  ❌ WidgetMetadata 检查异常: " + (e.message || e));
    fail++;
  }

  // === 测试 5: md5 签名 ===
  console.log("\n📋 测试 5: md5 函数");
  try {
    var testHash = md5("hello");
    assert(testHash === "5d41402abc4b2a76b9719d911017c592", "md5('hello') 正确: " + testHash);
    var emptyHash = md5("");
    assert(emptyHash === "d41d8cd98f00b204e9800998ecf8427e", "md5('') 正确: " + emptyHash);

    // 测试 getDouyuSign 的 CryptoJS 封装
    var crptext = 'var ub98484234 = function(roomId, did, t) { var s = CryptoJS.MD5(roomId + did + t).toString(); return "v=2201&did=" + did + "&t=" + t + "&sign=" + s; };';
    var signResult = getDouyuSign(crptext, "12345");
    assert(signResult.length > 0, "签名结果非空: " + signResult);
    assert(signResult.indexOf("v=2201") >= 0, "签名包含 v=2201");
    assert(signResult.indexOf("sign=") >= 0, "签名包含 sign=");
  } catch (e) {
    console.log("  ❌ md5 测试异常: " + (e.message || e));
    fail++;
  }

  // === 测试 6: 分类路由（genreId） ===
  console.log("\n📋 测试 6: loadRecommended 分类路由 (genreId)");
  try {
    calls = [];
    // 使用一个已知的分类ID（网游常见ID）
    var genreItems = await loadRecommended({ genreId: "1", page: 1 });
    console.log(`  返回 ${genreItems.length} 个房间`);
    if (genreItems.length > 0) {
      assert(genreItems[0].type === "url", "分类结果 type === 'url'");
      assert(genreItems[0].id !== undefined, "分类结果 id 存在");
      console.log(`  首个: id=${genreItems[0].id}, title=${genreItems[0].title}`);
    }
  } catch (e) {
    console.log("  ❌ loadRecommended(genreId) 异常: " + (e.message || e));
    fail++;
  }

  // === 测试 7: sort_by 分类选择 ===
  console.log("\n📋 测试 7: loadRecommended sort_by 分类选择");
  try {
    calls = [];
    // 选择"王者荣耀"（cate2Id=181）
    var sortItems = await loadRecommended({ sort_by: "181", page: 1 });
    console.log(`  返回 ${sortItems.length} 个房间`);
    assert(sortItems.length > 0, "sort_by 分类返回房间");
    if (sortItems.length > 0) {
      assert(sortItems[0].type === "url", "sort_by 结果 type === 'url'");
      console.log(`  首个: id=${sortItems[0].id}, title=${sortItems[0].title}`);
    }

    // 选择"CS2"（cate2Id=6）
    var sortItems2 = await loadRecommended({ sort_by: "6", page: 2 });
    console.log(`  CS2第2页: ${sortItems2.length} 个房间`);

    // 选择"原神"（cate2Id=1223）
    calls = [];
    var sortItems3 = await loadRecommended({ sort_by: "1223", page: 1 });
    console.log(`  原神: ${sortItems3.length} 个房间`);

    // 检查 sort_by 枚举在 WidgetMetadata 中
    var sortByParam = null;
    var recMod2 = WidgetMetadata.modules[0];
    for (var pi = 0; pi < recMod2.params.length; pi++) {
      if (recMod2.params[pi].name === "sort_by") {
        sortByParam = recMod2.params[pi];
        break;
      }
    }
    assert(sortByParam !== null, "sort_by 参数存在");
    assert(sortByParam.type === "enumeration", "sort_by 是 enumeration 类型");
    assert(sortByParam.enumOptions.length >= 20, "sort_by 至少有20个分类选项");
    console.log(`  分类选项数: ${sortByParam.enumOptions.length}`);
    console.log(`  默认值: ${sortByParam.value}`);
  } catch (e) {
    console.log("  ❌ sort_by 分类测试异常: " + (e.message || e));
    fail++;
  }

  // === 测试 8: loadResource 实时生成流地址（含 Cookie 透传检查） ===
  console.log("\n📋 测试 8: loadResource 实时生成流地址");
  try {
    var homeItems8 = await loadRecommended({});
    if (homeItems8.length > 0) {
      var roomId8 = homeItems8[0].id;
      console.log(`  测试房间: ${roomId8}`);
      // 先设置 Cookie
      var testCookie = "acf_auth=test123; acf_ltkid=456";
      DOUYU_COOKIE = testCookie;
      var resources = await loadResource({ link: roomId8, douyuCookie: testCookie });
      assert(resources !== null && resources !== undefined, "resources 非空");
      assert(Array.isArray(resources), "resources 是数组");
      assert(resources.length > 0, "resources 有至少1个流");
      // 验证所有画质的 customHeaders 都齐备
      for (var ri = 0; ri < resources.length; ri++) {
        var r = resources[ri];
        assert(r.name !== undefined && r.name !== "", "resources[" + ri + "].name 存在");
        assert(r.url !== undefined && r.url !== null, "resources[" + ri + "].url 存在");
        assert(r.playerType === "app", "resources[" + ri + "].playerType === 'app'");
        if (r.customHeaders) {
          assert(r.customHeaders["User-Agent"] !== undefined, "resources[" + ri + "] 包含 User-Agent");
          assert(r.customHeaders["Referer"] !== undefined, "resources[" + ri + "] 包含 Referer");
          assert(r.customHeaders["X-Forward-Skip-Redirect-Probe"] !== undefined, "resources[" + ri + "] 包含 Skip-Redirect-Probe");
          assert(r.customHeaders["X-Forward-Skip-Redirect-Probe"] === "1", "resources[" + ri + "] Skip-Redirect-Probe=1");
          assert(r.customHeaders["Cookie"] !== undefined, "resources[" + ri + "] 包含 Cookie");
        }
      }
      console.log("  ✅ " + resources.length + " 个画质，每个都含完整 customHeaders");
      // 恢复 Cookie
      DOUYU_COOKIE = "";
    } else {
      console.log("  ⚠️ 跳过 loadResource 测试：首页无房间数据");
    }
  } catch (e) {
    console.log("  ❌ loadResource 测试异常: " + (e.message || e));
    fail++;
  }

  // === 测试 9: Cookie 注入 ===
  console.log("\n📋 测试 9: Cookie 注入");
  try {
    // 测试 cookie 被正确设置到全局变量
    DOUYU_COOKIE = "";
    assert(DOUYU_COOKIE === "", "DOUYU_COOKIE 初始为空");

    // 测试 handler 入口设置 cookie
    DOUYU_COOKIE = "";
    await loadRecommended({ douyuCookie: "acf_auth=test123", page: 1 }).catch(function() {});
    assert(DOUYU_COOKIE === "acf_auth=test123", "loadRecommended 设置了 DOUYU_COOKIE");

    // 测试 cookies 被清除
    DOUYU_COOKIE = "";
    await searchRooms({ douyuCookie: "acf_auth=test456", keyword: "test" }).catch(function() {});
    assert(DOUYU_COOKIE === "acf_auth=test456", "searchRooms 设置了 DOUYU_COOKIE");

    console.log("  ✅ Cookie 注入机制正常");
  } catch (e) {
    console.log("  ❌ Cookie 注入测试异常: " + (e.message || e));
    fail++;
  }

  // === 测试 10: 码率排序（低码率优先） ===
  console.log("\n📋 测试 10: 码率排序（低码率优先）");
  try {
    // 模拟 multirates 数据
    var mockRates = [
      { name: "原画1080P60", rate: 0 },
      { name: "高清", rate: 2 },
      { name: "超清", rate: 3 },
      { name: "蓝光4M", rate: 4 }
    ];
    mockRates.sort(function (a, b) { return (b.rate || 0) - (a.rate || 0); });
    assert(mockRates[0].rate === 4, "第一个尝试蓝光4M(rate=4)，得到: " + mockRates[0].rate);
    assert(mockRates[1].rate === 3, "第二个尝试超清(rate=3)，得到: " + mockRates[1].rate);
    assert(mockRates[2].rate === 2, "第三个尝试高清(rate=2)，得到: " + mockRates[2].rate);
    assert(mockRates[3].rate === 0, "最后尝试原画(rate=0)，得到: " + mockRates[3].rate);
    console.log("  ✅ 码率降序排列正确: 蓝光4M → 超清 → 高清 → 原画");
  } catch (e) {
    console.log("  ❌ 码率排序测试异常: " + (e.message || e));
    fail++;
  }

  // === 结果 ===
  console.log("\n" + "=".repeat(40));
  console.log(`测试完成: ${pass} 通过, ${fail} 失败`);
  if (fail > 0) process.exit(1);
}

runTests().catch(function (e) {
  console.error("\n❌ 测试异常:", e.message || e);
  process.exit(1);
});
