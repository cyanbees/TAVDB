// ============================================================
//  AVToday — 视频列表、详情与搜索模块
//  源站: https://avtoday.io
//  HTML 解析
// ============================================================

WidgetMetadata = {
  id: "forward.avtoday",
  title: "AVToday",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "AVToday 视频模块 — 热门、无码、搜索",
  author: "EL",
  site: "https://avtoday.io",
  detailCacheDuration: 60,
  modules: [
    {
      id: "hot",
      title: "热门",
      functionName: "loadHot",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "noMosaic",
      title: "无码",
      functionName: "loadNoMosaic",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchAvtoday",
      title: "搜索 AVToday",
      functionName: "searchVideos",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
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
const BASE = "https://avtoday.io";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, {
    headers: { "User-Agent": UA }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

function absUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BASE + url;
  return BASE + "/" + url;
}

function parseListHtml(html) {
  const items = [];
  const blocks = html.split('<div class="thumbnail col">');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.indexOf("[廣告]") >= 0) continue;

    const link = getText(block, /<a[^>]*href="(\/[^"]+\.html)"[^>]*>/);
    if (!link) continue;

    const title = getText(block, /<div class="video-title[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const coverMatch = block.match(/background:\s*url\('([^']+)'/);
    const cover = coverMatch ? absUrl(coverMatch[1]) : "";
    const duration = getText(block, /<span class="video-duration">\s*([^<]+)\s*<\/span>/);
    const pubdate = getText(block, /<div class="video-date[^>]*>([^<]+)<\/div>/);

    items.push({
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      durationText: duration ? duration.trim() : "",
      releaseDate: pubdate || ""
    });
  }
  return items;
}

// ============================================================
//  loadHot — 热门
// ============================================================
async function loadHot(params) {
  try {
    if (params.genreId) return loadCategory({ category: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/chs/hot.html" + (page > 1 ? "?page=" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[AVToday loadHot] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadNoMosaic — 无码
// ============================================================
async function loadNoMosaic(params) {
  try {
    if (params.genreId) return loadCategory({ category: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/chs/no-mosaic.html" + (page > 1 ? "?page=" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[AVToday loadNoMosaic] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/search?s=" + encodeURIComponent(keyword) + "&page=" + page;
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[AVToday searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const html = await fetchPage(BASE + link);

    const title = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/) ||
                  getText(html, /<title>([^<]+)<\/title>/);
    let thumb = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (thumb) thumb = absUrl(thumb);

    const codeMatch = link.match(/\/([^/]+)\.html$/);
    const code = codeMatch ? codeMatch[1] : "";

    let videoUrl = "";
    if (code) {
      try {
        const playerResp = await Widget.http.get(BASE + "/player?s=" + encodeURIComponent(code), {
          headers: { "User-Agent": UA, "Referer": BASE + "/" }
        });
        if (playerResp && playerResp.data) {
          const playerHtml = typeof playerResp.data === "string" ? playerResp.data : String(playerResp.data);
          videoUrl = getText(playerHtml, /var m3u8_url\s*=\s*'([^']+)'/);
        }
      } catch (e) {
        console.error("[AVToday loadDetail] player 获取失败:", e.message || e);
      }
    }

    const backdropPaths = thumb ? [thumb] : [];
    const trailers = [];
    if (videoUrl) {
      trailers.push({ url: videoUrl, coverUrl: thumb });
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      customHeaders: {
        "Referer": "https://avtoday.io/",
        "User-Agent": UA
      },
      backdropPaths: backdropPaths,
      trailers: trailers
    };
  } catch (error) {
    console.error("[AVToday loadDetail] 失败:", error.message || error);
    throw error;
  }
}
