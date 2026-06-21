// ============================================================
//  PornTok — 短视频列表、详情与搜索模块
//  源站: https://porntok.io
//  Next.js + REST API 数据
// ============================================================

WidgetMetadata = {
  id: "forward.porntok",
  title: "PornTok",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "PornTok — TikTok 风格的短视频聚合平台",
  author: "EL",
  site: "https://porntok.io",
  detailCacheDuration: 60,
  modules: [
    {
      id: "recommended",
      title: "智能推荐",
      functionName: "loadRecommended",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "newest",
      title: "最新视频",
      functionName: "loadNewest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "trending",
      title: "趋势热门",
      functionName: "loadTrending",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "popular",
      title: "最多观看",
      functionName: "loadPopular",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "topRated",
      title: "最高评分",
      functionName: "loadTopRated",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseCategory",
      title: "分类浏览",
      functionName: "loadCategoryVideos",
      cacheDuration: 300,
      params: [
        {
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "amateur",
          enumOptions: [
            { title: "Amateur", value: "amateur" },
            { title: "MILF", value: "milf" },
            { title: "Lesbian", value: "lesbian" },
            { title: "BDSM", value: "bdsm" },
            { title: "Big Tits", value: "big-tits" },
            { title: "Anal", value: "anal" },
            { title: "Teen 18+", value: "teen-18plus" },
            { title: "Asian", value: "asian" },
            { title: "Ebony", value: "ebony" },
            { title: "Cosplay", value: "cosplay" },
            { title: "Hentai", value: "hentai-animated" },
            { title: "Cumshots", value: "cumshots" },
            { title: "BBW", value: "bbw" },
            { title: "Gay", value: "gay" },
            { title: "Fetish", value: "fetish" },
            { title: "Latina", value: "latina" },
            { title: "Petite", value: "petite" },
            { title: "Redhead", value: "redhead" },
            { title: "Public", value: "public-outdoor" },
            { title: "Couples", value: "couples" },
            { title: "Trans", value: "trans" },
            { title: "Indian", value: "indian" },
            { title: "Creators", value: "creators" },
            { title: "For Women", value: "porn-for-women" },
            { title: "Ethical", value: "ethical-porn" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchGlobal",
      title: "搜索视频",
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
const BASE_URL = "https://porntok.io";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/html",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": BASE_URL + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchJSON(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error(`请求失败: ${url}`);
  return typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
}

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error(`请求失败: ${url}`);
  return resp.data;
}

/**
 * 将 API 视频项转为 ForwardWidget VideoItem
 */
function parseVideoItem(item) {
  const id = String(item.id || item.post_id || "");
  const title = (item.title || "").substring(0, 120);

  // 视频 URL：优先 hls_url，其次 path（修复不完整后缀）
  let videoUrl = item.hls_url || item.path || "";
  if (videoUrl && !videoUrl.endsWith(".mp4") && !videoUrl.includes(".m3u8")) {
    videoUrl += ".mp4";
  }

  // 缩略图：使用 API 返回的 thumbnail_url，修复截断后缀
  let thumb = item.thumbnail_url || "";
  if (thumb) {
    // 修复不完整后缀
    if (thumb.endsWith("_thumb")) {
      thumb += ".webp";
    } else {
      const lastPart = thumb.split("/").pop() || "";
      if (lastPart && !lastPart.match(/\.(webp|jpg|jpeg|png)$/)) {
        thumb += ".webp";
      }
    }
  }

  // 封面：优先用缩略图，无缩略图时用视频 URL 兜底
  const coverUrl = thumb || videoUrl || "";

  // 演员（作者）
  const peoples = [];
  if (item.author) {
    peoples.push({ id: item.author.toLowerCase(), title: item.author });
  }

  // 分类
  const genreItems = [];
  if (item.category) {
    genreItems.push({ id: (item.category || "").toLowerCase(), title: item.category });
  }

  // 评分（基于 view_count）
  const views = item.view_count || 0;
  const rating = Math.min(10, Math.round(views / 5000));

  return {
    id: id,
    type: "url",
    mediaType: "movie",
    title: title,
    link: id,
    coverUrl: coverUrl,
    posterPath: coverUrl,
    backdropPath: coverUrl,
    videoUrl: videoUrl,
    headers: { "Referer": BASE_URL + "/" },
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    rating: rating
  };
}

// ============================================================
//  loadRecommended / loadNewest / loadTrending / loadPopular / loadTopRated
// ============================================================
async function loadRecommended(params)  { return loadFromAPI("", params); }
async function loadNewest(params)       { return loadFromAPI("&sort=new", params); }
async function loadTrending(params)     { return loadFromAPI("&sort=trending", params); }
async function loadPopular(params)      { return loadFromAPI("&sort=popular", params); }
async function loadTopRated(params)     { return loadFromAPI("&sort=top", params); }

/**
 * 通用 API 加载
 */
async function loadFromAPI(sortParam, params = {}) {
  try {
    if (params.genreId) return loadCategoryVideos({ ...params, category: params.genreId });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = `${BASE_URL}/api/videos?page=${page}${sortParam}`;
    const data = await fetchJSON(url);
    const items = (data.videos || []).map(parseVideoItem);
    return items;
  } catch (error) {
    console.error("[PornTok loadFromAPI] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategoryVideos — 按分类浏览
// ============================================================
async function loadCategoryVideos(params = {}) {
  try {
    if (params.genreId) params.category = params.genreId;
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const category = (params.category || "amateur").trim();
    const page = Math.max(1, Number(params.page) || 1);
    const url = `${BASE_URL}/api/videos?category=${encodeURIComponent(category)}&page=${page}`;
    const data = await fetchJSON(url);
    const items = (data.videos || []).map(parseVideoItem);
    return items;
  } catch (error) {
    console.error("[PornTok loadCategoryVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) {
      const keyword = params.peopleId.trim();
      return searchVideos({ keyword: keyword, page: params.page || 1 });
    }

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    const url = `${BASE_URL}/api/videos?search=${encodeURIComponent(keyword)}&page=${page}`;
    const data = await fetchJSON(url);
    const items = (data.videos || []).map(parseVideoItem);
    return items;
  } catch (error) {
    console.error("[PornTok searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const html = await fetchPage(`${BASE_URL}/video/${encodeURIComponent(link)}`);

    // 从 JSON-LD 提取视频详情
    const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
    let videoEntity = null;
    let breadcrumb = null;

    if (ldMatch) {
      for (const script of ldMatch) {
        try {
          const jsonStr = script.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
          const data = JSON.parse(jsonStr);
          if (data["@type"] === "WebPage" && data.mainEntity && data.mainEntity["@type"] === "VideoObject") {
            videoEntity = data.mainEntity;
            breadcrumb = data.breadcrumb;
          }
        } catch (e) { /* skip invalid JSON-LD */ }
      }
    }

    // 从视频标签获取额外 MP4 URL
    const srcMatch = html.match(/<video[^>]*src="([^"]+)"/);
    const ssrVideo = srcMatch ? srcMatch[1] : null;

    // 构建基础字段（修复不完整后缀；缩略图从视频路径构造更可靠）
    let videoUrl = videoEntity && videoEntity.contentUrl ? videoEntity.contentUrl : (ssrVideo || "");
    if (videoUrl && !videoUrl.endsWith(".mp4") && !videoUrl.includes(".m3u8")) {
      videoUrl += ".mp4";
    }

    // 缩略图：使用 API 返回的 thumbnailUrl，修复截断后缀
    let thumb = videoEntity && videoEntity.thumbnailUrl ? videoEntity.thumbnailUrl : "";
    if (thumb) {
      if (thumb.endsWith("_thumb")) {
        thumb += ".webp";
      } else {
        const lastPart = thumb.split("/").pop() || "";
        if (lastPart && !lastPart.match(/\.(webp|jpg|jpeg|png)$/)) {
          thumb += ".webp";
        }
      }
    }

    // 封面：优先用缩略图，否则用视频 URL 兜底
    const coverUrl = thumb || videoUrl || "";
    const title = videoEntity && videoEntity.name ? videoEntity.name : "未知标题";
    const author = videoEntity && videoEntity.author ? videoEntity.author.name : "";
    const duration = videoEntity && videoEntity.duration ? videoEntity.duration : "";
    const uploadDate = videoEntity && videoEntity.uploadDate ? videoEntity.uploadDate : "";
    const views = videoEntity && videoEntity.interactionStatistic ? videoEntity.interactionStatistic.userInteractionCount || 0 : 0;
    const rating = Math.min(10, Math.round(views / 5000));

    // 分类（从面包屑获取）
    const genreItems = [];
    if (breadcrumb) {
      const items = breadcrumb.itemListElement || [];
      for (const item of items) {
        const catPath = item.item || "";
        const catMatch = catPath.match(/\/category\/([^/]+)/);
        if (catMatch) {
          const slug = catMatch[1];
          genreItems.push({ id: slug, title: item.name });
        }
      }
    }

    // 演员
    const peoples = author ? [{ id: author.toLowerCase(), title: author }] : [];

    // 剧照
    const backdropPaths = coverUrl ? [coverUrl] : [];

    // 预告片（与主视频相同）
    const trailers = videoUrl ? [{ url: videoUrl, coverUrl: coverUrl }] : [];

    // 相关推荐 — 搜索同类视频
    const mainCategory = genreItems.length > 0 ? genreItems[0].id : "";
    let relatedItems = [];
    if (mainCategory) {
      try {
        const relUrl = `${BASE_URL}/api/videos?category=${encodeURIComponent(mainCategory)}&page=1&limit=10`;
        const relData = await fetchJSON(relUrl);
        relatedItems = (relData.videos || [])
          .filter(r => String(r.id || r.post_id || "") !== link)
          .slice(0, 10)
          .map(r => parseVideoItem(r));
      } catch (e) { /* related failure is non-fatal */ }
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: coverUrl,
      posterPath: coverUrl,
      backdropPath: coverUrl,
      videoUrl: videoUrl,
      headers: { "Referer": BASE_URL + "/" },
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      rating: rating,
      backdropPaths: backdropPaths,
      trailers: trailers,
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[PornTok loadDetail] 失败:", error.message || error);
    throw error;
  }
}
