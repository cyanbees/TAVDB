// ============================================================
//  YouPorn — 视频列表、详情与搜索模块
//  源站: https://www.youporn.com
//  HTML 静态渲染 + HLS 视频流
// ============================================================

WidgetMetadata = {
  id: "forward.youporn",
  title: "YouPorn",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "YouPorn — 高清色情视频 Tube 站",
  author: "EL",
  site: "https://www.youporn.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "recommended",
      title: "推荐视频",
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
      id: "topRated",
      title: "最高评分",
      functionName: "loadTopRated",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "mostViewed",
      title: "最多观看",
      functionName: "loadMostViewed",
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
          value: "asian",
          enumOptions: [
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Asian", value: "asian" },
            { title: "BBW", value: "bbw" },
            { title: "Big Ass", value: "bigass" },
            { title: "Big Dick", value: "bigdick" },
            { title: "Big Tits", value: "bigtits" },
            { title: "Blonde", value: "blonde" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Bondage", value: "bondage" },
            { title: "Brunette", value: "brunette" },
            { title: "College (18+)", value: "college" },
            { title: "Cosplay", value: "cosplay" },
            { title: "Creampie", value: "creampie" },
            { title: "Cumshot", value: "cumshot" },
            { title: "Double Penetration", value: "doublepenetration" },
            { title: "Ebony", value: "ebony" },
            { title: "Fetish", value: "fetish" },
            { title: "Gangbang", value: "gangbang" },
            { title: "Group", value: "group" },
            { title: "Hentai", value: "hentai" },
            { title: "Indian", value: "indian" },
            { title: "Interracial", value: "interracial" },
            { title: "Japanese", value: "japanese" },
            { title: "Latina", value: "latina" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Massage", value: "massage" },
            { title: "Masturbation", value: "masturbation" },
            { title: "Mature", value: "mature" },
            { title: "MILF", value: "milf" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Redhead", value: "redhead" },
            { title: "Squirting", value: "squirting" },
            { title: "Step Fantasy", value: "stepfantasy" },
            { title: "Teen (18-25)", value: "teens" },
            { title: "Threesome", value: "threesome" },
            { title: "Transgender", value: "transgender" },
            { title: "Verified Amateurs", value: "verifiedamateurs" },
            { title: "Vintage", value: "vintage" }
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
const BASE_URL = "https://www.youporn.com";
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
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/");
}

/**
 * 从 HTML 解析视频列表
 * 分步提取避免大正则回溯超时
 */
function parseVideoList(html) {
  const items = [];
  let searchStart = 0;

  while (true) {
    // 找到下一个 video-box article 的起始位置
    const articleStart = html.indexOf('<article class="video-box', searchStart);
    if (articleStart === -1) break;

    // 找到闭合的 </article>
    const articleEnd = html.indexOf('</article>', articleStart);
    if (articleEnd === -1) break;

    const block = html.substring(articleStart, articleEnd + 10);
    searchStart = articleEnd + 10;

    // 提取 data-video-id
    const idMatch = block.match(/data-video-id="([^"]*)"/);
    if (!idMatch) continue;
    const id = idMatch[1].trim();

    // 提取 aria-label（标题）
    const labelMatch = block.match(/aria-label="([^"]*)"/);
    if (!labelMatch) continue;
    const title = decodeHtml(labelMatch[1].trim()).substring(0, 120);

    // 提取 watch 链接
    const linkMatch = block.match(/href="(\/watch\/[^"]+)"/);
    if (!linkMatch) continue;
    const link = linkMatch[1];

    // 提取缩略图 data-src
    const thumbMatch = block.match(/data-src="([^"]+)"/);
    if (!thumbMatch) continue;
    const thumb = thumbMatch[1];

    // 提取时长
    const durMatch = block.match(/video-duration[^>]*>[\s\S]{0,60}?<span[^>]*>([^<]+)<\/span>/);
    const duration = durMatch ? durMatch[1].trim() : "";

    // 提取上传者
    const uploaderMatch = block.match(/author-title-text[^"]*"[^>]*>([^<]+)<\/a>/);
    const uploader = uploaderMatch ? uploaderMatch[1].trim() : "";

    // 提取观看次数
    const viewsMatch = block.match(/(?:icon-pink-eye|icon-eye)[\s\S]{0,60}?info-views[^>]*>([^<]+)<\/span>/);
    const views = viewsMatch ? viewsMatch[1].trim() : "";

    // 提取点赞（百分比）
    const likeMatch = block.match(/(?:icon-pink-thumb-up|icon-thumb-up)[\s\S]{0,60}?info-views[^>]*>([^<]+)<\/span>/);
    const ratingRaw = likeMatch ? likeMatch[1].trim().replace("%", "") : "0";
    const rating = parseInt(ratingRaw) / 10 || 0;

    items.push({
      id: id,
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
//  loadRecommended / loadNewest / loadTopRated / loadMostViewed
// ============================================================
async function loadRecommended(params) { return loadList("/", params); }
async function loadNewest(params)      { return loadList("/browse/time/", params); }
async function loadTopRated(params)    { return loadList("/top_rated/", params); }
async function loadMostViewed(params)  { return loadList("/most_viewed/", params); }

/**
 * 通用列表加载
 */
async function loadList(path, params = {}) {
  try {
    if (params.genreId) return loadCategory({ category: params.genreId });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const pageUrl = page > 1 ? path + "?page=" + page : path;
    const fullUrl = BASE_URL + pageUrl;
    const html = await fetchPage(fullUrl);
    const items = parseVideoList(html);
    return items;
  } catch (error) {
    console.error("[YouPorn loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params = {}) {
  try {
    if (params.genreId) params.category = params.genreId;
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const category = (params.category || "asian").trim();
    const page = Math.max(1, Number(params.page) || 1);
    const pageUrl = page > 1 ? "/category/" + encodeURIComponent(category) + "/?page=" + page : "/category/" + encodeURIComponent(category) + "/";
    const html = await fetchPage(BASE_URL + pageUrl);
    const items = parseVideoList(html);
    return items;
  } catch (error) {
    console.error("[YouPorn loadCategory] 失败:", error.message || error);
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
    const pageUrl = page > 1 ? "/search/?query=" + encodeURIComponent(keyword) + "&page=" + page : "/search/?query=" + encodeURIComponent(keyword);
    const html = await fetchPage(BASE_URL + pageUrl);
    const items = parseVideoList(html);
    return items;
  } catch (error) {
    console.error("[YouPorn searchVideos] 失败:", error.message || error);
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

    // 从 mediaDefinitions 提取视频地址（HLS 优先，MP4 兜底）
    let videoUrl = "";
    const mdMatch = html.match(/mediaDefinitions":\s*\[([\s\S]*?)\]/);
    if (mdMatch) {
      // 尝试 HLS，没有则用 MP4
      let proxyUrl = "";
      const hlsEntry = mdMatch[1].match(/"format":\s*"hls"[^}]*"videoUrl":\s*"([^"]+)"/);
      if (hlsEntry) {
        proxyUrl = hlsEntry[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
      } else {
        const mp4Entry = mdMatch[1].match(/"format":\s*"mp4"[^}]*"videoUrl":\s*"([^"]+)"/);
        if (mp4Entry) {
          proxyUrl = mp4Entry[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
        }
      }

      if (proxyUrl) {
        // 请求代理获取真实播放地址
        try {
          const proxyResp = await Widget.http.get(proxyUrl, {
            headers: { "User-Agent": REQUEST_HEADERS["User-Agent"], "Referer": url }
          });
          if (proxyResp && proxyResp.data) {
            const qualities = typeof proxyResp.data === "string" ? JSON.parse(proxyResp.data) : proxyResp.data;
            if (Array.isArray(qualities) && qualities.length > 0) {
              // 选最高画质
              let best = qualities[0];
              for (let i = 1; i < qualities.length; i++) {
                const q = qualities[i];
                const curH = parseInt(q.height) || parseInt(q.quality) || 0;
                const bestH = parseInt(best.height) || parseInt(best.quality) || 0;
                if (curH > bestH) best = q;
              }
              if (best.videoUrl) {
                videoUrl = best.videoUrl.replace(/\\\//g, "/").replace(/\\u0026/g, "&");
              }
            }
          }
        } catch (e) {
          // 代理请求失败时直接使用代理地址
          videoUrl = proxyUrl;
        }
      }
    }

    // 标题
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? decodeHtml(titleMatch[1].trim()).substring(0, 120) : "未知标题";

    // 缩略图：优先用 JSON-LD thumbnailUrl，其次 og:image
    let thumb = "";
    const ldThumbMatch = html.match(/"thumbnailUrl"\s*:\s*"([^"]+)"/);
    if (ldThumbMatch) {
      thumb = ldThumbMatch[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
    }
    if (!thumb) {
      const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
      if (ogMatch) {
        thumb = ogMatch[1];
      }
    }

    // 分类
    const genreItems = [];
    const catRegex = /<a[^>]*href="\/category\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(html)) !== null) {
      const slug = catMatch[1].replace(/\/$/, "");
      const name = catMatch[2].trim();
      if (name !== "More") {
        genreItems.push({ id: slug, title: name });
      }
    }

    // 演员（pornstar + uploader）
    const peoples = [];
    const starRegex = /<a[^>]*href="\/pornstar\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let starMatch;
    while ((starMatch = starRegex.exec(html)) !== null) {
      const starSlug = starMatch[1].replace(/\/$/, "");
      const starName = starMatch[2].trim();
      peoples.push({ id: starSlug, title: starName });
    }
    // 添加上传者
    const uploaderMatch = html.match(/data-uploader-name="([^"]+)"/);
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

    // 相关推荐（重用 parseVideoList 从详情页提取）
    const relatedItems = parseVideoList(html)
      .filter(function(r) { return r.link !== link; })
      .slice(0, 10);

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
      trailers: trailers,
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[YouPorn loadDetail] 失败:", error.message || error);
    throw error;
  }
}
