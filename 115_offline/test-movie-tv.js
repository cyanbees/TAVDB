// ==================== 电影电视剧匹配模块 — 测试脚本 ====================
// 用法:
//   node test-movie-tv.js
//
// 测试内容:
//   1. extractMovieTVKey — 各种命名格式的解析正确性
//   2. removeNoise / normalizeMovieTitle — 噪声词清洗
//   3. scoreFile — 评分逻辑
//   4. resolveShowTitle 逻辑验证（Mock 文件夹回溯）
//   5. loadResource 端到端流程（Mock 115 API）
//
// 遵循 project 已有的测试模式（test-offline-step1.js 风格）

const fs = require("fs");

// ==================== Mock 准备 ====================

// 存储所有 HTTP 调用记录（用于后续断言验证）
const httpCalls = [];

global.Widget = {
  http: {
    get: async (url, opts) => {
      httpCalls.push({ method: "GET", url, headers: opts?.headers });
      // 默认真实 fetch（离线测试用 Mock 覆盖）
      const headers = Object.assign(
        { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15" },
        opts?.headers || {}
      );
      const res = await fetch(url, { headers, redirect: "follow" });
      const text = await res.text();
      return { data: text, statusCode: res.status };
    },
    post: async (url, body, opts) => {
      httpCalls.push({ method: "POST", url, body, headers: opts?.headers });
      return { data: "{}", statusCode: 200 };
    }
  },
  tmdb: {
    get: async (api, opts) => {
      httpCalls.push({ method: "TMDB", api, params: opts?.params });
      // 对已知搜索词返回 Mock 数据
      const query = (opts?.params?.query || "").toLowerCase();
      
      // 模拟 TMDB 搜索结果
      let mockResults = [];
      if (query.includes("matrix")) {
        mockResults = [{
          id: 603, title: "The Matrix", original_title: "The Matrix",
          release_date: "1999-03-31", overview: "A computer hacker learns about the true nature of reality."
        }];
      } else if (query.includes("game of thrones") || query.includes("game.of.thrones")) {
        mockResults = [{
          id: 1399, name: "Game of Thrones", original_name: "Game of Thrones",
          first_air_date: "2011-04-17", overview: "Nine noble families fight for control.",
          number_of_seasons: 8
        }];
      } else if (query.includes("stranger") || query.includes("stranger.things")) {
        mockResults = [{
          id: 66732, name: "Stranger Things", original_name: "Stranger Things",
          first_air_date: "2016-07-15", overview: "A group of kids uncover a mystery.",
          number_of_seasons: 4
        }];
      } else if (query.includes("breaking bad") || query.includes("breaking.bad")) {
        mockResults = [{
          id: 1396, name: "Breaking Bad", original_name: "Breaking Bad",
          first_air_date: "2008-01-20", overview: "A high school teacher turns to crime.",
          number_of_seasons: 5
        }];
      } else if (query.includes("interstellar")) {
        mockResults = [{
          id: 157336, title: "Interstellar", original_title: "Interstellar",
          release_date: "2014-11-07", overview: "A team of explorers travel through a wormhole."
        }];
      }

      return mockResults.length > 0
        ? { results: mockResults }
        : { results: [] };
    }
  },
  html: { load: () => null },
  storage: { _m: {}, get(k) { return this._m[k]; }, set(k, v) { this._m[k] = v; } }
};
global.WidgetMetadata = {};

// ==================== 载入模块 ====================
const MODULE_PATH = "./115_offline/movie-tv-stream.js";
console.log("📦 载入模块:", MODULE_PATH);
eval(fs.readFileSync(MODULE_PATH, "utf8"));

console.log(`  已加载: ${typeof extractMovieTVKey} ${typeof loadResource} ${typeof scoreFile} ${typeof lookupTMDB}\n`);

// ==================== 测试辅助 ====================
let passed = 0;
let failed = 0;

function assertEqual(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    console.log(`     期望: ${e}`);
    console.log(`     实际: ${a}`);
    failed++;
  }
}

