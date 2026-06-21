#!/usr/bin/env node
/**
 * 豆瓣豆列构建脚本
 * 抓取20个内置恐怖片豆列 → 解析 → 去重 → 输出 JSON
 *
 * 用法: node data/build.js
 * 输出: data/doulist_index.json + data/doulist_{id}.json
 */

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// ─── 20个内置豆列 ───
const DOULISTS = {
  "1652843":   { title: "Time Out影史百大恐怖片" },
  "36980":     { title: "看电影40部最经典恐怖片" },
  "36280":     { title: "恐惧感的丧失(309部)" },
  "37140418":  { title: "难忘的经典惊悚/恐怖片(547部)" },
  "526461":    { title: "7分以上的恐怖/惊悚电影(174部)" },
  "5916567":   { title: "高分精品恐怖片(280部)" },
  "3356598":   { title: "2000后优秀恐怖电影(204部)" },
  "724565":    { title: "被忽略掉的不沉闷恐怖劲片！(77部)" },
  "152540212": { title: "Indiewire: 50位导演心中的最佳恐怖片(48部)" },
  "109801736": { title: "稀有难找 underground horror films(466部)" },
  "159889980": { title: "血浆片已阅整理 Gory Horror Film(47部)" },
  "124549602": { title: "女性导演恐怖片(383部)" },
  "162107956": { title: "Body Horror｜身体恐怖电影(155部)" },
  "161922461": { title: "瘆临其境！恐怖伪纪录片(193部)" },
  "163019144": { title: "码住！盘点欧美高分恐怖电影(585部)" },
  "163048555": { title: "怪力乱神！欧美超自然恐怖电影(206部)" },
  "159035683": { title: "审美与创意兼顾的恐怖片(96部)" },
  "148836450": { title: "我看过的恐怖片们(254部)" },
  "45782339":  { title: "我的恐怖片之旅(1534部)" },
  "163145526": { title: "码住！2026年恐怖电影大盘点(304部)" },
};

const DATA_DIR = __dirname;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REQUEST_DELAY_MS = 1500; // 1.5s 间隔防封

// ─── 工具函数 ───

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Referer": "https://movie.douban.com/",
    },
    signal: AbortSignal.timeout(15000),
  });
  const html = await res.text();
  return cheerio.load(html);
}

/**
 * 解析一页豆列（25条），返回条目数组
 */
function parsePage($) {
  const items = [];
  const seen = new Set();

  // 策略1：标准 doulist-item（豆列页面）
  $(".doulist-item").each((i, el) => {
    const $item = $(el);
    const $link = $item.find(".title a");
    const href = $link.attr("href");
    if (!href) return;

    const match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
    if (!match) return;

    const id = Number(match[1]);
    if (seen.has(id)) return;
    seen.add(id);

    const title = $link.text().trim();
    const posterPath = $item.find(".post img").attr("src") || "";
    const ratingText = $item.find(".rating_nums").text().trim();

    // 尝试从评语或描述中提取年份
    let year = 0;
    const infoText = $item.text();
    const yearMatch = infoText.match(/年份:\s*(\d{4})/);
    if (yearMatch) year = parseInt(yearMatch[1], 10);

    items.push({
      doubanId: id,
      title: title || "",
      posterPath: posterPath,
      rating: ratingText ? parseFloat(ratingText) : 0,
      year: year,
    });
  });

  // 策略2：兜底 — 兼容非标准列表页
  if (items.length === 0) {
    $("a[href*='movie.douban.com/subject/']").each((i, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      const match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (!match) return;
      const id = Number(match[1]);
      if (seen.has(id)) return;
      seen.add(id);
      const title = $(el).text().trim();
      items.push({
        doubanId: id,
        title: title || "",
        posterPath: "",
        rating: 0,
        year: 0,
      });
    });
  }

  return items;
}

/**
 * 抓取单个豆列的所有页面
 */
async function fetchDoulist(doulistId, doulistTitle) {
  console.log(`[${doulistTitle}] 开始抓取...`);

  const allItems = [];
  const seenGlobal = new Set();
  let page = 0;
  let emptyPages = 0;

  while (true) {
    const start = page * 25;
    const url = `https://www.douban.com/doulist/${doulistId}/?start=${start}`;

    console.log(`  → 第 ${page + 1} 页 (start=${start})`);

    try {
      const $ = await fetchPage(url);
      const items = parsePage($);

      if (items.length === 0) {
        emptyPages++;
        if (emptyPages >= 2) break; // 连续2页空则停止
      } else {
        emptyPages = 0;
      }

      // 去重（跨页）
      for (const item of items) {
        if (!seenGlobal.has(item.doubanId)) {
          seenGlobal.add(item.doubanId);
          allItems.push(item);
        }
      }

      // 检查是否有下一页
      const hasNext = $('link[rel="next"]').length > 0 || $(".next a").length > 0;
      if (!hasNext && items.length < 25) break;

    } catch (err) {
      console.error(`  ✗ 第 ${page + 1} 页失败:`, err.message || err);
      emptyPages++;
      if (emptyPages >= 3) break;
    }

    page++;
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`  ✓ 完成，共 ${allItems.length} 条`);
  return allItems;
}

// ─── 主流程 ───

async function main() {
  console.log("═══════════════════════════════");
  console.log("  豆瓣豆列构建工具 v1.0");
  console.log(`  共 ${Object.keys(DOULISTS).length} 个豆列`);
  console.log("═══════════════════════════════\n");

  const allMoviesMap = new Map(); // doubanId → item（全局去重）
  const perDoulistResults = {};

  for (const [id, meta] of Object.entries(DOULISTS)) {
    const items = await fetchDoulist(id, meta.title);
    perDoulistResults[id] = items;

    for (const item of items) {
      if (!allMoviesMap.has(item.doubanId)) {
        allMoviesMap.set(item.doubanId, item);
      }
    }

    // 写入单个豆列文件
    const outFile = path.join(DATA_DIR, `doulist_${id}.json`);
    fs.writeFileSync(outFile, JSON.stringify({
      doulistId: id,
      title: meta.title,
      count: items.length,
      items: items,
    }, null, 2), "utf8");
    console.log(`  → 已写入: doulist_${id}.json\n`);
  }

  // ─── 写入索引文件 ───
  const indexData = {
    version: "1.0",
    updatedAt: new Date().toISOString(),
    totalUnique: allMoviesMap.size,
    doulists: Object.entries(DOULISTS).map(([id, meta]) => ({
      id: id,
      title: meta.title,
      count: perDoulistResults[id] ? perDoulistResults[id].length : 0,
      file: `doulist_${id}.json`,
    })),
  };

  const indexFile = path.join(DATA_DIR, "doulist_index.json");
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf8");
  console.log(`→ 已写入: doulist_index.json`);

  // ─── 写入全量去重表（方便后续增量更新） ───
  const allMovies = Array.from(allMoviesMap.values());
  const moviesFile = path.join(DATA_DIR, "movies.json");
  fs.writeFileSync(moviesFile, JSON.stringify({
    version: "1.0",
    updatedAt: new Date().toISOString(),
    count: allMovies.length,
    movies: allMovies,
  }, null, 2), "utf8");
  console.log(`→ 已写入: movies.json (去重后共 ${allMovies.length} 部)`);

  console.log("\n═══════════════════════════════");
  console.log("  构建完成!");
  console.log(`  豆列文件: ${Object.keys(DOULISTS).length} 个`);
  console.log(`  去重影片: ${allMovies.length} 部`);
  console.log("═══════════════════════════════");
}

main().catch(err => {
  console.error("\n构建失败:", err);
  process.exit(1);
});
