// ============================================================
//  HoHoJ — 视频列表、详情与搜索模块
//  源站: https://hohoj.tv
//  HTML 解析
// ============================================================

WidgetMetadata = {
  id: "forward.hohoj",
  title: "HoHoJ",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "HoHoJ 视频模块 — 全部 / 欧美 / 中字 / 无码 / 有码 分类浏览",
  author: "EL",
  site: "https://hohoj.tv",
  detailCacheDuration: 60,
  modules: [
    {
      id: "all",
      title: "全部",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "all" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "europe",
      title: "欧美",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "europe" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "chinese",
      title: "中字",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "chinese" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "uncensored",
      title: "无码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "uncensored" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "censored",
      title: "有码",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "catType", title: "", type: "constant", value: "censored" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchHohoj",
      title: "搜索 HoHoJ",
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
const BASE = "https://hohoj.tv";
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

/** 小图 URL 转大图 */
function smallToLarge(smallUrl) {
  if (!smallUrl) return "";
  return smallUrl.replace("/small_", "/large_");
}

/** 解析列表页 HTML */
function parseListHtml(html) {
  const items = [];
  const blocks = html.split('class="video-item col-lg-3 col-md-3 col-sm-6 col-6 mt-4"');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const idMatch = block.match(/\/video\?id=(\d+)/);
    if (!idMatch) continue;
    const id = idMatch[1];

    const title = getText(block, /video-item-title mt-1[^>]*>([^<]+)</);
    const smallCover = getText(block, /<img[^>]*src="([^"]+)"/);
    const cover = smallCover ? smallToLarge(smallCover) : "";
    const remarks = getText(block, /video-item-badge[^>]*>([^<]+)</);

    items.push({
      id: id,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: id,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      remark: remarks || ""
    });
  }
  return items;
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.genreId) return loadCategory({ catType: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const catType = params.genreId || params.catType || params.category || "all";
    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/search?type=" + catType + "&p=" + page + "&order=popular";
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[HoHoJ loadCategory] 失败:", error.message || error);
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
    const url = BASE + "/search?text=" + encodeURIComponent(keyword) + "&p=" + page;
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[HoHoJ searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频 ID");

  try {
    const id = String(link).replace(/[^0-9]/g, "");
    if (!id) throw new Error("无效的视频 ID");

    // 获取 video 页面提取元数据
    const pageUrl = BASE + "/video?id=" + id;
    const pageHtml = await fetchPage(pageUrl);

    // 标题（og:title，去掉站点后缀）
    const title = getText(pageHtml, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)
      .replace(/ - HoHoJ.*$/, "").replace(/ \| HoHoJ.*$/, "").trim() || "Untitled";

    // 缩略图（og:image）
    let thumb = getText(pageHtml, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (thumb && !thumb.startsWith("http")) thumb = "https:" + thumb;

    // 演员（model）
    const peoples = [];
    const modelBlocks = pageHtml.split('<div class="model">');
    for (let mi = 1; mi < modelBlocks.length; mi++) {
      const mb = modelBlocks[mi];
      const modelId = getText(mb, /href="\/model\?id=(\d+)/);
      const modelName = getText(mb, /model-name[^>]*>([^<]+)</);
      const modelImg = getText(mb, /<img[^>]*src="([^"]+)"/);
      if (modelId && modelName) {
        peoples.push({
          id: modelId,
          title: modelName,
          avatar: modelImg && modelImg.startsWith("http") ? modelImg : undefined,
          role: "actor"
        });
      }
    }

    // 分类（main-ctg-tag 和 ctg-tag）
    const genreItems = [];
    const catRegex = /<span class="(?:main-)?ctg-tag"[^>]*>#<\/span><a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/g;
    let cm;
    while ((cm = catRegex.exec(pageHtml)) !== null) {
      const catName = cm[2].trim();
      if (catName) {
        genreItems.push({ id: catName, title: catName });
      }
    }

    // 备注（从 meta keywords 取番号）
    const keywords = getText(pageHtml, /<meta[^>]+name="keywords"[^>]+content="([^"]+)"/);
    const codeMatch = keywords.match(/([A-Z0-9]+-\d+)/);
    const remark = codeMatch ? codeMatch[1] : "";

    // 从 embed 页面提取视频地址
    let videoUrl = "";
    try {
      const embedHtml = await fetchPage(BASE + "/embed?id=" + id);
      // video 标签属性跨多行，用 [\s\S] 匹配
      videoUrl = getText(embedHtml, /<video[\s\S]*?src="([^"]+)"/);
      if (!videoUrl) {
        videoUrl = getText(embedHtml, /var videoSrc\s*=\s*"([^"]+)"/);
      }
    } catch (e) {
      console.error("[HoHoJ loadDetail] embed 获取失败:", e.message || e);
    }

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = [];
    if (videoUrl) {
      trailers.push({ url: videoUrl, coverUrl: thumb || "" });
    }

    // 播放请求头
    const playHeaders = {
      "Referer": BASE + "/",
      "User-Agent": UA
    };

    return {
      id: id,
      type: "url",
      mediaType: "movie",
      title: title,
      link: id,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      customHeaders: playHeaders,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers,
      remark: remark || undefined
    };
  } catch (error) {
    console.error("[HoHoJ loadDetail] 失败:", error.message || error);
    throw error;
  }
}
