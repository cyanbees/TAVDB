const RESOLVER = "https://4kvm-resolver.1821299140.workers.dev";

WidgetMetadata = {
  id: "4kvm",
  title: "4K影视",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "4K影视 - 高清在线影视资源",
  author: "EL",
  site: "https://www.4kvm.tv",
  icon: "https://4kvm.staticimgjs.org/uploads/2026/03/e8bbe2c53e4567.png",
  detailCacheDuration: 300,
  modules: [
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
    {
      id: "loadHot",
      title: "今日热播",
      functionName: "loadHot",
      cacheDuration: 1800,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadMovie",
      title: "电影",
      functionName: "loadMovie",
      cacheDuration: 1800,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "美国", value: "5" },
            { title: "中国", value: "7" },
            { title: "日本", value: "11" },
            { title: "韩国", value: "12" },
            { title: "中国香港", value: "14" },
            { title: "英国", value: "30" },
            { title: "法国", value: "6" },
            { title: "中国台湾", value: "21" },
            { title: "泰国", value: "33" },
            { title: "印度", value: "34" },
          ],
        },
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "剧情", value: "1" },
            { title: "喜剧", value: "5" },
            { title: "动作", value: "10" },
            { title: "爱情", value: "6" },
            { title: "科幻", value: "14" },
            { title: "恐怖", value: "3" },
            { title: "惊悚", value: "4" },
            { title: "悬疑", value: "2" },
            { title: "犯罪", value: "9" },
            { title: "动画", value: "11" },
            { title: "奇幻", value: "12" },
            { title: "冒险", value: "18" },
            { title: "战争", value: "16" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "1" },
            { title: "2025", value: "3" },
            { title: "2024", value: "4" },
            { title: "2023", value: "56" },
            { title: "2022", value: "13" },
            { title: "2021", value: "2" },
            { title: "2020", value: "6" },
            { title: "2019", value: "8" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "update_time",
          enumOptions: [
            { title: "最新上映", value: "update_time" },
            { title: "最受欢迎", value: "hits" },
            { title: "评分最高", value: "score" },
          ],
        },
      ],
    },
    {
      id: "loadTV",
      title: "电视剧",
      functionName: "loadTV",
      cacheDuration: 1800,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "美国", value: "5" },
            { title: "中国", value: "7" },
            { title: "日本", value: "11" },
            { title: "韩国", value: "12" },
            { title: "中国香港", value: "14" },
            { title: "英国", value: "30" },
            { title: "中国台湾", value: "21" },
            { title: "泰国", value: "33" },
          ],
        },
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "剧情", value: "1" },
            { title: "喜剧", value: "5" },
            { title: "动作", value: "10" },
            { title: "爱情", value: "6" },
            { title: "科幻", value: "14" },
            { title: "悬疑", value: "2" },
            { title: "犯罪", value: "9" },
            { title: "古装", value: "27" },
            { title: "奇幻", value: "12" },
            { title: "家庭", value: "19" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "update_time",
          enumOptions: [
            { title: "最新上映", value: "update_time" },
            { title: "最受欢迎", value: "hits" },
            { title: "评分最高", value: "score" },
          ],
        },
      ],
    },
    {
      id: "loadAnime",
      title: "动漫",
      functionName: "loadAnime",
      cacheDuration: 1800,
      requiresWebView: false,
      sectionMode: false,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "update_time",
          enumOptions: [
            { title: "最新上映", value: "update_time" },
            { title: "最受欢迎", value: "hits" },
            { title: "评分最高", value: "score" },
          ],
        },
      ],
    },
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

const BASE_URL = "https://www.4kvm.tv";

// Parse movie cards from HTML
function parseMovieCards($, selector) {
  const items = [];
  $(selector || ".movie-card").each(function () {
    const $card = $(this);
    const vodId = $card.attr("data-vod-id");
    const $link = $card.find('a[href^="/play/"]').first();
    const href = $link.attr("href") || "";
    const id = vodId || href.replace("/play/", "");
    if (!id) return;

    const title = $card.find("h3").first().text().trim();
    if (!title) return;

    // poster from data-src (lazy loaded)
    const $poster = $card.find('img[data-src]').first();
    const posterPath = $poster.attr("data-src") || "";

    // backdrop from landscape image
    const $backdrop = $card.find('.aspect-video img[data-src]').first();
    const backdropPath = $backdrop.attr("data-src") || "";

    // description
    const description = $card.find("p.text-gray-400").first().text().trim();

    // rating
    const ratingText = $card.find(".text-yellow-500, .text-yellow-400").first().text().trim();
    const rating = parseFloat(ratingText) || undefined;

    items.push({
      id: id,
      type: "url",
      title: title,
      posterPath: posterPath,
      backdropPath: backdropPath,
      description: description || undefined,
      rating: rating,
      link: id,
    });
  });
  return items;
}

