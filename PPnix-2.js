// @name PPnix ForwardWidget
// @description PPnix 影视模块 (ForwardWidget 版) — 支持电影/电视剧分类浏览、搜索、详情播放
// @version 1.0.0
// @site https://www.ppnix.com

WidgetMetadata = {
  id: "ppnix.widget",
  title: "PPnix",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "PPnix 影视 — 电影/电视剧分类浏览与搜索（内置 CF Worker 代理，无需 Cookie）",
  author: "Spider",
  site: "https://github.com",
  detailCacheDuration: 60,

  globalParams: [
    {
      name: "host",
      title: "PPnix 域名",
      type: "input",
      value: "https://bitter-wildflower-8818.wuqingfeng1992.workers.dev",
    },
    {
      name: "langPath",
      title: "语言路径",
      type: "enumeration",
      value: "/cn",
      enumOptions: [
        { title: "中文", value: "/cn" },
        { title: "默认", value: "" },
      ],
    },
  ],

  search: {
    title: "搜索",
    functionName: "searchPpnix",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" },
    ],
  },

  modules: [
    {
      id: "ppnix_movie",
      title: "电影",
      functionName: "loadMovieList",
      cacheDuration: 3600,
      params: [
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "动作", value: "动作" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "科幻", value: "科幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "剧情", value: "剧情" },
            { title: "动画", value: "动画" },
            { title: "纪录片", value: "纪录片" },
          ],
        },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "大陆" },
            { title: "香港", value: "香港" },
            { title: "台湾", value: "台湾" },
            { title: "美国", value: "美国" },
            { title: "日本", value: "日本" },
            { title: "韩国", value: "韩国" },
            { title: "英国", value: "英国" },
            { title: "法国", value: "法国" },
            { title: "泰国", value: "泰国" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "newstime",
          enumOptions: [
            { title: "最新", value: "newstime" },
            { title: "最热", value: "onclick" },
            { title: "评分", value: "rating" },
          ],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "ppnix_tv",
      title: "电视剧",
      functionName: "loadTvList",
      cacheDuration: 3600,
      params: [
        {
          name: "genre",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "剧情", value: "剧情" },
            { title: "爱情", value: "爱情" },
            { title: "古装", value: "古装" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "动作", value: "动作" },
            { title: "喜剧", value: "喜剧" },
          ],
        },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "大陆" },
            { title: "香港", value: "香港" },
            { title: "台湾", value: "台湾" },
            { title: "美国", value: "美国" },
            { title: "日本", value: "日本" },
            { title: "韩国", value: "韩国" },
            { title: "英国", value: "英国" },
            { title: "泰国", value: "泰国" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "newstime",
          enumOptions: [
            { title: "最新", value: "newstime" },
            { title: "最热", value: "onclick" },
            { title: "评分", value: "rating" },
          ],
        },
        { name: "page", title: "页码", type: "page" },
      ],
    },
    {
      id: "loadResource",
      title: "PPnix 聚合",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: [],
    },
  ],
};

// ==================== 常量 ====================

const PPNIX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36";

const SORT_MAP = {
  newstime: "newstime",
  onclick: "onclick",
  rating: "rating",
};

// ==================== 工具函数 ====================

function ppnixText(v) {
  return String(v == null ? "" : v).trim();
}

function ppnixHost(params) {
  return ppnixText(params.host || "https://www.ppnix.com").replace(/\/$/, "");
}

function ppnixLangPath(params) {
  const p = ppnixText(params.langPath || "/cn");
  if (!p) return "/cn";
  return p.startsWith("/") ? p : "/" + p;
}

function ppnixHeaders() {
  return {
    "User-Agent": PPNIX_UA,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };
}

function ppnixJoinUrl(host, path) {
  const p = ppnixText(path);
  if (!p) return host + "/";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return host + p;
  return host + "/" + p;
}

function ppnixFixImage(host, url) {
  const u = ppnixText(url);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return host + u;
  return host + "/" + u;
}

// ==================== 列表解析 ====================

