// ============================================================
//  ReelsMunkey — 短视频列表、详情与搜索模块
//  源站: https://reelsmunkey.com
//  Next.js SSR，数据内嵌于 __NEXT_DATA__ JSON
// ============================================================

WidgetMetadata = {
  id: "forward.reelsmunkey",
  title: "ReelsMunkey",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "ReelsMunkey — 免费在线观看 TikTok/Instagram 短视频",
  author: "EL",
  site: "https://reelsmunkey.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新推荐",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "trendingToday",
      title: "今日热门",
      functionName: "loadTrendingToday",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "trendingWeek",
      title: "本周热门",
      functionName: "loadTrendingWeek",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "trendingMonth",
      title: "月度热门",
      functionName: "loadTrendingMonth",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseTag",
      title: "标签浏览",
      functionName: "loadTagVideos",
      cacheDuration: 300,
      params: [
        {
          name: "tag",
          title: "选择标签",
          type: "enumeration",
          value: "asian-girls",
          enumOptions: [
            { title: "Asian", value: "asian-girls" },
            { title: "Leaks", value: "leaks" },
            { title: "Legal Teens", value: "legal-teens" },
            { title: "XXX", value: "xxx-tiktok" },
            { title: "Lingerie", value: "lingerie" },
            { title: "Masturbation", value: "masturbation" },
            { title: "Latina", value: "latina" },
            { title: "BlowJobs", value: "blowjobs" },
            { title: "Thick Ass", value: "thick-ass" },
            { title: "Twerk", value: "twerk" },
            { title: "Dance", value: "dance" },
            { title: "Cosplay", value: "cosplay" },
            { title: "Nudes", value: "tiktoks-nudes" },
            { title: "NSFW", value: "nsfw" },
            { title: "Nipslips", value: "nips-slip" },
            { title: "Thots", value: "thots" },
            { title: "Fit Chicks", value: "fit-chicks" },
            { title: "Boobs", value: "boobs" },
            { title: "Live", value: "lives" },
            { title: "Workouts", value: "workouts" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchGlobal",
      title: "搜索影片",
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
const BASE_URL = "https://reelsmunkey.com";
const IMG_BASE = "https://imgs.reelsmunkey.com";
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
 * 从 HTML 中提取 __NEXT_DATA__ JSON
 */
function extractNextData(html) {
  const match = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) throw new Error("未找到 __NEXT_DATA__");
  return JSON.parse(match[1].trim());
}

/**
 * 将 API 视频项转为 ForwardWidget VideoItem
 */
function parseVideoItem(item) {
  const id = item._id || "";
  const title = (item.title || "").substring(0, 120);
  const slug = item.url || "";
  const thumb = item.thumbnail ? `${IMG_BASE}/${item.thumbnail}` : "";
  const videoUrl = item.link ? `${IMG_BASE}/${item.link}` : "";

  // 标签 → genreItems
  const genreItems = (item.tags || []).map(t => ({
    id: t.url || "",
    title: t.tag || ""
  }));

  // 创建者（仅细节页有 notes 字段）
  const peoples = [];
  if (item.notes) {
    const handle = item.notes.replace(/^@/, "").trim();
    if (handle) {
      peoples.push({ id: handle, title: item.notes });
    }
  }

  // 评分（基于 likes）
  const likes = (item.likes && item.likes.count) || 0;
  const rating = Math.min(10, Math.round(likes / 200));

  return {
    id: id,
    type: "url",
    mediaType: "movie",
    title: title,
    link: slug,
    coverUrl: thumb,
    posterPath: thumb,
    backdropPath: thumb,
    videoUrl: videoUrl,
    headers: { "Referer": BASE_URL + "/" },
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    rating: rating
  };
}

/**
 * 处理 peopleId 导航：查询创作者页面
 */
async function loadPeopleVideos(peopleId) {
  const handle = (peopleId || "").trim();
  if (!handle) return [];

  try {
    const html = await fetchPage(`${BASE_URL}/creator/${encodeURIComponent(handle)}`);
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) return [];

    const items = (pageProps.videos || []).map(parseVideoItem);
    return items;
  } catch (error) {
    console.error("[ReelsMunkey loadPeopleVideos] 失败:", error.message || error);
    return [];
  }
}

// ============================================================
//  loadLatest / loadTrendingToday / loadTrendingWeek / loadTrendingMonth
// ============================================================
async function loadLatest(params)         { return loadPage("/", params); }
async function loadTrendingToday(params)  { return loadPage("/sortby/views/today", params); }
async function loadTrendingWeek(params)   { return loadPage("/sortby/views/week", params); }
async function loadTrendingMonth(params)  { return loadPage("/sortby/views/month", params); }

/**
 * 通用页面加载
 */
async function loadPage(path, params = {}) {
  try {
    if (params.genreId) return loadTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return loadPeopleVideos(params.peopleId);

    const page = Math.max(1, Number(params.page) || 1);
    // 首页 `/page/N` 支持分页；其他路径（sortby）仅第一页有数据
    const pagePath = page > 1 && path === "/" ? `/page/${page}` : path;
    const html = await fetchPage(BASE_URL + pagePath);
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("无效的页面数据");

    const items = (pageProps.data || []).map(parseVideoItem);
    if (path !== "/" && page > 1) return [];
    return items;
  } catch (error) {
    console.error("[ReelsMunkey loadPage] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadTagVideos — 按标签浏览
// ============================================================
async function loadTagVideos(params = {}) {
  try {
    if (params.genreId) params.tag = params.genreId;
    if (params.peopleId) return loadPeopleVideos(params.peopleId);

    const tag = (params.tag || "asian-girls").trim();
    const page = Math.max(1, Number(params.page) || 1);

    const html = await fetchPage(`${BASE_URL}/tag/${encodeURIComponent(tag)}`);
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("无效的标签页面数据");

    const items = (pageProps.data || []).map(parseVideoItem);
    if (page > 1) return [];
    return items;
  } catch (error) {
    console.error("[ReelsMunkey loadTagVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) return loadPeopleVideos(params.peopleId);

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);

    const html = await fetchPage(`${BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("无效的搜索结果数据");

    const items = (pageProps.videos || []).map(parseVideoItem);
    if (page > 1) return [];
    return items;
  } catch (error) {
    console.error("[ReelsMunkey searchVideos] 失败:", error.message || error);
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
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("无效的详情页数据");

    const videoData = pageProps.videoData;
    if (!videoData) throw new Error("未找到视频数据");

    const item = parseVideoItem(videoData);

    // 标签/分类 — 使用详情页全量的 tags（包含完整 tag 对象）
    const tags = pageProps.tags || videoData.tags || [];
    const genreItems = tags.map(t => ({
      id: t.url || "",
      title: t.tag || ""
    }));

    // 剧照 — 优先使用 additional_data.thumbs，其次使用 videoData.thumbnail
    let thumb = "";
    const additionalData = pageProps.data && pageProps.data.additional_data;
    if (additionalData && additionalData.thumbs) {
      thumb = additionalData.thumbs;  // string: single URL
    }
    if (!thumb && videoData.thumbnail) {
      thumb = `${IMG_BASE}/${videoData.thumbnail}`;
    }
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片（与主视频相同）
    const mainVideo = videoData.link ? `${IMG_BASE}/${videoData.link}` : "";
    const trailers = mainVideo ? [{ url: mainVideo, coverUrl: thumb }] : [];

    // 相关推荐 — 从 additional_data.related_videos 获取
    const related = (additionalData && additionalData.related_videos) || [];
    const relatedItems = related
      .filter(r => r._id !== videoData._id)
      .slice(0, 10)
      .map(r => parseVideoItem(r));

    return {
      ...item,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers,
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[ReelsMunkey loadDetail] 失败:", error.message || error);
    throw error;
  }
}