// Parse list items from filter/search pages
// Filter page uses .movie-card; search page uses .group.relative with a[href^="/play/"]
function parseFilterCards($) {
  const items = [];
  const seen = {};

  // Strategy: find all links to /play/ and extract card info from parent container
  $('a[href^="/play/"]').each(function () {
    const $link = $(this);
    const href = $link.attr("href") || "";
    const id = href.replace("/play/", "");
    if (!id || seen[id]) return;

    // Find the card container (walk up to find the grid item)
    const $card = $link.closest(".movie-card, .group.relative, [data-vod-id]");
    if (!$card.length) return;
    // Avoid duplicates from same card having multiple <a> tags
    seen[id] = true;

    const title = $card.find("h3").first().text().trim();
    if (!title) return;

    // poster from data-src (lazy loaded)
    const $poster = $card.find('img[data-src]').first();
    const posterPath = $poster.attr("data-src") || "";

    // backdrop from landscape image
    const $backdrop = $card.find('.aspect-video img[data-src]').first();
    const backdropPath = $backdrop.attr("data-src") || "";

    // description - multiple possible selectors
    const description = ($card.find("p.text-gray-400").first().text().trim() ||
      $card.find("p.text-gray-300").first().text().trim());

    // rating
    const ratingText = $card.find(".text-yellow-500, .text-yellow-400").first().text().trim();
    const rating = parseFloat(ratingText) || undefined;

    items.push({
      id: id,
      type: "url",
      title: title,
      posterPath: posterPath,
      backdropPath: backdropPath,
      description: description || undefined,
      rating: rating,
      link: id,
    });
  });
  return items;
}

async function loadHot(params = {}) {
  try {
    const page = Number(params.page || 1);
    const url = BASE_URL + "/filter?sort_by=hits&order=desc&page=" + page;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);
    const items = parseFilterCards($);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadHot] 失败:", error.message || error);
    throw error;
  }
}

async function loadMovie(params = {}) {
  try {
    const page = Number(params.page || 1);
    let url = BASE_URL + "/filter?classify=1&sort_by=" + (params.sort || "update_time") + "&order=desc&page=" + page;
    if (params.area) url += "&areas=" + params.area;
    if (params.genre) url += "&types=" + params.genre;
    if (params.year) url += "&years=" + params.year;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);
    const items = parseFilterCards($);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadMovie] 失败:", error.message || error);
    throw error;
  }
}

async function loadTV(params = {}) {
  try {
    const page = Number(params.page || 1);
    let url = BASE_URL + "/filter?classify=2&sort_by=" + (params.sort || "update_time") + "&order=desc&page=" + page;
    if (params.area) url += "&areas=" + params.area;
    if (params.genre) url += "&types=" + params.genre;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);
    const items = parseFilterCards($);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadTV] 失败:", error.message || error);
    throw error;
  }
}

async function loadAnime(params = {}) {
  try {
    const page = Number(params.page || 1);
    let url = BASE_URL + "/filter?classify=3&sort_by=" + (params.sort || "update_time") + "&order=desc&page=" + page;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);
    const items = parseFilterCards($);
    if (!items.length) throw new Error("未解析到影片");
    return items;
  } catch (error) {
    console.error("[loadAnime] 失败:", error.message || error);
    throw error;
  }
}

