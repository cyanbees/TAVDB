// ============================================================
//  PornTrex — 视频列表、详情与搜索模块
//  源站: https://www.porntrex.com
//  HTML 解析
// ============================================================

WidgetMetadata = {
  id: "forward.porntrex",
  title: "PornTrex",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "PornTrex 视频模块 — 最新更新、最高评分、最受欢迎、分类浏览",
  author: "EL",
  site: "https://www.porntrex.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新更新",
      functionName: "loadLatest",
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
      id: "mostPopular",
      title: "最受欢迎",
      functionName: "loadMostPopular",
      cacheDuration: 300,
      params: [
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
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "teen",
          enumOptions: [
            { title: "3D", value: "3d" },
            { title: "4K Porn", value: "4k-porn" },
            { title: "AI", value: "ai" },
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Arab", value: "arab" },
            { title: "Asian", value: "asian" },
            { title: "Ass Licking", value: "ass-licking" },
            { title: "Ass To Mouth", value: "ass-to-mouth" },
            { title: "Babe", value: "babe" },
            { title: "Babysitter", value: "babysitter" },
            { title: "BBW", value: "bbw" },
            { title: "Big Ass", value: "big-ass" },
            { title: "Big Tits", value: "big-tits" },
            { title: "Black", value: "black" },
            { title: "Blonde", value: "blonde" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Bondage", value: "bondage" },
            { title: "Brunette", value: "brunette" },
            { title: "Bukkake", value: "bukkake" },
            { title: "Busty", value: "busty" },
            { title: "BWC", value: "bwc-big-white-cock" },
            { title: "Casting", value: "casting" },
            { title: "Celebrities", value: "celebrities" },
            { title: "College", value: "college" },
            { title: "Compilation", value: "compilation" },
            { title: "Creampie", value: "creampie" },
            { title: "Cuckold", value: "cuckold" },
            { title: "Cum Swapping", value: "cum-swapping" },
            { title: "Cumshots", value: "cumshots" },
            { title: "Czech", value: "czech" },
            { title: "Czech Massage", value: "czech-massage" },
            { title: "Deepthroat", value: "deepthroat" },
            { title: "Doggystyle", value: "doggystyle" },
            { title: "Double Penetration", value: "double-penetration" },
            { title: "Ebony", value: "ebony" },
            { title: "Fantasy", value: "fantasy" },
            { title: "Fetish", value: "fetish" },
            { title: "Fingering", value: "fingering" },
            { title: "Fisting", value: "fisting" },
            { title: "Footjob", value: "footjob" },
            { title: "Foursome", value: "foursome" },
            { title: "Gangbang", value: "gangbang" },
            { title: "Gangbang Creampie", value: "gangbang-creampie" },
            { title: "Gaping", value: "gaping" },
            { title: "Gay", value: "gay" },
            { title: "German", value: "german" },
            { title: "Gloryhole", value: "gloryhole" },
            { title: "Hairy", value: "hairy" },
            { title: "Handjob", value: "handjob" },
            { title: "Hardcore", value: "hardcore" },
            { title: "HD", value: "hd" },
            { title: "Hentai", value: "hentai" },
            { title: "Homemade", value: "homemade" },
            { title: "Hungarian", value: "hungarian" },
            { title: "Indian", value: "indian" },
            { title: "Interracial", value: "interracial" },
            { title: "Japanese", value: "japanese" },
            { title: "Latina", value: "latina" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Lingerie", value: "lingerie" },
            { title: "Massage", value: "massage" },
            { title: "Masturbation", value: "masturbation" },
            { title: "Mature", value: "mature" },
            { title: "MILF", value: "milf" },
            { title: "Office", value: "office" },
            { title: "Old & Young", value: "old-and-young" },
            { title: "Orgy", value: "orgy" },
            { title: "Outdoor", value: "outdoor" },
            { title: "Petite", value: "petite" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Pussy Licking", value: "pussy-licking" },
            { title: "Red Head", value: "red-head" },
            { title: "Riding", value: "riding" },
            { title: "Russian", value: "russian" },
            { title: "School Girl", value: "school-girl" },
            { title: "Shemale", value: "shemale" },
            { title: "Skinny", value: "skinny" },
            { title: "Small Tits", value: "small-tits" },
            { title: "Solo", value: "solo" },
            { title: "Squirt", value: "squirt" },
            { title: "Strap On", value: "strap-on" },
            { title: "Swallow", value: "swallow" },
            { title: "Teen", value: "teen" },
            { title: "Threesome", value: "threesome" },
            { title: "Titfuck", value: "titfuck" },
            { title: "Toys", value: "toys" },
            { title: "Uniform", value: "uniform" },
            { title: "Vintage", value: "vintage" },
            { title: "VR", value: "virtual-reality" },
            { title: "Webcam", value: "webcam" },
            { title: "Wife", value: "wife" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchPorntrex",
      title: "搜索PornTrex",
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
const BASE = "https://www.porntrex.com";

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

function getText(html, pattern) {
  const m = pattern.exec(html);
  return m ? m[1].trim() : "";
}

function parseListHtml(html) {
  const items = [];
  const blocks = html.split('<div class="video-preview-screen video-item thumb-item');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const link = getText(block, /href="([^"]+)"/);
    const thumbRaw = getText(block, /data-src="([^"]+)"/);
    const title = getText(block, /alt="([^"]+)"/);
    const duration = getText(block, /durations[^>]*>\s*([^<]+)</);

    if (!link) continue;

    const thumb = thumbRaw ? (thumbRaw.startsWith("http") ? thumbRaw : "https:" + thumbRaw) : "";

    items.push({
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      durationText: duration ? duration.trim() : ""
    });
  }
  return items;
}

// ============================================================
//  列表页加载（最新/评分/热门）
// ============================================================
async function loadLatest(params)    { return loadList("/latest-updates/", params); }
async function loadTopRated(params)  { return loadList("/top-rated/", params); }
async function loadMostPopular(params) { return loadList("/most-popular/", params); }

async function loadList(path, params = {}) {
  try {
    if (params.genreId) return loadCategory({ category: params.genreId });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + path + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[PornTrex loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const category = params.genreId || params.category || params.cat || "";
    if (!category) throw new Error("缺少分类参数");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/categories/" + category + "/" + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[PornTrex loadCategory] 失败:", error.message || error);
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

    const url = BASE + "/search/?q=" + encodeURIComponent(keyword);
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[PornTrex searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const html = await fetchPage(link);

    // 标题（og:title）
    const title = getText(html, /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
    // 缩略图（og:image）
    let thumb = getText(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (thumb && !thumb.startsWith("http")) thumb = "https:" + thumb;

    // 视频地址（从原始 HTML 中提取，避免被 script 移除影响）
    const videoUrls = [];
    const getFileRegex = /https:\/\/www\.porntrex\.com\/get_file\/[^"']+\.mp4\//g;
    let m;
    while ((m = getFileRegex.exec(html)) !== null) {
      videoUrls.push(m[0]);
    }

    // 去重并优先最高画质
    const seen = {};
    let bestUrl = "";
    for (const u of videoUrls) {
      if (seen[u]) continue;
      seen[u] = true;
      if (u.indexOf("1080p") >= 0) { bestUrl = u; break; }
      if (!bestUrl && u.indexOf("720p") >= 0) bestUrl = u;
      if (!bestUrl) bestUrl = u;
    }

    // 分类
    const genreItems = [];
    const catRegex = /<a[^>]*href="(https:\/\/www\.porntrex\.com\/categories\/([^"/]+)\/)"[^>]*>([\s\S]*?)<\/a>/g;
    while ((m = catRegex.exec(html)) !== null) {
      const catName = m[3].replace(/<[^>]+>/g, "").trim();
      if (catName) {
        genreItems.push({ id: m[2], title: catName });
      }
    }

    // 剧照
    const backdropPaths = thumb ? [thumb] : [];

    // 预告片
    const trailers = [];
    if (bestUrl) {
      trailers.push({ url: bestUrl, coverUrl: thumb });
    }

    // 相关推荐
    let relatedItems = [];
    const relStart = html.indexOf('id="list_videos_related_videos"');
    if (relStart >= 0) {
      const relSection = html.substring(relStart, relStart + 15000);
      const relBlocks = relSection.split('<div class="video-preview-screen video-item thumb-item');
      for (let i = 1; i < relBlocks.length; i++) {
        const rb = relBlocks[i];
        const rLink = getText(rb, /href="([^"]+)"/);
        const rThumbRaw = getText(rb, /data-src="([^"]+)"/);
        const rTitle = getText(rb, /alt="([^"]+)"/);
        if (rLink && rTitle) {
          const rThumb = rThumbRaw ? (rThumbRaw.startsWith("http") ? rThumbRaw : "https:" + rThumbRaw) : "";
          relatedItems.push({
            id: rLink,
            type: "url",
            mediaType: "movie",
            title: rTitle,
            link: rLink,
            coverUrl: rThumb,
            posterPath: rThumb,
            backdropPath: rThumb
          });
        }
      }
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
      videoUrl: bestUrl || "",
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers,
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[PornTrex loadDetail] 失败:", error.message || error);
    throw error;
  }
}
