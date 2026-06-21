// ============================================================
//  肉视频 (rou.video) — 视频列表、详情与搜索模块
//  源站: https://rou.video
//  Next.js SSR — 解析 __NEXT_DATA__
// ============================================================

WidgetMetadata = {
  id: "forward.rouvideo",
  title: "肉视频",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "rou.video 视频模块 — 國產AV、探花、自拍流出、OnlyFans 等分类浏览",
  author: "EL",
  site: "https://rou.video",
  detailCacheDuration: 60,
  modules: [
    {
      id: "home",
      title: "首页推荐",
      functionName: "loadHome",
      cacheDuration: 300,
      params: []
    },
    {
      id: "guochanav",
      title: "國產AV",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "cat", title: "", type: "constant", value: "國產AV" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "tanhua",
      title: "探花",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "cat", title: "", type: "constant", value: "探花" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "zipai",
      title: "自拍流出",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "cat", title: "", type: "constant", value: "自拍流出" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "onlyfans",
      title: "OnlyFans",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "cat", title: "", type: "constant", value: "OnlyFans" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "japan",
      title: "日本",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "cat", title: "", type: "constant", value: "日本" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchRou",
      title: "搜索肉视频",
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
const BASE = "https://rou.video";

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15"
    }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

/** 从 HTML 中提取 __NEXT_DATA__ JSON */
function extractNextData(html) {
  const start = html.indexOf('"__NEXT_DATA__"');
  if (start < 0) throw new Error("未找到 __NEXT_DATA__");
  const jsonStart = html.indexOf('>', start) + 1;
  const jsonEnd = html.indexOf("</script>", jsonStart);
  if (jsonEnd < 0) throw new Error("__NEXT_DATA__ 格式错误");
  return JSON.parse(html.substring(jsonStart, jsonEnd));
}

/** Base64 解码（纯 JS，兼容 ForwardWidget 沙箱） */
function base64Decode(b64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const lookup = {};
  for (let i = 0; i < chars.length; i++) lookup[chars[i]] = i;

  let pos = b64.indexOf("=");
  let padded = pos > -1;
  let len = padded ? pos : b64.length;
  let result = "";

  for (let i = 0; i < len; i += 4) {
    const a = lookup[b64[i]] || 0;
    const b = lookup[b64[i + 1]] || 0;
    const c = lookup[b64[i + 2]] || 0;
    const d = lookup[b64[i + 3]] || 0;
    const code = (a << 18) | (b << 12) | (c << 6) | d;
    if (code !== 0) {
      result += String.fromCharCode((code >>> 16) & 0xFF, (code >>> 8) & 0xFF, code & 0xFF);
    }
  }
  if (padded) result = result.slice(0, pos - b64.length);
  return result;
}

/** 解码 ev 对象，得到真实视频数据 */
function decodeEv(ev) {
  const raw = base64Decode(ev.d);
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += String.fromCharCode(raw.charCodeAt(i) - ev.k);
  }
  return JSON.parse(result);
}

/** 从视频对象构建列表项 */
function buildItem(video) {
  const link = "/v/" + video.id;

  const duration = video.duration || 0;
  const durationText = duration > 0 ? formatDuration(duration) : "";

  return {
    id: link,
    type: "url",
    mediaType: "movie",
    title: video.nameZh || video.name || "Untitled",
    link: link,
    coverUrl: video.coverImageUrl || "",
    posterPath: video.coverImageUrl || "",
    backdropPath: video.coverImageUrl || "",
    durationText: durationText,
    remarks: (video.tags || []).join(", ")
  };
}

/** 格式化秒数为 mm:ss 或 hh:mm:ss */
function formatDuration(seconds) {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  return m + ":" + String(sec).padStart(2, "0");
}

// ============================================================
//  分类映射
// ============================================================
const CATEGORIES = {
  guochanav: "國產AV",
  tanhua: "探花",
  zipai: "自拍流出",
  onlyfans: "OnlyFans",
  japan: "日本"
};

// ============================================================
//  loadHome — 首页推荐
// ============================================================
async function loadHome(params) {
  try {
    const html = await fetchPage(BASE + "/home");
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("pageProps 为空");

    // 合并首页多个栏目
    const sources = [
      pageProps.recommended || [],
      pageProps.latest || [],
      pageProps.hot91 || []
    ];
    const seen = {};
    const items = [];
    for (const list of sources) {
      for (const video of list) {
        if (!video || !video.id) continue;
        if (seen[video.id]) continue;
        seen[video.id] = true;
        items.push(buildItem(video));
      }
    }
    return items;
  } catch (error) {
    console.error("[rou.video loadHome] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    // 确定分类名称
    let category = params.genreId || params.category || params.cat || "";
    if (!category && params.id) {
      category = CATEGORIES[params.id] || "";
    }
    if (!category) throw new Error("缺少分类参数");

    const page = Math.max(1, Number(params.page) || 1);
    const encoded = encodeURIComponent(category);
    const url = BASE + "/t/" + encoded + "?order=createdAt&page=" + page;
    const html = await fetchPage(url);
    const data = extractNextData(html);
    const videos = data.props && data.props.pageProps && data.props.pageProps.videos;

    if (!Array.isArray(videos)) return [];

    const items = [];
    for (const video of videos) {
      if (!video || !video.id) continue;
      items.push(buildItem(video));
    }
    return items;
  } catch (error) {
    console.error("[rou.video loadCategory] 失败:", error.message || error);
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
    const url = BASE + "/search?q=" + encodeURIComponent(keyword) + "&page=" + page;
    const html = await fetchPage(url);
    const data = extractNextData(html);
    const videos = data.props && data.props.pageProps && data.props.pageProps.videos;

    if (!Array.isArray(videos)) return [];

    const items = [];
    for (const video of videos) {
      if (!video || !video.id) continue;
      items.push(buildItem(video));
    }
    return items;
  } catch (error) {
    console.error("[rou.video searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    // 从链接中提取 video id
    let videoId = link;
    if (link.startsWith("/v/")) videoId = link.substring(3);
    else if (link.startsWith(BASE + "/v/")) videoId = link.substring(BASE.length + 3);
    // 移除尾部斜杠或查询参数
    videoId = videoId.replace(/\/.*$/, "").replace(/\?.*$/, "");

    const url = BASE + "/v/" + videoId;
    const html = await fetchPage(url);
    const data = extractNextData(html);
    const pageProps = data.props && data.props.pageProps;
    if (!pageProps) throw new Error("pageProps 为空");

    const video = pageProps.video;
    if (!video) throw new Error("未找到视频数据");

    // 标题
    const title = video.nameZh || video.name || "Untitled";

    // 缩略图
    const thumb = video.coverImageUrl || "";

    // 时长
    const duration = video.duration || 0;
    const durationText = duration > 0 ? formatDuration(duration) : "";

    // 标签/分类
    const genreItems = [];
    if (video.tags && Array.isArray(video.tags)) {
      for (const tag of video.tags) {
        genreItems.push({ id: tag, title: tag });
      }
    }

    // 统计信息
    const viewCount = video.viewCount || 0;
    const likeCount = video.likeCount || 0;

    // 解码视频地址
    let playUrl = "";
    if (pageProps.ev) {
      try {
        const decoded = decodeEv(pageProps.ev);
        playUrl = decoded.videoUrl || "";
        if (playUrl && playUrl.endsWith(".jpg")) {
          playUrl = playUrl.replace(/\.jpg$/, ".m3u8");
        }
      } catch (e) {
        console.error("[rou.video] ev 解码失败:", e.message || e);
      }
    }

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = [];
    if (playUrl) {
      trailers.push({ url: playUrl, coverUrl: thumb });
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      videoUrl: playUrl || "",
      durationText: durationText,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers,
      remark: (viewCount ? viewCount.toLocaleString() + " 次观看" : "") + (likeCount ? " · " + likeCount + " 赞" : "")
    };
  } catch (error) {
    console.error("[rou.video loadDetail] 失败:", error.message || error);
    throw error;
  }
}
