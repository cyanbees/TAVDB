// ============================================================
//  Twitter 成人视频排行榜 — 视频列表、详情与搜索模块
//  源站: https://twitter-ero-video-ranking.com
//  API JSON
// ============================================================

WidgetMetadata = {
  id: "forward.twitter-ero-video-ranking",
  title: "Twitter 成人视频",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Twitter 成人视频排行榜 — 每日/每周/每月/全部榜单、分类浏览",
  author: "EL",
  site: "https://twitter-ero-video-ranking.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "daily",
      title: "每日",
      functionName: "loadDaily",
      cacheDuration: 300,
      params: [
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "pv",
          enumOptions: [
            { title: "点赞数", value: "favorite" },
            { title: "播放量", value: "pv" },
            { title: "时长", value: "time" },
            { title: "最新", value: "created" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "weekly",
      title: "每周",
      functionName: "loadWeekly",
      cacheDuration: 300,
      params: [
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "pv",
          enumOptions: [
            { title: "点赞数", value: "favorite" },
            { title: "播放量", value: "pv" },
            { title: "时长", value: "time" },
            { title: "最新", value: "created" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "monthly",
      title: "每月",
      functionName: "loadMonthly",
      cacheDuration: 300,
      params: [
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "pv",
          enumOptions: [
            { title: "点赞数", value: "favorite" },
            { title: "播放量", value: "pv" },
            { title: "时长", value: "time" },
            { title: "最新", value: "created" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "allTime",
      title: "全部",
      functionName: "loadAllTime",
      cacheDuration: 300,
      params: [
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "pv",
          enumOptions: [
            { title: "点赞数", value: "favorite" },
            { title: "播放量", value: "pv" },
            { title: "时长", value: "time" },
            { title: "最新", value: "created" }
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
          name: "category",
          title: "选择分类",
          type: "enumeration",
          value: "kyonyu",
          enumOptions: [
            { title: "素人", value: "shirouto" },
            { title: "巨乳", value: "kyonyu" },
            { title: "オナニー", value: "masturbation" },
            { title: "女子高生", value: "jk" },
            { title: "アニメ・二次元", value: "anime" },
            { title: "女教師", value: "female-teacher" },
            { title: "看護婦・ナース", value: "nurse" },
            { title: "痴女", value: "female-pervert" },
            { title: "人妻", value: "married-woman" },
            { title: "美少女", value: "beautiful-girl" },
            { title: "お姉さん", value: "big-sister" },
            { title: "ギャル", value: "gal" },
            { title: "パイパン", value: "shaved" },
            { title: "貧乳・微乳", value: "small-breasts" },
            { title: "ロリ系", value: "lolita" },
            { title: "水着", value: "swimsuit" },
            { title: "SM", value: "sm" },
            { title: "近親相姦", value: "incest" },
            { title: "痴漢", value: "molestation" },
            { title: "盗撮・のぞき", value: "voyeur" },
            { title: "ナンパ", value: "pickup" },
            { title: "マッサージ", value: "massage" },
            { title: "野外・露出", value: "outdoor" },
            { title: "乱交", value: "orgy" },
            { title: "アナル", value: "anal" },
            { title: "イラマチオ", value: "deep-throat" },
            { title: "顔射", value: "facial" },
            { title: "ごっくん", value: "cum-swallowing" },
            { title: "手コキ", value: "handjob" },
            { title: "中出し", value: "creampie" },
            { title: "パイズリ", value: "titjob" },
            { title: "フェラ", value: "fellatio" },
            { title: "ぶっかけ", value: "bukkake" },
            { title: "ハメ撮り", value: "hamedori" },
            { title: "個人撮影", value: "personal-filming" },
            { title: "無修正", value: "uncensored" },
            { title: "ゲイ・男の娘", value: "gay" },
            { title: "コスプレ", value: "cosplay" },
            { title: "レイプ", value: "rape" },
            { title: "企画", value: "special-feature" }
          ]
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "favorite",
          enumOptions: [
            { title: "点赞数", value: "favorite" },
            { title: "播放量", value: "pv" },
            { title: "最新", value: "created" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索标签",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "标签名称", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  常量
// ============================================================
const BASE = "https://twitter-ero-video-ranking.com";
const API_BASE = BASE + "/api";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

// ============================================================
//  标签缓存
// ============================================================
let _tagsPromise = null;

async function fetchTags() {
  if (!_tagsPromise) {
    _tagsPromise = (async () => {
      const resp = await Widget.http.get(API_BASE + "/tags", {
        headers: { "User-Agent": UA }
      });
      if (!resp || !resp.data) throw new Error("获取标签列表失败");
      const list = resp.data;
      const byId = {};
      const byCode = {};
      for (const t of list) {
        if (!t.is_language) {
          byId[t.id] = t;
          byCode[t.code] = t;
        }
      }
      return { list, byId, byCode };
    })();
  }
  return _tagsPromise;
}

// ============================================================
//  工具函数
// ============================================================

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "";
  const s = Math.floor(Number(seconds));
  if (isNaN(s) || s < 0) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return h + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }
  return m + ":" + String(sec).padStart(2, "0");
}

function formatCount(n) {
  if (!n && n !== 0) return "";
  const num = Number(n);
  if (isNaN(num)) return String(n);
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(num);
}

function makeTitle(item) {
  // 优先级：anime_title > tweet_account > url_cd
  if (item.anime_title) return item.anime_title;
  if (item.tweet_account) return "@" + item.tweet_account;
  return item.url_cd;
}

function parseMediaItem(item) {
  const title = makeTitle(item);
  return {
    id: item.url_cd,
    type: "url",
    mediaType: "movie",
    title: title,
    link: item.url_cd,
    coverUrl: item.thumbnail || "",
    posterPath: item.thumbnail || "",
    backdropPath: item.thumbnail || "",
    durationText: formatDuration(item.time),
    // 浏览量 + 点赞数
    description: (item.pv ? "👁 " + formatCount(item.pv) : "") + (item.favorite ? "  ❤ " + formatCount(item.favorite) : "")
  };
}

// ============================================================
//  通用列表加载
// ============================================================
async function loadMediaList(range, sort, page, category) {
  try {
    const params = {
      range: range || "timely",
      page: String(Math.max(1, Number(page) || 1)),
      per_page: "50",
      sort: sort || "pv"
    };
    if (category) {
      params.category = category;
    }

    const resp = await Widget.http.get(API_BASE + "/media", {
      headers: { "User-Agent": UA },
      params: params
    });
    if (!resp || !resp.data || !resp.data.items) {
      throw new Error("API 返回空数据");
    }
    return resp.data.items.map(parseMediaItem);
  } catch (error) {
    console.error("[TwitterEro loadMediaList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  列表页模块入口
//  从详情页点标签（genreId）时使用「全期間」范围确保有结果
// ============================================================
async function loadDaily(params) {
  if (params.genreId) return loadMediaList("all", params.sort || "favorite", params.page, params.genreId);
  if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });
  return loadMediaList("timely", params.sort || "pv", params.page);
}

async function loadWeekly(params) {
  if (params.genreId) return loadMediaList("all", params.sort || "favorite", params.page, params.genreId);
  if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });
  return loadMediaList("weekly", params.sort || "pv", params.page);
}

async function loadMonthly(params) {
  if (params.genreId) return loadMediaList("all", params.sort || "favorite", params.page, params.genreId);
  if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });
  return loadMediaList("monthly", params.sort || "pv", params.page);
}

async function loadAllTime(params) {
  if (params.genreId) return loadMediaList("all", params.sort || "favorite", params.page, params.genreId);
  if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });
  return loadMediaList("all", params.sort || "pv", params.page);
}

// ============================================================
//  loadCategory — 按分类浏览
// ============================================================
async function loadCategory(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId, page: params.page });

    const category = params.genreId || params.category || "";
    if (!category) throw new Error("缺少分类参数");

    // 分類頁預設使用 favorite（いいね順）排序，與源站一致
    return loadMediaList("timely", params.sort || "favorite", params.page, category);
  } catch (error) {
    console.error("[TwitterEro loadCategory] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 按标签名称搜索
// ============================================================
async function searchVideos(params) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || "").trim();
    if (!keyword) throw new Error("请输入标签名称");

    // 尝试从标签列表中找到匹配的标签代码
    const { byCode, byId } = await fetchTags();

    // 先尝试精确匹配 code
    if (byCode[keyword]) {
      return loadMediaList("all", "favorite", params.page, keyword);
    }

    // 尝试模糊匹配 code 或 name
    for (const t of Object.values(byCode)) {
      if (t.name === keyword || t.name_en === keyword || t.code === keyword) {
        return loadMediaList("all", "favorite", params.page, t.code);
      }
    }

    // 检查是否是数字 id
    const idNum = Number(keyword);
    if (!isNaN(idNum) && byId[idNum]) {
      return loadMediaList("all", "favorite", params.page, byId[idNum].code);
    }

    // 中文/日文名模糊匹配
    for (const t of Object.values(byCode)) {
      if (t.name.indexOf(keyword) >= 0 || (t.name_en && t.name_en.indexOf(keyword) >= 0)) {
        return loadMediaList("all", "favorite", params.page, t.code);
      }
    }

    // 未找到匹配标签
    return [];
  } catch (error) {
    console.error("[TwitterEro searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const [mediaResp, tagsData] = await Promise.all([
      Widget.http.get(API_BASE + "/media/" + encodeURIComponent(link), {
        headers: { "User-Agent": UA },
        params: { relative: "true" }
      }),
      fetchTags()
    ]);

    if (!mediaResp || !mediaResp.data) throw new Error("获取详情失败");

    const data = mediaResp.data;

    // 标题
    const title = data.anime_title
      ? data.anime_title
      : data.tweet_account
        ? "@" + data.tweet_account
        : data.url_cd;

    // 映射标签
    const genreItems = [];
    if (data.tags && data.tags.length > 0) {
      for (const jt of data.tags) {
        const tagInfo = tagsData.byId[jt.tag_id];
        if (tagInfo) {
          genreItems.push({ id: tagInfo.code, title: tagInfo.name });
        }
      }
    }

    // 相关推荐
    const relatedItems = [];
    if (data.relatives && data.relatives.length > 0) {
      for (const rel of data.relatives) {
        relatedItems.push({
          id: rel.url_cd,
          type: "url",
          mediaType: "movie",
          title: rel.url_cd,
          link: rel.url_cd,
          coverUrl: rel.thumbnail || "",
          posterPath: rel.thumbnail || "",
          backdropPath: rel.thumbnail || "",
          durationText: formatDuration(rel.time)
        });
      }
    }

    // 视频地址
    const videoUrl = data.url || "";
    const thumb = data.thumbnail || "";

    // 构建描述（包含浏览量/点赞数/发布时间）
    const descParts = [];
    if (data.pv) descParts.push("👁 播放: " + formatCount(data.pv));
    if (data.favorite) descParts.push("❤ 点赞: " + formatCount(data.favorite));
    if (data.posted_at) {
      const d = new Date(data.posted_at);
      descParts.push("📅 " + d.toLocaleDateString("zh-CN"));
    }
    if (data.tweet_account) descParts.push("🐦 @" + data.tweet_account);

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
      description: descParts.length > 0 ? descParts.join("\n") : undefined,
      durationText: formatDuration(data.time),
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: thumb ? [thumb] : [],
      trailers: videoUrl ? [{ url: videoUrl, coverUrl: thumb }] : [],
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[TwitterEro loadDetail] 失败:", error.message || error);
    throw error;
  }
}
