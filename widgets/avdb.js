// ============================================================
//  AVDB — 视频列表、详情与搜索模块
//  源站: https://avdbapi.com
//  纯 JSON API — 无需 HTML 解析
// ============================================================

WidgetMetadata = {
  id: "avdbapi",
  title: "avdbapi",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "avdbapi 视频模块 — 有码 / 无码 / 无码流出 / 素人 / 国产AV / 动漫 / 英文字幕 多分类浏览",
  author: "EL",
  site: "https://avdbapi.com",
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
      id: "censored",
      title: "有码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "1" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "uncensored",
      title: "无码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "2" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "uncensoredleak",
      title: "无码流出",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "3" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "amateur",
      title: "素人",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "4" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "chineseav",
      title: "国产AV",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "5" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "hentai",
      title: "动漫",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "6" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "englishsub",
      title: "英文字幕",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catId", title: "", type: "constant", value: "7" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchAvdb",
      title: "搜索 avdbapi",
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
const BASE = "https://avdbapi.com/api.php/provide/vod";

// ============================================================
//  工具函数
// ============================================================

async function fetchAPI(url) {
  const resp = await Widget.http.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15"
    }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  // API 返回纯 JSON
  const parsed = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
  if (!parsed || parsed.code !== 1) throw new Error("API 返回错误");
  return parsed;
}

/** 从 API 视频对象构建列表项 */
function buildItem(item) {
  const id = item.id;
  const link = String(id);

  // 构建封面 URL
  let coverUrl = item.poster_url || item.thumb_url || "";
  if (!coverUrl && item.movie_code) {
    coverUrl = "https://upload18.cc/v/" + item.movie_code + "/poster.jpg";
  }

  // 分类
  const category = item.type_name || (item.category && item.category.length > 0 ? item.category[0] : "");

  // 演员
  const actors = item.actor && item.actor.length > 0 ? item.actor.join(", ") : "";

  // 标签
  const tag = item.tag || "";

  // 日期
  const pubdate = item.created_at || item.vod_time || "";

  // 简介
  const description = item.description || item.name || "";

  return {
    id: link,
    type: "url",
    mediaType: "movie",
    title: item.name || "Untitled",
    link: link,
    coverUrl: coverUrl || "",
    posterPath: coverUrl || "",
    backdropPath: coverUrl || "",
    description: description,
    releaseDate: pubdate,
    remark: (category ? category + (actors ? " · " + actors : "") : actors),
    genreTitle: category
  };
}

// ============================================================
//  从 embed 页面提取 m3u8 地址
//  与 XPTV 的 getPlayinfo 逻辑一致
// ============================================================