function ppnixParseList(host, html) {
  if (!html) return [];
  if (html.includes("Just a moment") || html.includes("cf-browser-verification")) {
    return [];
  }

  const $ = Widget.html.load(html);
  const results = [];
  const seen = new Set();

  // PPnix 列表项选择器 — 兼容常见结构
  $("ul.lists-content li, .lists-content ul li, .lists .lists-content ul li").each((_, el) => {
    const $el = $(el);
    const $a = $el.find("a.thumbnail, h2 a, a").first();
    const href = ppnixText($a.attr("href") || $el.find("h2 a").attr("href") || "");
    if (!href || seen.has(href)) return;
    seen.add(href);

    const vodName = ppnixText(
      $el.find("img.thumb").attr("alt") ||
        $el.find("h2 a").text() ||
        $a.text()
    );
    if (!vodName) return;

    const vodPic = ppnixFixImage(
      host,
      $el.find("img.thumb").attr("src") ||
        $el.find("img.thumb").attr("data-src") ||
        ""
    );
    const remarks = ppnixText(
      $el.find("footer .rate").text() || $el.find("footer").text()
    );

    results.push({
      id: href,
      type: "url",
      title: vodName,
      coverUrl: vodPic,
      posterPath: vodPic,
      description: remarks,
      link: href,
    });
  });

  if (results.length === 0) {
    return [];
  }
  return results;
}

// ==================== 分类列表请求 ====================

async function ppnixFetchList(params, categoryId) {
  const host = ppnixHost(params);
  const langPath = ppnixLangPath(params);
  const page = parseInt(params.page || 1, 10) || 1;
  const genre = ppnixText(params.genre || "");
  const area = ppnixText(params.area || "");
  const year = ppnixText(params.year || "");
  const sort = SORT_MAP[ppnixText(params.sort || "newstime")] || "newstime";

  // PPnix 分类 URL 格式: /cn/movie/类型-地区-年份-page-排序.html
  // page 参数: 第1页为空(0), 第N页为 N-1
  const pagePart = page <= 1 ? "0" : String(page - 1);
  const path = `${langPath}/${categoryId}/${genre}-${area}-${year}-${pagePart}-${sort}.html`;
  const url = ppnixJoinUrl(host, path);

  console.log("[PPnix] fetchList:", url);

  try {
    const res = await Widget.http.get(url, { headers: ppnixHeaders(params), timeout: 8000 });
  return ppnixParseList(host, res.data);
  } catch (e) {
    console.error("[PPnix] fetchList error:", e.message || e);
    throw e;
  }
}

// ==================== 模块入口函数 ====================

async function loadMovieList(params = {}) {
  return ppnixFetchList(params, "movie");
}

async function loadTvList(params = {}) {
  return ppnixFetchList(params, "tv");
}

// ==================== 搜索 ====================

async function searchPpnix(params = {}) {
  const keyword = ppnixText(params.keyword || "");
  if (!keyword) {
    return [{ id: "tip", type: "text", title: "请输入关键词开始搜索" }];  }

  const host = ppnixHost(params);
  const langPath = ppnixLangPath(params);
  const page = parseInt(params.page || 1, 10) || 1;

  const encoded = encodeURIComponent(keyword);
  const pageSuffix = page <= 1 ? "" : `-page-${page}`;
  const path = `${langPath}/search/${encoded}--.html${pageSuffix}`;
  const url = ppnixJoinUrl(host, path);

  console.log("[PPnix] search:", url);

  try {
    const res = await Widget.http.get(url, { headers: ppnixHeaders(params), timeout: 8000 });
    return ppnixParseList(host, res.data);
  } catch (e) {
    console.error("[PPnix] search error:", e.message || e);
    throw e;
  }
}

// ==================== 详情 ====================
// link 格式：原始 href，如 /cn/movie/12345.html
// 也兼容 globalParams 中的 host 通过 params 注入
// 注意: ForwardWidget 的 loadDetail 接收的是 link 字符串，不是 params 对象
// 但 globalParams 无法直接注入，所以把 host 编码进 link

