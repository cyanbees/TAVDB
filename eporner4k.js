// ============================================================
//  EPORNER 4K — 4K 超高清视频模块
//  源站: https://www.eporner.com/cat/4k-porn/
//  HTML + JSON-LD 数据
// ============================================================

WidgetMetadata = {
  id: "forward.eporner4k",
  title: "EPORNER 4K",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "EPORNER — 4K 超高清色情视频",
  author: "EL",
  site: "https://www.eporner.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新4K",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "weeklyTop",
      title: "本周热门",
      functionName: "loadWeeklyTop",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "monthlyTop",
      title: "月度热门",
      functionName: "loadMonthlyTop",
      cacheDuration: 300,
      params: [
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
const BASE_URL = "https://www.eporner.com";
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
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function decodeHtml(str) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&#x27;/g, "'");
}

/**
 * 从详情页 JSON-LD 获取缩略图
 */
function getThumbFromDetail(html) {
  const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (ldMatch) {
    try {
      const data = JSON.parse(ldMatch[1]);
      let videoData = null;
      if (Array.isArray(data)) {
        for (const d of data) {
          if (d["@type"] === "VideoObject") { videoData = d; break; }
        }
      } else if (data["@type"] === "VideoObject") {
        videoData = data;
      }
      if (videoData) {
        const thumb = videoData.thumbnailUrl;
        if (Array.isArray(thumb) && thumb.length > 0) return thumb[0];
        if (typeof thumb === "string") return thumb;
      }
    } catch (e) { /* JSON parse error */ }
  }
  return "";
}

/**
 * 从详情页提取视频 ID 和 hash，构造最高画质下载地址
 */
function getVideoUrlFromDetail(html, videoLink) {
  // 从链接提取 hash: /video-{hash}/...
  const hashMatch = videoLink.match(/\/video-([^/]+)\//);
  const hash = hashMatch ? hashMatch[1] : "";
  if (!hash) return "";

  // 从页面中提取所有下载链接，选最高画质
  const dloadRegex = /\/dload\/[^/]+\/(\d+)\/[^"]+-(\d+)p\.mp4/g;
  let best = 0;
  let bestUrl = "";
  let m;
  while ((m = dloadRegex.exec(html)) !== null) {
    const quality = parseInt(m[1]) || 0;
    // 排除 av1 编码（部分设备不兼容）
    const fullUrl = m[0];
    if (fullUrl.indexOf("-av1") !== -1) continue;
    if (quality > best) {
      best = quality;
      bestUrl = fullUrl;
    }
  }

  if (bestUrl) {
    return BASE_URL + bestUrl;
  }

  return "";
}

/**
 * 从 HTML 解析视频列表
 */
function parseVideoList(html) {
  const items = [];
  let searchStart = 0;

  while (true) {
    const start = html.indexOf('<div class="mb hdy"', searchStart);
    if (start === -1) break;

    // 找到完整 mb 容器结束位置
    const underIdx = html.indexOf('mbunder', start);
    if (underIdx === -1) break;
    // 从 mbunder 往后找第3个 </div> 作为结束
    let divEnd = underIdx;
    for (let i = 0; i < 3; i++) {
      divEnd = html.indexOf('</div>', divEnd + 6);
      if (divEnd === -1) break;
    }
    if (divEnd === -1) break;
    divEnd += 6;

    const block = html.substring(start, divEnd);
    searchStart = divEnd;

    // 提取 data-id
    const idMatch = block.match(/data-id="(\d+)"/);
    if (!idMatch) continue;
    const dataId = idMatch[1];

    // 提取视频链接和标题（从 mbtit 中的 a 标签文本）
    const linkMatch = block.match(/href="(\/video-[^"/]+[^"]*)"[^>]*>([^<]+)</);
    if (!linkMatch) continue;
    const link = linkMatch[1];
    const title = decodeHtml(linkMatch[2].trim()).substring(0, 120);

    // 提取缩略图
    const thumbMatch = block.match(/src="([^"]+)"\s+data-st=/);
    const thumb = thumbMatch ? thumbMatch[1] : "";

    // 提取画质
    const qualityMatch = block.match(/<span>(\d+K?\s*\(\d+p\)|\d+K?)/);
    const qualityText = qualityMatch ? qualityMatch[1].trim() : "";

    // 提取时长
    const durMatch = block.match(/mbtim[^>]*>([^<]+)</);
    const duration = durMatch ? durMatch[1].trim() : "";

    // 提取评分
    const rateMatch = block.match(/mbrate[^>]*>(\d+)%/);
    const rating = rateMatch ? parseInt(rateMatch[1]) / 10 : 0;

    // 提取观看数
    const viewsMatch = block.match(/mbvie[^>]*>([^<]+)</);
    const viewsText = viewsMatch ? viewsMatch[1].trim() : "";

    // 提取上传者
    const uploaderMatch = block.match(/mb-uploader[^>]*><a[^>]*>([^<]+)</);
    const uploader = uploaderMatch ? uploaderMatch[1].trim() : "";

    items.push({
      id: dataId,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      headers: { "Referer": BASE_URL + "/" },
      peoples: uploader ? [{ id: uploader.toLowerCase(), title: uploader }] : undefined,
      rating: rating,
      durationText: duration
    });
  }
  return items;
}

// ============================================================
//  模块函数
// ============================================================
async function loadLatest(params)     { return loadCatPage("", params); }
async function loadWeeklyTop(params)  { return loadCatPage("SORT-top-weekly", params); }
async function loadMonthlyTop(params) { return loadCatPage("SORT-top-monthly", params); }

async function loadCatPage(sortPath, params = {}) {
  try {
    if (params.genreId) return loadCatPage(sortPath, { ...params, genreId: undefined });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL + "/cat/4k-porn/";
    if (sortPath) url += sortPath + "/";
    if (page > 1) url += page + "/";
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[EPORNER 4K loadCatPage] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL + "/tag/" + encodeURIComponent(keyword) + "/";
    if (page > 1) url += page + "/";
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[EPORNER 4K searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const url = link.startsWith("http") ? link : BASE_URL + link;
    const html = await fetchPage(url);

    // 从 JSON-LD 提取标题和缩略图
    const thumb = getThumbFromDetail(html);

    // 标题（从 JSON-LD 或 h1 提取）
    let title = "未知标题";
    const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        const data = JSON.parse(ldMatch[1]);
        let videoData = null;
        if (Array.isArray(data)) {
          for (const d of data) {
            if (d["@type"] === "VideoObject") { videoData = d; break; }
          }
        } else if (data["@type"] === "VideoObject") {
          videoData = data;
        }
        if (videoData && videoData.name) title = videoData.name.substring(0, 120);
      } catch (e) { /* fallback to h1 */ }
    }
    if (title === "未知标题") {
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (titleMatch) title = decodeHtml(titleMatch[1].trim()).substring(0, 120);
    }

    // 视频地址（构造最高画质下载链接）
    const videoUrl = getVideoUrlFromDetail(html, link);

    // 分类
    const genreItems = [];
    const catRegex = /<a[^>]*href="\/cat\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(html)) !== null) {
      const slug = catMatch[1].replace(/\/$/, "");
      const name = catMatch[2].trim();
      if (name !== "Videos") {
        genreItems.push({ id: slug, title: name });
      }
    }

    // 演员（pornstar）
    const peoples = [];
    const starRegex = /<a[^>]*href="\/pornstar\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let starMatch;
    while ((starMatch = starRegex.exec(html)) !== null) {
      const starSlug = starMatch[1].replace(/\/$/, "");
      const starName = starMatch[2].trim();
      peoples.push({ id: starSlug, title: starName });
    }
    // 添加上传者
    const uploaderMatch = html.match(/mb-uploader[^>]*><a[^>]*>([^<]+)</);
    if (uploaderMatch) {
      const upName = uploaderMatch[1].trim();
      const alreadyHas = peoples.some(function(p) { return p.title.toLowerCase() === upName.toLowerCase(); });
      if (!alreadyHas) {
        peoples.push({ id: upName.toLowerCase(), title: upName });
      }
    }

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = videoUrl ? [{ url: videoUrl, coverUrl: thumb }] : [];

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      videoUrl: videoUrl,
      headers: { "Referer": BASE_URL + "/" },
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers
    };
  } catch (error) {
    console.error("[EPORNER 4K loadDetail] 失败:", error.message || error);
    throw error;
  }
}