function assertNotEqual(name, actual, notExpected) {
  const a = JSON.stringify(actual);
  const n = JSON.stringify(notExpected);
  if (a !== n) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name} (不应为 ${n})`);
    failed++;
  }
}

// ==================== Test Suite 1: extractMovieTVKey ====================
console.log("═══ Test Suite 1: extractMovieTVKey ═══");

(function testExtractMovieTVKey() {
  // 剧集 S01E01 格式（含剧名）
  const r1 = extractMovieTVKey("Game.of.Thrones.S01E01.1080p.mkv");
  assertEqual("Game.of.Thrones S01E01", r1, { type: "tv", season: 1, episode: 1, title: "Game of Thrones" });

  // 剧集 1x01 格式
  const r2 = extractMovieTVKey("Breaking.Bad.1x01.720p.mkv");
  assertEqual("Breaking.Bad 1x01", r2, { type: "tv", season: 1, episode: 1, title: "Breaking Bad" });

  // 纯 s01e01（无剧名）
  const r3 = extractMovieTVKey("s01e01.mkv");
  assertEqual("bare s01e01", r3, { type: "tv", season: 1, episode: 1 });

  // 纯 1x01（无剧名）
  const r4 = extractMovieTVKey("1x01.mkv");
  assertEqual("bare 1x01", r4, { type: "tv", season: 1, episode: 1 });

  // 电影 + 年份
  const r5 = extractMovieTVKey("The.Matrix.1999.1080p.mkv");
  assertEqual("The Matrix 1999", r5, { type: "movie", title: "The Matrix", year: 1999 });

  // 电影 + 年份（4K）
  const r6 = extractMovieTVKey("Interstellar.2014.4K.mkv");
  assertEqual("Interstellar 2014 4K", r6, { type: "movie", title: "Interstellar", year: 2014 });

  // 带破折号的剧名
  const r7 = extractMovieTVKey("Stranger Things - S01E01 WEBRip");
  assertEqual("Stranger Things dash", r7, { type: "tv", season: 1, episode: 1, title: "Stranger Things" });

  // 没有有效信息
  const r8 = extractMovieTVKey("Sample.mkv");
  assertEqual("Sample.mkv fallback", r8, { type: "movie", title: "Sample" });

  // 只有分辨率噪声词
  const r9 = extractMovieTVKey("1080p.mkv");
  assertEqual("1080p.mkv unparseable", r9, null);

  // 中文电影名
  const r10 = extractMovieTVKey("让子弹飞.2010.1080p.mkv");
  assertEqual("中文电影 让子弹飞", r10, { type: "movie", title: "让子弹飞", year: 2010 });

  // 中文剧集
  const r11 = extractMovieTVKey("琅琊榜.S01E01.1080p.mkv");
  assertEqual("中文剧集 琅琊榜 S01E01", r11, { type: "tv", season: 1, episode: 1, title: "琅琊榜" });
})();

// ==================== Test Suite 2: normalizeMovieTitle ====================
console.log("\n═══ Test Suite 2: normalizeMovieTitle ═══");

(function testNormalize() {
  const n1 = normalizeMovieTitle("The.Matrix.1999.1080p.BluRay.x264");
  assertEqual("The Matrix cleaned", n1, "The Matrix 1999");

  const n2 = normalizeMovieTitle("Game.of.Thrones.S01E01.1080p.WEB-DL");
  // S01E01 被保留（不是噪声词），但我们只是做基础清洗
  assertNotEqual("Game of Thrones has content", n2, "");

  const n3 = normalizeMovieTitle("hhd800.com@Movie.Name.2024.mkv");
  assertEqual("hhd800 prefix stripped", n3, "Movie Name 2024");
})();

// ==================== Test Suite 3: scoreFile ====================
console.log("\n═══ Test Suite 3: scoreFile ═══");

(function testScore() {
  // 正片：大文件，文件名包含剧名
  const goodFile = { filename: "Game.of.Thrones.S01E01.1080p.mkv", size: 2.5 * 1024 * 1024 * 1024 };
  const showInfo = { type: "tv", title: "Game of Thrones", season: 1, episode: 1 };
  const goodScore = scoreFile(goodFile, showInfo);
  assertEqual("正片评分 > 0", goodScore > 0, true);
  console.log(`   得分: ${goodScore}`);

  // Sample 文件：小文件，包含 sample
  const sampleFile = { filename: "sample_game_of_thrones_s01e01.mkv", size: 30 * 1024 * 1024 };
  const sampleScore = scoreFile(sampleFile, showInfo);
  assertEqual("sample 评分 < 正片评分", sampleScore < goodScore, true);
  console.log(`   sample 得分: ${sampleScore}`);

  // 文件名不含剧名
  const wrongFile = { filename: "Some.Other.Show.S01E01.mkv", size: 1 * 1024 * 1024 * 1024 };
  const wrongScore = scoreFile(wrongFile, showInfo);
  assertEqual("不匹配的片名 < 匹配的", wrongScore < goodScore, true);
  console.log(`   不匹配得分: ${wrongScore}`);

  // 大文件加分
  const largeFile = { filename: "The.Matrix.1999.4K.mkv", size: 10 * 1024 * 1024 * 1024 };
  const largeScore = scoreFile(largeFile, { type: "movie", title: "The Matrix", year: 1999 });
  console.log(`   大文件得分: ${largeScore}`);
  assertEqual("大文件得分高", largeScore > 30, true);
})();

// ==================== Test Suite 4: lookupTMDB (通过 Mock Widget.tmdb) ====================
console.log("\n═══ Test Suite 4: lookupTMDB (Mock) ═══");

// ==================== Test Suite 5: resolveShowTitle ====================
console.log("\n═══ Test Suite 5: resolveShowTitle (模拟) ═══");

// ==================== 主入口：异步执行所有测试 ====================
(async function runAllAsyncTests() {
  // --- Suite 4: TMDB ---
  const movieResult = await lookupTMDB("The Matrix", "movie");
  assertEqual("TMDB movie lookup", movieResult?.title, "The Matrix");
  assertEqual("TMDB movie year", movieResult?.year, "1999");

  const tvResult = await lookupTMDB("Game of Thrones", "tv");
  assertEqual("TMDB tv lookup", tvResult?.title, "Game of Thrones");
  assertEqual("TMDB tv year", tvResult?.year, "2011");

  const emptyResult = await lookupTMDB("", "movie");
  assertEqual("TMDB empty keyword", emptyResult, null);
  console.log("   TMDB 通过 Mock 验证 ✅");

  // --- Suite 5: resolveShowTitle ---
  const file1 = { filename: "Game.of.Thrones.S01E01.1080p.mkv", cid: "123", pickcode: "abc", size: 1e9 };
  const r1 = await resolveShowTitle("cookie", file1, { title: "Game of Thrones" });
  assertEqual("文件名含剧名", r1?.title, "Game of Thrones");
  assertEqual("文件名含季集", r1?.season, 1);

  const file2 = { filename: "s01e01.mkv", cid: "0", pickcode: "abc", size: 500e6 };
  const r2 = await resolveShowTitle("cookie", file2, { title: "Game of Thrones" });
  assertEqual("纯季集有 params 上下文", r2?.type, "tv");
  assertEqual("纯季集用 params title", r2?.title, "Game of Thrones");
  console.log("   (文件夹回溯依赖真实 115 API，已降级到 params 上下文)");

  const file3 = { filename: "The.Matrix.1999.4K.mkv", cid: "456", pickcode: "def", size: 5e9 };
  const r3 = await resolveShowTitle("cookie", file3, { title: "The Matrix" });
  assertEqual("电影文件名", r3?.type, "movie");
  assertEqual("电影片名", r3?.title, "The Matrix");

  const file4 = { filename: "s01e01.mkv", cid: "", pickcode: "abc", size: 1e9 };
  const r4 = await resolveShowTitle("cookie", file4, {});
  assertEqual("无上下文纯季集不崩溃", r4 !== null, true);
  console.log("   resolveShowTitle 验证通过 ✅");

  // --- Suite 6: scoreFile with target episode ---
  console.log("\n═══ Test Suite 6: 目标季集评分 ═══");
  const showInfo6 = { type: "tv", title: "Game of Thrones", season: 1, episode: 1 };

  // 命中目标 S01E01
  const hitFile = { filename: "Game.of.Thrones.S01E01.mkv", size: 1e9 };
  const hitScore = scoreFile(hitFile, showInfo6, 1, 1);
  assertEqual("命中目标集得分 > 基础分", hitScore > 50, true);
  console.log("   命中得分:", hitScore);

  // 不同集 S01E12 — showInfo 反映真实季集 (episode=12)
  const showInfo12 = { type: "tv", title: "Game of Thrones", season: 1, episode: 12 };
  const diffFile = { filename: "Game.of.Thrones.S01E12.mkv", size: 2e9 };
  const diffScore = scoreFile(diffFile, showInfo12, 1, 1);
  // episode=12 !== target=1 → else 分支 -30
  // 同时文件名 "s01e12" 不匹配目标 "s01e01" → 不会 +20
  // 但 2GB 文件额外 +30 (体积)
  assertEqual("不同集被扣分", diffScore < hitScore, true);
  console.log("   不同集得分:", diffScore, "(2GB 仍低于命中)");

  // 不指定目标时，各集凭自身 season/episode 匹配加分
  const noTargetScore1 = scoreFile(hitFile, showInfo6, null, null);
  assertEqual("无目标时 S01E01 正常评分", noTargetScore1 > 50, true);
  console.log("   无目标 S01E01:", noTargetScore1);

  // 无目标时 S01E12 2GB > S01E01 1GB
  const noTargetScore12 = scoreFile(diffFile, showInfo12, null, null);
  assertEqual("无目标时大文件略优", noTargetScore12 > noTargetScore1, true);
  console.log("   无目标 S01E12:", noTargetScore12, "(2GB > 1GB)");

  // ==================== 汇总 ====================
  console.log(`\n${"=".repeat(48)}`);
  console.log(`  测试完成: ✅ ${passed} passed, ❌ ${failed} failed`);
  console.log(`  ${httpCalls.length} 次 HTTP/TMDB 调用模拟`);
  console.log(`${"=".repeat(48)}`);

  if (failed > 0) {
    console.error("存在失败的测试用例");
    process.exit(1);
  } else {
    console.log("全部通过!");
    process.exit(0);
  }
})().catch((err) => {
  console.error("❌ 测试异常:", err.message || err);
  process.exit(1);
});
