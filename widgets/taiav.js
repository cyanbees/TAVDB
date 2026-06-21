// ============================================================
//  Taiav — 视频列表、详情与搜索模块
//  源站: https://taiav.com
//  REST API
// ============================================================

WidgetMetadata = {
  id: "forward.taiav",
  title: "Taiav",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Taiav 视频模块 — 网红主播、国产AV、有码、无码、Onlyfans、Korean BJ、探花 分类浏览",
  author: "EL",
  site: "https://taiav.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "wanghong",
      title: "网红主播",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "category" },
        { name: "catValue", title: "", type: "constant", value: "网红主播" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "guochanav",
      title: "国产AV",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "category" },
        { name: "catValue", title: "", type: "constant", value: "国产AV" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "youma",
      title: "有码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "category" },
        { name: "catValue", title: "", type: "constant", value: "有码" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "wuma",
      title: "无码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "category" },
        { name: "catValue", title: "", type: "constant", value: "无码" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "onlyfans",
      title: "Onlyfans",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "tag" },
        { name: "catValue", title: "", type: "constant", value: "Onlyfans" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "koreanbj",
      title: "Korean BJ",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "tag" },
        { name: "catValue", title: "", type: "constant", value: "Korean Bj" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "tanhua",
      title: "探花",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "tag" },
        { name: "catValue", title: "", type: "constant", value: "探花" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchTaiav",
      title: "搜索 Taiav",
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
const BASE = "https://taiav.com";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";

// ============================================================
//  工具函数
// ============================================================

async function fetchAPI(url) {
  const resp = await Widget.http.get(url, {
    headers: { "User-Agent": UA }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  // API 返回 JSON 字符串
  const parsed = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
  return parsed;
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

function buildItem(item) {
  const id = String(item._id);
  const cover = item.poster2 && item.poster2.url ? absUrl(item.poster2.url) : "";
  const duration = item.duration || "";
  const pubdate = item.createAt || "";

  // 编码封面 URL 到 link 中，供 detail 使用
  const link = cover ? id + "|" + cover : id;

  return {
    id: id,
    type: "url",
    mediaType: "movie",
    title: item.originalname || item.name || "Untitled",
    link: link,
    coverUrl: cover || "",
    posterPath: cover || "",
    backdropPath: cover || "",
    durationText: duration || "",
    releaseDate: pubdate || "",
    remark: "HD"
  };
}

// ============================================================
//  loadLatest — 最新列表
// ============================================================
async function loadLatest(params) {
  try {
    if (params.genreId) return loadCategory({
      catType: "category", catValue: params.genreId, page: params.page
    });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/api/getcontents?page=" + page + "&size=12&type=movie,tv";
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!item || !item._id) continue;
        items.push(buildItem(item));
      }
    }
    return items;
  } catch (error) {
    console.error("[Taiav loadLatest] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类/标签浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const catType = params.genreId ? "category" : (params.catType || "category");
    const catValue = params.genreId || params.catValue || params.category || "";
    if (!catValue) throw new Error("缺少分类参数");

    const page = Math.max(1, Number(params.page) || 1);
    const encoded = encodeURIComponent(catValue);
    const url = BASE + "/api/getcontents?page=" + page + "&size=12&" + catType + "=" + encoded + "&type=movie,tv";
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!item || !item._id) continue;
        items.push(buildItem(item));
      }
    }
    return items;
  } catch (error) {
    console.error("[Taiav loadCategory] 失败:", error.message || error);
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
    const url = BASE + "/api/getcontents?page=" + page + "&size=48&q=" + encodeURIComponent(keyword) + "&type=movie,tv";
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!item || !item._id) continue;
        items.push(buildItem(item));
      }
    }
    return items;
  } catch (error) {
    console.error("[Taiav searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频 ID");

  try {
    const parts = String(link).split("|");
    const id = parts[0].replace(/[^0-9a-fA-F]/g, "");
    const encodedCover = parts.length > 1 ? parts.slice(1).join("|") : "";
    if (!id) throw new Error("无效的视频 ID");

    // 封面
    const thumb = encodedCover || "";
    const title = "";

    // 从详情 API 获取 m3u8 地址
    const detailUrl = BASE + "/api/getmovie?type=1280&id=" + id;
    const detailData = await fetchAPI(detailUrl);

    if (!detailData || !detailData.m3u8) throw new Error("未找到视频播放地址");

    const m3u8Path = detailData.m3u8;
    // 通过 Worker 代理播放（解密 AES-128）
    const videoUrl = "https://taiav-worker.cybees7.workers.dev/play/" + id;

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = [];
    if (videoUrl) {
      trailers.push({ url: videoUrl, coverUrl: thumb });
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "",
      link: link,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      backdropPaths: backdropPaths,
      trailers: trailers
    };
  } catch (error) {
    console.error("[Taiav loadDetail] 失败:", error.message || error);
    throw error;
  }
}