async function extractM3u8(embedUrl) {
  try {
    const resp = await Widget.http.get(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
        "Referer": "https://avdbapi.com/"
      }
    });
    if (!resp || !resp.data) return "";
    const html = typeof resp.data === "string" ? resp.data : String(resp.data);

    // 提取 PLAYER_CONFIG.m3u8（XPTV 主路径）
    const configMatch = html.match(/window\.PLAYER_CONFIG\s*=\s*\{[\s\S]*?m3u8:\s*["']([^"']+)["']/);
    if (configMatch && configMatch[1]) {
      let m3u8Path = configMatch[1];
      if (m3u8Path.startsWith("/")) {
        try {
          const urlObj = new URL(embedUrl);
          m3u8Path = urlObj.origin + m3u8Path;
        } catch(e) {}
      }
      return m3u8Path;
    }

    // 回退: _m3u8Url 变量
    const m3u8Fallback = html.match(/_m3u8Url\s*=\s*["']([^"']+)["']/);
    if (m3u8Fallback && m3u8Fallback[1]) return m3u8Fallback[1];

    // 回退: file: "...m3u8"
    const fileMatch = html.match(/file:\s*["']([^"']+\.m3u8[^"']*)["']/);
    if (fileMatch && fileMatch[1]) return fileMatch[1];

    return "";
  } catch (e) {
    console.error("[AVDB extractM3u8] 失败:", e.message || e);
    return "";
  }
}
async function loadLatest(params) {
  try {
    if (params.genreId) return loadCategory({ catId: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "?ac=detail&pg=" + page;
    const data = await fetchAPI(url);

    const items = [];
    for (const item of data.list || []) {
      if (!item || !item.id) continue;
      items.push(buildItem(item));
    }
    return items;
  } catch (error) {
    console.error("[AVDB loadLatest] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const catId = params.genreId || params.catId || params.category || "";
    if (!catId) throw new Error("缺少分类参数");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "?t=" + catId + "&ac=detail&pg=" + page;
    const data = await fetchAPI(url);

    const items = [];
    for (const item of data.list || []) {
      if (!item || !item.id) continue;
      items.push(buildItem(item));
    }
    return items;
  } catch (error) {
    console.error("[AVDB loadCategory] 失败:", error.message || error);
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
    const url = BASE + "?ac=detail&wd=" + encodeURIComponent(keyword) + "&pg=" + page;
    const data = await fetchAPI(url);

    const items = [];
    for (const item of data.list || []) {
      if (!item || !item.id) continue;
      items.push(buildItem(item));
    }
    return items;
  } catch (error) {
    console.error("[AVDB searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const id = String(link).replace(/[^0-9]/g, "");
    if (!id) throw new Error("无效的视频 ID");

    const url = BASE + "?ac=detail&ids=" + id;
    const data = await fetchAPI(url);
    const list = data.list || [];
    if (list.length === 0) throw new Error("未找到视频");

    const item = list[0];

    // 基本信息
    const title = item.name || "Untitled";
    let coverUrl = item.poster_url || item.thumb_url || "";
    if (!coverUrl && item.movie_code) {
      coverUrl = "https://upload18.cc/v/" + item.movie_code + "/poster.jpg";
    }

    // 描述
    const description = item.description || "";

    // 分类
    const genreItems = [];
    if (item.category && Array.isArray(item.category)) {
      for (const cat of item.category) {
        if (cat && cat.trim()) {
          genreItems.push({ id: cat.trim(), title: cat.trim() });
        }
      }
    }
    if (item.type_name && item.type_name.trim()) {
      genreItems.push({ id: item.type_name.trim(), title: item.type_name.trim() });
    }

    // 演员
    const peoples = [];
    if (item.actor && Array.isArray(item.actor)) {
      for (const actor of item.actor) {
        if (actor && actor.trim() && actor !== "Updating") {
          peoples.push({ id: actor.trim(), title: actor.trim(), role: "actor" });
        }
      }
    }

    // 标签
    const tag = item.tag || "";

    // 日期
    const pubdate = item.created_at || item.vod_pubdate || "";

    // 番号
    const movieCode = item.movie_code || "";
    const subtitle = movieCode ? "番号: " + movieCode : "";

    // 剧照
    const backdropPaths = [];
    if (coverUrl) backdropPaths.push(coverUrl);
    // 尝试构建 thumb URL
    if (item.movie_code) {
      const thumbUrl = "https://upload18.cc/v/" + item.movie_code + "/thumb.jpg";
      if (thumbUrl !== coverUrl) backdropPaths.push(thumbUrl);
    }

    // 视频地址：从 embed 页面提取 m3u8 token URL
    // 如果提取失败，回退为 embed 页面 URL，带上 customHeaders 让播放器从设备端请求
    let playUrl = "";
    let playHeaders = undefined;
    let linkEmbed = "";
    if (item.episodes && item.episodes.server_data && item.episodes.server_data.Full) {
      linkEmbed = item.episodes.server_data.Full.link_embed;
    }
    if (linkEmbed) {
      playUrl = await extractM3u8(linkEmbed);
      if (!playUrl) {
        // 提取失败，回退 embed URL + customHeaders 让播放器尝试
        playUrl = linkEmbed;
      }
      playHeaders = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
        "Referer": "https://avdbapi.com/",
        "X-Forward-Skip-Redirect-Probe": "1"
      };
    }

    // 预告片
    const trailers = [];
    if (playUrl) {
      trailers.push({ url: playUrl, coverUrl: coverUrl });
    }

    // 相关推荐：取同一分类的最新视频
    const relatedItems = undefined;

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: coverUrl || "",
      posterPath: coverUrl || "",
      backdropPath: coverUrl || "",
      videoUrl: playUrl || "",
      customHeaders: playHeaders,
      description: description,
      releaseDate: pubdate,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      trailers: trailers,
      remark: subtitle || tag,
      genreTitle: tag
    };
  } catch (error) {
    console.error("[AVDB loadDetail] 失败:", error.message || error);
    throw error;
  }
}
