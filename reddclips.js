// ============================================================
//  ReddClips — 短视频列表、详情与搜索模块
//  源站: https://reddclips.com
//  REST API: https://api.reddclips.com
// ============================================================

WidgetMetadata = {
  id: "forward.reddclips",
  title: "ReddClips",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "ReddClips — Reddit 短视频聚合",
  author: "EL",
  site: "https://reddclips.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "hot",
      title: "热门推荐",
      functionName: "loadHot",
      cacheDuration: 300,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "hot",
          enumOptions: [
            { title: "热门", value: "hot" },
            { title: "最高评分", value: "top" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "topRated",
      title: "最高评分",
      functionName: "loadTop",
      cacheDuration: 300,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "top",
          enumOptions: [
            { title: "热门", value: "hot" },
            { title: "最高评分", value: "top" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseCategory",
      title: "分类浏览",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        {
          name: "categoryId",
          title: "选择分类",
          type: "enumeration",
          value: "6",
          enumOptions: [
            { title: "Heterosexual", value: "6" },
            { title: "Gay", value: "7" },
            { title: "Transgender", value: "9" },
            { title: "Hentai & Anime", value: "13" },
            { title: "BDSM & Fetish", value: "14" },
            { title: "Lesbian", value: "15" },
            { title: "Asian", value: "16" },
            { title: "Latina & Ebony", value: "17" },
            { title: "MILF & Mature", value: "18" },
            { title: "Public & Exhibitionism", value: "19" },
            { title: "Cosplay & Alt/Goth", value: "20" },
            { title: "Anal", value: "21" },
            { title: "Feet", value: "22" },
            { title: "Threesome & Group", value: "23" },
            { title: "Amateur & Homemade", value: "24" },
            { title: "Petite & Tiny", value: "25" },
            { title: "Curvy & Thick", value: "26" },
            { title: "Redheads", value: "27" },
            { title: "Oral & Blowjobs", value: "28" }
          ]
        },
        { name: "sort_by", title: "排序", type: "enumeration", value: "hot",
          enumOptions: [
            { title: "热门", value: "hot" },
            { title: "最新", value: "new" },
            { title: "最高评分", value: "top" }
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
const API_BASE = "https://api.reddclips.com";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json",
  "Referer": "https://reddclips.com/"
};

// 默认分类 ID（Heterosexual）
const DEFAULT_CAT = "6";

// ============================================================
//  工具函数
// ============================================================

async function fetchJSON(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
}

/**
 * 将 API 视频项转为 ForwardWidget VideoItem
 * 仅保留 mediaType === "video" 的可播放项
 */
function parseVideoItem(item) {
  // 跳过非视频项（image/gallery 只有图片链接，无可播放视频）
  if (item.mediaType && item.mediaType !== "video") return null;

  const id = item.id || "";
  const title = (item.title || "").substring(0, 120);

  // 视频地址（mediaUrl 可能是相对路径也可能是绝对 URL）
  let videoUrl = "";
  if (item.mediaUrl) {
    videoUrl = item.mediaUrl.startsWith("http") ? item.mediaUrl : API_BASE + item.mediaUrl;
  }
  // 缩略图
  const thumb = item.thumbnail || "";

  // 演员（Reddit 作者）
  const peoples = [];
  if (item.author) {
    peoples.push({ id: item.author.toLowerCase(), title: item.author });
  }

  // 分类（子版块）
  const genreItems = [];
  if (item.subreddit) {
    genreItems.push({ id: item.subreddit.toLowerCase(), title: "r/" + item.subreddit });
  }

  // 评分（基于 upvotes）
  const votes = item.upvotes || 0;
  const rating = Math.min(10, Math.round(votes / 1000));

  return {
    id: id,
    type: "url",
    mediaType: "movie",
    title: title,
    link: id,
    coverUrl: thumb,
    posterPath: thumb,
    backdropPath: thumb,
    videoUrl: videoUrl,
    headers: { "Referer": "https://reddclips.com/" },
    genreItems: genreItems.length > 0 ? genreItems : undefined,
    peoples: peoples.length > 0 ? peoples : undefined,
    rating: rating
  };
}

// ============================================================
//  loadHot / loadTop — 默认分类排序模块
//  注意：API 上 sort=hot 和 sort=new 返回相同数据，故仅保留 hot 和 top
// ============================================================
async function loadHot(params)   { return loadPosts(DEFAULT_CAT, params.sort_by || "hot", params); }
async function loadTop(params)   { return loadPosts(DEFAULT_CAT, params.sort_by || "top", params); }

/**
 * 通用分类帖加载
 */
async function loadPosts(catId, sort, params = {}) {
  try {
    if (params.genreId) return loadPosts(params.genreId, sort, {});
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const limit = 100;
    const url = API_BASE + "/categories/" + catId + "/posts?sort=" + sort + "&limit=" + limit;
    const data = await fetchJSON(url);
    return (data.posts || []).map(parseVideoItem).filter(Boolean);
  } catch (error) {
    console.error("[ReddClips loadPosts] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 分类浏览（含 sort 参数）
// ============================================================
async function loadCategory(params = {}) {
  try {
    if (params.genreId) params.categoryId = params.genreId;
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const catId = (params.categoryId || DEFAULT_CAT).trim();
    const sort = (params.sort_by || "hot").trim();
    return loadPosts(catId, sort, params);
  } catch (error) {
    console.error("[ReddClips loadCategory] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索（分类内关键词匹配）
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const limit = 100;
    const url = API_BASE + "/categories/" + DEFAULT_CAT + "/posts?search=" + encodeURIComponent(keyword) + "&limit=" + limit;
    const data = await fetchJSON(url);
    return (data.posts || []).map(parseVideoItem).filter(Boolean);
  } catch (error) {
    console.error("[ReddClips searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
//  列表已含完整数据，详情页做增强补充
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  // 从热门分类找这个视频补充详情
  try {
    const data = await fetchJSON(API_BASE + "/categories/" + DEFAULT_CAT + "/posts?sort=hot&limit=100");
    const posts = data.posts || [];
    const found = posts.find(function(p) { return p.id === link; });
    if (found) {
      const item = parseVideoItem(found);
      if (!item) { throw new Error("非视频项"); }
      // 剧照
      const backdropPaths = item.coverUrl ? [item.coverUrl] : [];
      // 预告片（与主视频相同）
      const trailers = item.videoUrl ? [{ url: item.videoUrl, coverUrl: item.coverUrl || "" }] : [];
      // 相关推荐（同分类的其他视频）
      const relatedItems = posts
        .filter(function(p) { return p.id !== link; })
        .slice(0, 10)
        .map(function(p) { return parseVideoItem(p); })
        .filter(Boolean);

      return {
        ...item,
        backdropPaths: backdropPaths,
        trailers: trailers,
        relatedItems: relatedItems.length > 0 ? relatedItems : undefined
      };
    }
  } catch (e) { /* fallback: return basic item */ }

  // 兜底：返回基础结构
  return {
    id: link, type: "url", mediaType: "movie",
    title: "Video " + link, link: link,
    backdropPaths: [], trailers: [], relatedItems: [],
    headers: { "Referer": "https://reddclips.com/" }
  };
}