async function loadDetail(link) {
  // link 可能是:
  //   1. 原始路径 "/cn/movie/12345.html"  (旧版兼容)
  //   2. 完整 URL "https://www.ppnix.com/cn/movie/12345.html"
  //   3. 自定义协议 "ppnix://https://www.ppnix.com|/cn/movie/12345.html"

  let resolvedUrl = "";
  const linkStr = ppnixText(link);

  if (linkStr.startsWith("ppnix://")) {
    // 格式: ppnix://<host>|<path>
    const inner = linkStr.slice("ppnix://".length);
    const sep = inner.indexOf("|");
    if (sep !== -1) {
      const host = inner.slice(0, sep);
      const path = inner.slice(sep + 1);
      resolvedUrl = ppnixJoinUrl(host, path);
    } else {
      resolvedUrl = inner; // fallback
    }
  } else if (/^https?:\/\//i.test(linkStr)) {
    resolvedUrl = linkStr;
  } else {
    // 裸路径，用默认 host
    resolvedUrl = "https://www.ppnix.com" + (linkStr.startsWith("/") ? linkStr : "/" + linkStr);
  }

  console.log("[PPnix] loadDetail:", resolvedUrl);

  // 从 URL 推断 host
  const hostMatch = resolvedUrl.match(/^(https?:\/\/[^/]+)/i);
  const host = hostMatch ? hostMatch[1] : "https://www.ppnix.com";
  const referer = host + "/cn/";

  const headers = {
    "User-Agent": PPNIX_UA,
    Referer: referer,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };

  try {
    const res = await Widget.http.get(resolvedUrl, { headers, timeout: 8000 });
    const html = ppnixText(res.data);
    const $ = Widget.html.load(html);

    // 标题
    const titleRaw = ppnixText($("h1.product-title").text());
    const vodName =
      titleRaw.replace(/\s*\([^)]*\)\s*$/, "").trim() ||
      ppnixText($("title").text()).replace(/\s*\([^)]*\).*/, "");

    // 封面
    const vodPic = ppnixFixImage(
      host,
      $("header.product-header img.thumb").attr("src") || ""
    );

    // 简介
    const vodContent = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("简介:"))
        .text()
    ).replace(/^简介:/, "");

    // 导演 / 主演
    const vodDirector = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("导演:"))
        .find("span")
        .text()
    );
    const vodActor = ppnixText(
      $(".product-excerpt")
        .filter((_, el) => $(el).text().includes("主演:"))
        .find("span")
        .text()
    ).replace(/\s*\/\s*/g, ", ");

    // 年份
    const vodYear =
      (titleRaw.match(/\((\d{4})\)/) || [])[1] || "";

    // 演员列表 → peoples
    const peoples = [];
    if (vodActor) {
      vodActor.split(",").forEach((name, i) => {
        const n = ppnixText(name);
        if (n) peoples.push({ id: "actor_" + i, title: n, role: "主演" });
      });
    }
    if (vodDirector) {
      peoples.unshift({ id: "director_0", title: vodDirector, role: "导演" });
    }

    // 解析 m3u8 列表 (PPnix 原版逻辑: m3u8 = ['...','...'])
    const infoIdMatch = html.match(/infoid\s*=\s*(\d+)/);
    const infoId = infoIdMatch ? infoIdMatch[1] : "";
    const m3u8Match = html.match(/m3u8\s*=\s*\[(.*?)\]/s);
    const episodeParams = [];
    if (m3u8Match) {
      const re = /'([^']*)'|"([^"]*)"/g;
      let mm;
      while ((mm = re.exec(m3u8Match[1])) !== null) {
        const v = ppnixText(mm[1] || mm[2] || "");
        if (v) episodeParams.push(v);
      }
    }

    // ── 判断 m3u8 值是画质标签还是剧集编号 ──
    // 画质标签: 1080P, 4K, 720P, 2K, HD, SD ...
    const isResolutionLabel =
      episodeParams.length > 0 &&
      episodeParams.every(function (p) {
        return /^(1080[PpIi]|[48][KkHh]|720[PpIi]|2160[PpIi]|2[Kk]|UHD|FHD|HD|SD)$/i.test(p);
      });

    let episodeItems, mediaType, videoUrl;

    if (isResolutionLabel) {
      // ── 画质选项模式 ──
      episodeItems = episodeParams.map(function (param, idx) {
        var m3u8Url = infoId
          ? host + "/info/m3u8/" + infoId + "/" + encodeURIComponent(param) + ".m3u8"
          : param;
        return {
          id: linkStr + "_q_" + idx,
          type: "url",
          title: param,
          videoUrl: m3u8Url,
          mediaType: "movie",
          customHeaders: {
            Referer: resolvedUrl,
            Origin: host,
            "User-Agent": PPNIX_UA,
          },
        };
      });
      mediaType = "movie";
      // 默认取最高画质（数组最后一个通常是最高）
      videoUrl = episodeItems.length > 0
        ? episodeItems[episodeItems.length - 1].videoUrl
        : null;
    } else {
      // ── 剧集编号模式 ──
      var isMovie =
        episodeParams.length === 1 &&
        !episodeParams[0].match(/第\d+集/) &&
        episodeParams[0].indexOf("集") === -1;

      episodeItems = episodeParams.map(function (param, idx) {
        var epTitle = isMovie
          ? vodName
          : vodName + " 第" + (idx + 1) + "集";
        var m3u8Url = infoId
          ? host + "/info/m3u8/" + infoId + "/" + encodeURIComponent(param) + ".m3u8"
          : param;
        return {
          id: linkStr + "_ep_" + idx,
          type: "url",
          title: epTitle,
          videoUrl: m3u8Url,
          mediaType: isMovie ? "movie" : "tv",
          customHeaders: {
            Referer: resolvedUrl,
            Origin: host,
            "User-Agent": PPNIX_UA,
          },
        };
      });
      mediaType = isMovie ? "movie" : "tv";
      videoUrl = isMovie && episodeItems.length > 0
        ? episodeItems[0].videoUrl
        : null;
    }

    var showEpisodeItems = isResolutionLabel
      ? episodeItems.length > 1      // 多画质时展示选择
      : mediaType === "tv";          // 电视剧展示剧集

    return {
      id: linkStr,
      type: "url",
      title: vodName,
      description: vodContent,
      posterPath: vodPic,
      backdropPath: vodPic,
      releaseDate: vodYear,
      mediaType: mediaType,
      peoples: peoples,
      videoUrl: videoUrl || undefined,
      episodeItems: showEpisodeItems ? episodeItems : [],
      customHeaders: {
        Referer: resolvedUrl,
        Origin: host,
        "User-Agent": PPNIX_UA,
      },
    };
  } catch (e) {
    console.error("[PPnix] loadDetail error:", e.message || e);
    return null;
  }
}
// ==================== 聚合 (loadResource) ====================