async function search(params = {}) {
  try {
    const keyword = params.keyword || "";
    const page = Number(params.page || 1);
    if (!keyword) return [];
    const url = BASE_URL + "/search?q=" + encodeURIComponent(keyword) + "&page=" + page;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);
    const items = parseFilterCards($);
    return items;
  } catch (error) {
    console.error("[search] 失败:", error.message || error);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    if (!link) return null;
    const linkStr = String(link);

    // If link is "play:<vodSlug>:<dataid>" → resolve playback URL
    if (linkStr.startsWith("play:")) {
      const parts = linkStr.split(":");
      const vodSlug = parts[1];
      const dataid = parts[2];
      const resp = await Widget.http.get(RESOLVER + "/resolve?v=" + encodeURIComponent(vodSlug) + "&p=" + encodeURIComponent(dataid));
      const data = resp.data;
      if (data && data.code === 200 && data.data && data.data.quality_urls) {
        const urls = data.data.quality_urls.filter(function (u) { return u.url && u.url !== "1" && !u.locked; });
        const best = urls[0];
        if (best) {
          return {
            id: linkStr,
            type: "url",
            title: "播放",
            videoUrl: best.url,
            link: linkStr,
          };
        }
      }
      return null;
    }

    // Normal detail: vodSlug
    const id = linkStr;
    const url = BASE_URL + "/play/" + id;
    const res = await Widget.http.get(url);
    const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
    const $ = Widget.html.load(html);

    // Title
    const title = $("h1").first().text().trim() || $(".text-white.font-bold").first().text().trim();

    // Poster
    const $poster = $('img[alt="' + title + '"]').filter(function () {
      const src = $(this).attr("src") || $(this).attr("data-src") || "";
      return src.includes("300x") || src.includes("250x") || src.includes("233x");
    }).first();
    const posterPath = $poster.attr("src") || $poster.attr("data-src") || "";

    // Backdrop
    const $backdrop = $('img[alt="' + title + '"]').filter(function () {
      const src = $(this).attr("src") || $(this).attr("data-src") || "";
      return src.includes("original") || src.includes("w1280");
    }).first();
    const backdropPath = $backdrop.attr("src") || $backdrop.attr("data-src") || "";

    // Description
    const description = $(".剧情简介, h2:contains('剧情简介')").next("p").text().trim() ||
      $("p").filter(function () { return $(this).text().length > 50; }).last().text().trim();

    // Rating - find the first .text-yellow-400 that contains a number (skip non-rating yellow elements)
    let rating;
    $(".text-yellow-400").each(function () {
      const txt = $(this).text().trim();
      const num = parseFloat(txt);
      if (num > 0 && num <= 10 && !rating) {
        rating = num;
      }
    });

    // Related items - h2 "相关推荐" -> parent -> next sibling grid
    const relatedItems = [];
    $("h2").each(function () {
      if ($(this).text().includes("相关推荐")) {
        const $grid = $(this).parent().next();
        $grid.find('a[href^="/play/"]').each(function () {
          const href = $(this).attr("href") || "";
          const relId = href.replace("/play/", "");
          const relTitle = $(this).find("h3").first().text().trim();
          const $relImg = $(this).find("img").first();
          const relPoster = $relImg.attr("data-src") || $relImg.attr("src") || "";
          if (relId && relTitle) {
            relatedItems.push({
              id: relId,
              type: "url",
              title: relTitle,
              posterPath: relPoster,
              link: relId,
            });
          }
        });
      }
    });

    // Episodes - extract dataid from handleEpisodeClick calls
    const episodeItems = [];
    const epRegex = /handleEpisodeClick\([^,]+,\s*'(\d+)',\s*(\d+),\s*(\d+)\)/g;
    let epMatch;
    while ((epMatch = epRegex.exec(html)) !== null) {
      const dataid = epMatch[1];
      const line = parseInt(epMatch[2]);
      const episode = parseInt(epMatch[3]);
      episodeItems.push({
        id: "play:" + id + ":" + dataid,
        type: "url",
        title: "第" + episode + "集",
        link: "play:" + id + ":" + dataid,
      });
    }

    const result = {
      id: id,
      type: "url",
      title: title,
      posterPath: posterPath,
      backdropPath: backdropPath,
      description: description || undefined,
      rating: rating,
      link: id,
    };

    if (relatedItems.length > 0) result.relatedItems = relatedItems;
    if (episodeItems.length > 1) result.episodeItems = episodeItems;
    if (backdropPath) result.backdropPaths = [backdropPath];

    // For single-episode content (movies), resolve play URL directly
    if (episodeItems.length === 1) {
      try {
        const dataid = episodeItems[0].link.split(":")[2];
        const resp = await Widget.http.get(RESOLVER + "/resolve?v=" + encodeURIComponent(id) + "&p=" + encodeURIComponent(dataid));
        const pdata = resp.data;
        if (pdata && pdata.code === 200 && pdata.data && pdata.data.quality_urls) {
          const urls = pdata.data.quality_urls.filter(function (u) { return u.url && u.url !== "1" && !u.locked; });
          if (urls[0]) result.videoUrl = RESOLVER + "/m3u8?url=" + encodeURIComponent(urls[0].url);
        }
      } catch (e) { /* ignore play resolve errors */ }
    }

    return result;
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    return null;
  }
}

