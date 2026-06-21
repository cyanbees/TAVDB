// ============================================================
//  麻豆社 (madou.club) — 视频列表、详情与搜索模块
//  源站: https://madou.club
//  HTML 解析 + CF Worker 解密 AES-128
// ============================================================

WidgetMetadata = {
  id: "forward.madou",
  title: "麻豆社",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "麻豆社视频模块 — 最新视频、品牌分类、搜索",
  author: "EL",
  site: "https://madou.club",
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
      id: "browseBrand",
      title: "品牌浏览",
      functionName: "loadBrand",
      cacheDuration: 300,
      params: [
        {
          name: "brand",
          title: "选择品牌",
          type: "enumeration",
          value: "麻豆传媒",
          enumOptions: [
            { title: "麻豆传媒", value: "麻豆传媒" },
            { title: "麻豆番外篇", value: "麻豆番外篇" },
            { title: "麻豆花絮", value: "麻豆花絮" },
            { title: "HongKongDoll", value: "hongkongdoll" },
            { title: "PsychopornTW", value: "PsychopornTW" },
            { title: "91制片厂", value: "91制片厂" },
            { title: "果冻传媒", value: "果冻传媒" },
            { title: "蜜桃影像", value: "蜜桃影像" },
            { title: "天美传媒", value: "天美传媒" },
            { title: "皇家华人", value: "皇家华人" },
            { title: "兔子先生", value: "兔子先生" },
            { title: "星空无限传媒", value: "星空无限传媒" },
            { title: "爱豆", value: "爱豆" },
            { title: "麻豆导演系列", value: "麻豆导演系列" },
            { title: "大象传媒", value: "大象传媒" },
            { title: "猫爪影像", value: "猫爪影像" },
            { title: "精东影业", value: "精东影业" },
            { title: "杏吧", value: "杏吧" },
            { title: "乐播传媒", value: "乐播传媒" },
            { title: "草莓", value: "草莓" },
            { title: "抖阴", value: "抖阴" },
            { title: "SA国际传媒", value: "SA国际传媒" },
            { title: "起点传媒/性视界传媒", value: "起点传媒" },
            { title: "大鸟十八", value: "大鸟十八" },
            { title: "小鹏奇啪行", value: "小鹏奇啪行" },
            { title: "女优淫娃培训营", value: "女优淫娃培训营" },
            { title: "淫欲游戏王", value: "淫欲游戏王" },
            { title: "女神羞羞研究所", value: "女神羞羞研究所" },
            { title: "突袭女优家", value: "突袭女优家" },
            { title: "情趣K歌房", value: "情趣K歌房" },
            { title: "KISS糖果屋", value: "KISS糖果屋" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchMadou",
      title: "搜索麻豆社",
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
const BASE = "https://madou.club";
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

function parseListHtml(html) {
  const items = [];
  const blocks = html.split('<article class="excerpt excerpt-c5"');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    const link = getText(block, /<a[^>]*class="thumbnail"[^>]*href="([^"]+)"/);
    if (!link) continue;

    const title = getText(block, /<h2><a[^>]*>([^<]+)<\/a><\/h2>/);
    const coverRaw = getText(block, /<img[^>]*data-src="([^"]+)"/);
    const cover = coverRaw || "";
    const views = getText(block, /post-view[^>]*>观看\(([^)]+)\)/);
    const category = getText(block, /rel="category tag">([^<]+)<\/a>/);

    items.push({
      id: link,
      type: "url",
      mediaType: "movie",
      title: title || "Untitled",
      link: link,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      remark: (category ? category + " · " : "") + (views ? views : ""),
      genreTitle: category || ""
    });
  }
  return items;
}

// ============================================================
//  列表页加载
// ============================================================
async function loadList(path, params = {}) {
  try {
    if (params.genreId) return loadBrand({ brand: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + path + (page > 1 ? "page/" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[madou loadList] 失败:", error.message || error);
    throw error;
  }
}

async function loadLatest(params) { return loadList("/", params); }

// ============================================================
//  loadBrand — 按品牌浏览
// ============================================================
async function loadBrand(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const brand = params.genreId || params.brand || "";
    if (!brand) throw new Error("缺少品牌参数");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE + "/category/" + encodeURIComponent(brand) + (page > 1 ? "/page/" + page : "");
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[madou loadBrand] 失败:", error.message || error);
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
    const url = BASE + "/page/" + page + "?s=" + encodeURIComponent(keyword);
    const html = await fetchPage(url);
    return parseListHtml(html);
  } catch (error) {
    console.error("[madou searchVideos] 失败:", error.message || error);
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

    // 标题（title 标签）
    const title = getText(html, /<title>([^<]+)<\/title>/)
      .replace(/-麻豆社$/, "").trim();

    // 封面
    let thumb = getText(html, /<img[^>]*src="([^"]+covers\/[^"]+)"/);

    // 获取 iframe 播放器地址（src 可能无引号）
    let iframeSrc = getText(html, /<iframe[^>]*src="([^"]+)"/);
    if (!iframeSrc) {
      const m = html.match(/<iframe[^>]*src=([^\s>]+)/);
      if (m) iframeSrc = m[1].replace(/['"]/g, "");
    }
    let videoUrl = "";
    if (iframeSrc) {
      try {
        const playerHtml = await fetchPage(iframeSrc);
        const token = getText(playerHtml, /var token = "([^"]+)"/);
        const m3u8 = getText(playerHtml, /var m3u8 = '([^']+)'/);
        if (token && m3u8) {
          const dashBase = iframeSrc.match(/^(https?:\/\/[^/]+)/);
          const baseUrl = dashBase ? dashBase[1] : "";
          const rawM3u8Url = baseUrl + m3u8 + "?token=" + token;
          videoUrl = "https://madou-worker.cybees7.workers.dev/proxy?url=" + encodeURIComponent(rawM3u8Url);
        }
      } catch (e) {
        console.error("[madou loadDetail] iframe 获取失败:", e.message || e);
      }
    }

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
      title: title || "Untitled",
      link: link,
      coverUrl: thumb || "",
      posterPath: thumb || "",
      backdropPath: thumb || "",
      videoUrl: videoUrl || "",
      backdropPaths: backdropPaths,
      trailers: trailers
    };
  } catch (error) {
    console.error("[madou loadDetail] 失败:", error.message || error);
    throw error;
  }
}