function ppnixStripMeta(title) {
  const t = String(title || "");
  return t
    .replace(/[\(（\[].*?[\)）\]]/g, "")
    .replace(/第[\d一二三四五六七八九十]+[季集话期]/g, "")
    .replace(/\bseason\s*\d+/ig, "")
    .replace(/\bs\d{1,2}\b/ig, "")
    .trim();
}

function ppnixNormalizeForMatch(title) {
  return String(title || "")
    .replace(/[\s・\-\.!?\/]/g, "")
    .toLowerCase();
}

function ppnixMatchScore(normSearch, normItem) {
  if (!normSearch || !normItem) return 0;
  if (normItem === normSearch) return 100;
  if (normItem.indexOf(normSearch) !== -1 || normSearch.indexOf(normItem) !== -1) return 75;
  let count = 0;
  for (let i = 0; i < normSearch.length; i++) {
    if (normItem.indexOf(normSearch[i]) !== -1) count++;
  }
  return Math.round((count / normSearch.length) * 40);
}

function ppnixExtractPlayResources(host, detailUrl, vodName, html, isMovie, targetEpisode) {
  if (!html) return [];

  const infoIdMatch = html.match(/infoid\s*=\s*(\d+)/);
  const infoId = infoIdMatch ? infoIdMatch[1] : "";
  const m3u8Match = html.match(/m3u8\s*=\s*\[(.*?)\]/s);
  if (!m3u8Match) return [];

  const episodeParams = [];
  const re = /'([^']*)'|"([^"]*)"/g;
  let mm;
  while ((mm = re.exec(m3u8Match[1])) !== null) {
    const v = ppnixText(mm[1] || mm[2] || "");
    if (v) episodeParams.push(v);
  }
  if (!episodeParams.length) return [];

  // 判断是画质标签还是剧集编号
  var isResLabels =
    episodeParams.length > 0 &&
    episodeParams.every(function (p) {
      return /^(1080[PpIi]|[48][KkHh]|720[PpIi]|2160[PpIi]|2[Kk]|UHD|FHD|HD|SD)$/i.test(p);
    });

  var resources = [];

  if (isResLabels) {
    // ── 画质选项 ──
    for (var ri = 0; ri < episodeParams.length; ri++) {
      var param = episodeParams[ri];
      var m3u8Url = infoId
        ? host + "/info/m3u8/" + infoId + "/" + encodeURIComponent(param) + ".m3u8"
        : param;
      resources.push({
        name: "PPnix [" + param + "]",
        description: vodName + " [" + param + "]",
        url: m3u8Url,
        customHeaders: {
          Referer: detailUrl,
          Origin: host,
          "User-Agent": PPNIX_UA,
        },
      });
    }
  } else {
    // ── 剧集编号 ──
    var isSingleEp =
      episodeParams.length === 1 &&
      !episodeParams[0].match(/第\d+[集话]/) &&
      episodeParams[0].indexOf("集") === -1;

    if (isSingleEp || isMovie) {
      var param = episodeParams[0];
      var m3u8Url = infoId
        ? host + "/info/m3u8/" + infoId + "/" + encodeURIComponent(param) + ".m3u8"
        : param;
      resources.push({
        name: "PPnix",
        description: vodName + " [正片]",
        url: m3u8Url,
        customHeaders: {
          Referer: detailUrl,
          Origin: host,
          "User-Agent": PPNIX_UA,
        },
      });
    } else {
      var epIdx = 1;
      for (var ei = 0; ei < episodeParams.length; ei++) {
        var epNo = epIdx;
        epIdx++;
        if (targetEpisode && epNo !== targetEpisode) continue;
        var param2 = episodeParams[ei];
        var m3u8Url2 = infoId
          ? host + "/info/m3u8/" + infoId + "/" + encodeURIComponent(param2) + ".m3u8"
          : param2;
        resources.push({
          name: "PPnix",
          description: vodName + " 第" + epNo + "集",
          url: m3u8Url2,
          customHeaders: {
            Referer: detailUrl,
            Origin: host,
            "User-Agent": PPNIX_UA,
          },
        });
      }
    }
  }

  return resources;
}