async function loadResource(params) {
  // Mode 1: direct play link (from our own detail page)
  const link = params.link || params.videoId || "";
  if (link && link.startsWith("play:")) {
    return await resolvePlayLink(link);
  }

  // Mode 2: tmdbId-based lookup (aggregated search)
  const tmdbId = params.tmdbId;
  if (!tmdbId) return [];

  try {
    // Get movie/tv title from TMDB
    const mediaType = params.type === "tv" ? "tv" : "movie";
    const tmdbRes = await Widget.tmdb.get(mediaType + "/" + tmdbId, { params: { language: "zh-CN" } });
    const title = tmdbRes.title || tmdbRes.name || "";
    if (!title) return [];

    // Search 4kvm for this title
    const searchUrl = BASE_URL + "/search?q=" + encodeURIComponent(title);
    const searchRes = await Widget.http.get(searchUrl);
    const searchHtml = typeof searchRes.data === "string" ? searchRes.data : "";
    if (!searchHtml) return [];
    const $ = Widget.html.load(searchHtml);
    const items = parseFilterCards($);
    if (!items.length) return [];

    // Pick best match (exact title match preferred)
    let match = items.find(function (i) { return i.title === title; });
    if (!match) match = items.find(function (i) { return i.title.includes(title) || title.includes(i.title); });
    if (!match) match = items[0];

    // Fetch detail page to get episodes
    const detailUrl = BASE_URL + "/play/" + match.link;
    const detailRes = await Widget.http.get(detailUrl);
    const detailHtml = typeof detailRes.data === "string" ? detailRes.data : "";
    if (!detailHtml) return [];

    // Extract episodes
    const epRegex = /handleEpisodeClick\([^,]+,\s*'(\d+)',\s*(\d+),\s*(\d+)\)/g;
    const episodes = [];
    let m;
    while ((m = epRegex.exec(detailHtml)) !== null) {
      episodes.push({ dataid: m[1], line: parseInt(m[2]), episode: parseInt(m[3]) });
    }
    if (!episodes.length) return [];

    // For TV: pick the right episode; for movie: pick first
    let target = episodes[0];
    if (mediaType === "tv" && params.episode) {
      const epNum = parseInt(params.episode);
      const found = episodes.find(function (e) { return e.episode === epNum; });
      if (found) target = found;
    }

    // Resolve play URL
    return await resolvePlayLink("play:" + match.link + ":" + target.dataid);
  } catch (e) {
    console.error("[loadResource] tmdb lookup failed:", e.message || e);
    return [];
  }
}

async function resolvePlayLink(link) {
  var parts = link.split(":");
  var vodSlug = parts[1];
  var dataid = parts[2];
  if (!vodSlug || !dataid) return [];

  try {
    var resp = await Widget.http.get(RESOLVER + "/resolve?v=" + encodeURIComponent(vodSlug) + "&p=" + encodeURIComponent(dataid));
    var data = resp.data;
    if (data && data.code === 200 && data.data && data.data.quality_urls) {
      return data.data.quality_urls
        .filter(function (u) { return u.url && u.url !== "1" && !u.locked; })
        .map(function (u) {
          // Proxy m3u8 through worker to strip PNG headers from TS segments
          var proxiedUrl = RESOLVER + "/m3u8?url=" + encodeURIComponent(u.url);
          return {
            name: u.title || u.description || "默认",
            description: u.description || u.title || "",
            url: proxiedUrl,
          };
        });
    }
  } catch (e) {
    console.error("[resolvePlayLink] 失败:", e.message || e);
  }
  return [];
}
