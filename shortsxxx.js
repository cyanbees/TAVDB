// ============================================================
//  Shorts.xxx — 短视频列表、详情与搜索模块
//  源站: https://www.shorts.xxx
//  静态 HTML，从 gallery 中提取视频数据
// ============================================================

WidgetMetadata = {
  id: "forward.shortsxxx",
  title: "Shorts.xxx",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Shorts.xxx — 短视频聚合",
  author: "EL",
  site: "https://www.shorts.xxx",
  detailCacheDuration: 60,
  modules: [
    {
      id: "trending",
      title: "推荐",
      functionName: "loadTrending",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "newest",
      title: "最新",
      functionName: "loadNewest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "popular",
      title: "热门",
      functionName: "loadPopular",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "bestRated",
      title: "最高评分",
      functionName: "loadBestRated",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "random",
      title: "随机",
      functionName: "loadRandom",
      cacheDuration: 0,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseTag",
      title: "标签",
      functionName: "loadTagVideos",
      cacheDuration: 300,
      params: [
        {
          name: "tag",
          title: "选择标签",
          type: "enumeration",
          value: "asian",
          enumOptions: [
            { title: "18 Years Old", value: "18+years+old" },
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Asian", value: "asian" },
            { title: "Ass", value: "ass" },
            { title: "Babe", value: "babe" },
            { title: "BBC", value: "bbc" },
            { title: "BBW", value: "bbw" },
            { title: "Big Ass", value: "big+ass" },
            { title: "Big Dick", value: "big+dick" },
            { title: "Big Tits", value: "big+tits" },
            { title: "Blonde", value: "blonde" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Boobs", value: "boobs" },
            { title: "Brunette", value: "brunette" },
            { title: "College", value: "college" },
            { title: "Cowgirl", value: "cowgirl" },
            { title: "Creampie", value: "creampie" },
            { title: "Cumshot", value: "cumshot" },
            { title: "Deepthroat", value: "deepthroat" },
            { title: "Doggystyle", value: "doggystyle" },
            { title: "Ebony", value: "ebony" },
            { title: "Facial", value: "facial" },
            { title: "Goth", value: "goth" },
            { title: "Homemade", value: "homemade" },
            { title: "Latina", value: "latina" },
            { title: "MILF", value: "milf" },
            { title: "Natural Tits", value: "natural+tits" },
            { title: "OnlyFans", value: "onlyfans" },
            { title: "Petite", value: "petite" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Redhead", value: "redhead" },
            { title: "Small Tits", value: "small+tits" },
            { title: "Squirt", value: "squirt" },
            { title: "Teen", value: "teen" },
            { title: "Thick", value: "thick" },
            { title: "TikTok", value: "tiktok" },
            { title: "Tattoo", value: "tattoo" },
            { title: "Wet Pussy", value: "wet+pussy" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE_URL = "https://www.shorts.xxx";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": BASE_URL + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error(`请求失败: ${url}`);
  return resp.data;
}

/**
 * 从 HTML 中提取所有视频项
 */
function parseVideos(html) {
  if (!html) return [];

  const items = [];
  const allBoxes = html.match(/<div\s+class="box"\s+id="[^"]+"[\s\S]*?<\/div>(?=\s*<div\s+class="box"\s+id=|\s*<div\s+class="closegallery|\s*<div\s+class="gallery|\s*$)/g);
  if (!allBoxes) return [];

  for (const boxHtml of allBoxes) {
    const creatorMatch = boxHtml.match(/data-creator="([^"]*)"/);
    const likesMatch = boxHtml.match(/data-likes="(\d+)"/);
    const idMatch = boxHtml.match(/data-id="(\d+)"/);
    const creator = creatorMatch ? creatorMatch[1] : "";
    const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
    const id = idMatch ? idMatch[1] : "";
    if (!id) continue;

    const titleMatch = boxHtml.match(/<div\s+class="title"[^>]*>([\s\S]*?)<\/div>/);
    const title = titleMatch ? titleMatch[1].trim().substring(0, 120) : `Video ${id}`;

    const srcMatch = boxHtml.match(/<source\s+src="([^"]+)"/);
    const videoPath = srcMatch ? srcMatch[1] : "";
    const videoUrl = videoPath ? (videoPath.startsWith("http") ? videoPath : BASE_URL + videoPath) : "";

    const posterMatch = boxHtml.match(/poster="([^"]+)"/);
    const thumb = posterMatch ? posterMatch[1] : "";

    items.push({
      id: id,
      type: "url",
      mediaType: "movie",
      title: title,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      videoUrl: videoUrl,
      link: id,
      peoples: creator ? [{ id: creator.toLowerCase(), title: creator }] : undefined,
      rating: Math.min(10, Math.round(likes / 200)),
      headers: { "Referer": BASE_URL + "/" }
    });
  }

  return items;
}

// ============================================================
//  loadTrending / loadNewest / loadPopular / loadBestRated / loadRandom
// ============================================================
async function loadTrending(params) { return loadPage("/", params); }
async function loadNewest(params)   { return loadPage("/newest/", params); }
async function loadPopular(params)  { return loadPage("/popular/", params); }
async function loadBestRated(params){ return loadPage("/best/", params); }
async function loadRandom(params)   { return loadPage("/random/", params); }

/**
 * 通用分页加载
 */
async function loadPage(path, params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);

    // 该站不支持服务端分页，每页固定返回相同数据
    const html = await fetchPage(BASE_URL + path);
    const items = parseVideos(html);

    if (page > 1) return [];
    return items;
  } catch (error) {
    console.error("[Shorts.xxx loadPage] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadTagVideos — 按标签浏览
// ============================================================
async function loadTagVideos(params = {}) {
  try {
    if (params.genreId) params.tag = params.genreId;
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const tag = (params.tag || "asian").trim();
    const page = Math.max(1, Number(params.page) || 1);

    // 该站服务端不支持分页，标签/搜索固定返回约 30 条
    const html = await fetchPage(`${BASE_URL}/?search=${encodeURIComponent(tag)}`);
    const items = parseVideos(html);

    // 只在第一页返回结果
    if (page > 1) return [];
    return items;
  } catch (error) {
    console.error("[Shorts.xxx loadTagVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    // 当从详情页点演员导航回来时，接收 peopleId
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);

    // 该站搜索不支持分页，每页固定返回相同数据
    const html = await fetchPage(`${BASE_URL}/?search=${encodeURIComponent(keyword)}`);
    const items = parseVideos(html);

    if (page > 1) return [];
    return items;
  } catch (error) {
    console.error("[Shorts.xxx searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
//  列表项已含完整数据，详情做增强补充
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  // 逐个页面查找视频（首页 → 最新 → 热门 → 评分 → 随机，覆盖不同栏目）
  const searchPaths = ["/", "/newest/", "/popular/", "/best/", "/random/"];
  let allVideos = [];

  for (const path of searchPaths) {
    try {
      const html = await fetchPage(BASE_URL + path);
      allVideos = parseVideos(html);
      const found = allVideos.find(v => v.id === link);
      if (found) {
        return enrichDetail(found, allVideos);
      }
    } catch (e) {
      // 某个页面失败不影响继续查找
    }
  }

  // 所有页面都没找到，返回基础结构
  return {
    id: link, type: "url", mediaType: "movie",
    title: `Video ${link}`, link: link,
    backdropPaths: [],
    trailers: [],
    relatedItems: [],
    headers: { "Referer": BASE_URL + "/" }
  };
}

/**
 * 为视频项补充剧照/预告片/相关推荐
 */
function enrichDetail(video, allVideos) {
  const backdropPaths = video.coverUrl ? [video.coverUrl] : [];
  const trailers = video.videoUrl ? [{ url: video.videoUrl, coverUrl: video.coverUrl || "" }] : [];
  const relatedItems = allVideos
    .filter(v => v.id !== video.id)
    .slice(0, 10)
    .map(v => {
      const r = { ...v };
      delete r.videoUrl;
      delete r.trailers;
      return r;
    });

  return {
    ...video,
    backdropPaths: backdropPaths,
    trailers: trailers,
    relatedItems: relatedItems.length > 0 ? relatedItems : undefined,
  };
}