async function loadResource(params = {}) {
  const seriesName =
    ppnixText(params.seriesName || params.title || "");
  if (!seriesName) {
    console.log("[PPnix] loadResource: 缺少片名");
    return [];
  }

  const type = ppnixText(params.type || "");
  const isMovie = type === "movie";
  const targetEpisode = parseInt(params.episode || params.season || 0, 10) || 0;

  const host = ppnixHost(params);
  const langPath = ppnixLangPath(params);

  console.log(
    "[PPnix] loadResource: 搜索=" + seriesName + ", type=" + type +
    ", ep=" + targetEpisode
  );

  // 1. Search PPnix
  const encoded = encodeURIComponent(seriesName);
  const searchUrl = ppnixJoinUrl(
    host,
    langPath + "/search/" + encoded + "--.html"
  );

  let res;
  try {
    res = await Widget.http.get(searchUrl, { headers: ppnixHeaders(params), timeout: 8000 });
  } catch (e) {
    console.error("[PPnix] loadResource search error:", e.message || e);
    return [];
  }

  const html = ppnixText(res && res.data);
  if (!html || html.includes("Just a moment") || html.includes("cf-browser-verification")) {
    console.log("[PPnix] loadResource: 页面被拦截或无数据");
    return [];
  }

  const $ = Widget.html.load(html);

  // 2. Parse search results
  const candidates = [];
  $("ul.lists-content li, .lists-content ul li, .lists .lists-content ul li").each(
    (_, el) => {
      const $el = $(el);
      const $a = $el.find("a.thumbnail, h2 a, a").first();
      const href = ppnixText(
        $a.attr("href") || $el.find("h2 a").attr("href") || ""
      );
      const vodName = ppnixText(
        $el.find("img.thumb").attr("alt") ||
          $el.find("h2 a").text() ||
          $a.text()
      );
      if (href && vodName) {
        candidates.push({ href: href, title: vodName });
      }
    }
  );

  if (!candidates.length) {
    console.log("[PPnix] loadResource: 搜索结果为空");
    return [];
  }

  // 3. Title matching (similar to ddys/荐片)
  const baseTitle = ppnixStripMeta(seriesName) || seriesName;
  const normSearch = ppnixNormalizeForMatch(baseTitle);

  let bestMatch = null;
  let bestScore = 0;
  for (const c of candidates) {
    const cleanTitle = ppnixStripMeta(c.title);
    const normItem = ppnixNormalizeForMatch(cleanTitle);
    const score = ppnixMatchScore(normSearch, normItem);
    const baseScore = ppnixMatchScore(
      normSearch,
      ppnixNormalizeForMatch(c.title)
    );
    const finalScore = Math.max(score, baseScore);
    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMatch = c;
    }
  }

  if (!bestMatch || bestScore < 30) {
    console.log(
      "[PPnix] loadResource: 匹配度不足 (bestScore=" + bestScore + ")"
    );
    return [];
  }

  console.log(
    "[PPnix] loadResource: 匹配到 " +
      bestMatch.title +
      " (score=" +
      bestScore +
      ")"
  );

  // 4. Fetch detail page
  const detailUrl = ppnixJoinUrl(host, bestMatch.href);
  let detailHtml;
  try {
    const detailRes = await Widget.http.get(detailUrl, {
      headers: ppnixHeaders(params), timeout: 8000
    });
    detailHtml = ppnixText(detailRes && detailRes.data);
  } catch (e) {
    console.error("[PPnix] loadResource detail error:", e.message || e);
    return [];
  }

  if (!detailHtml) {
    console.log("[PPnix] loadResource: 详情页为空");
    return [];
  }

  // 5. Extract play resources from m3u8
  const playResources = ppnixExtractPlayResources(
    host,
    detailUrl,
    bestMatch.title,
    detailHtml,
    isMovie,
    targetEpisode
  );

  console.log(
    "[PPnix] loadResource: 返回 " + playResources.length + " 个播放源"
  );

  return playResources;
}
