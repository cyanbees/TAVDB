WidgetMetadata = {
  id: "douban.list",
  title: "豆瓣片单",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  description: "内置20个经典恐怖/惊悚片豆列（从 GitHub 数据源读取，无需实时抓取豆瓣），或填入自定义豆瓣豆列链接",
  author: "EL",
  site: "https://douban.com",
  modules: [
    {
      id: "list",
      title: "豆瓣片单",
      functionName: "list",
      cacheDuration: 86400,
      params: [
        {
          name: "list",
          title: "选择片单",
          type: "enumeration",
          value: "1652843",
          enumOptions: [
            { title: "Time Out影史百大恐怖片", value: "1652843" },
            { title: "看电影40部最经典恐怖片", value: "36980" },
            { title: "恐惧感的丧失(309部)", value: "36280" },
            { title: "难忘的经典惊悚/恐怖片(547部)", value: "37140418" },
            { title: "7分以上的恐怖/惊悚电影(174部)", value: "526461" },
            { title: "高分精品恐怖片(280部)", value: "5916567" },
            { title: "2000后优秀恐怖电影(204部)", value: "3356598" },
            { title: "被忽略掉的不沉闷恐怖劲片！(77部)", value: "724565" },
            { title: "Indiewire: 50位导演心中的最佳恐怖片(48部)", value: "152540212" },
            { title: "稀有难找 underground horror films(466部)", value: "109801736" },
            { title: "血浆片已阅整理 Gory Horror Film(47部)", value: "159889980" },
            { title: "女性导演恐怖片(383部)", value: "124549602" },
            { title: "Body Horror｜身体恐怖电影(155部)", value: "162107956" },
            { title: "瘆临其境！恐怖伪纪录片(193部)", value: "161922461" },
            { title: "码住！盘点欧美高分恐怖电影(585部)", value: "163019144" },
            { title: "怪力乱神！欧美超自然恐怖电影(206部)", value: "163048555" },
            { title: "审美与创意兼顾的恐怖片(96部)", value: "159035683" },
            { title: "我看过的恐怖片们(254部)", value: "148836450" },
            { title: "我的恐怖片之旅(1534部)", value: "45782339" },
            { title: "码住！2026年恐怖电影大盘点(304部)", value: "163145526" },
            { title: "⏎ 自定义URL", value: "custom" },
          ],
        },
        {
          name: "url",
          title: "自定义URL",
          type: "input",
          description: "填入豆瓣豆列/列表链接",
          placeholders: [
            { title: "https://www.douban.com/doulist/xxx/", value: "" },
          ],
          belongTo: { paramName: "list", value: ["custom"] },
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        }
      ],
    }
  ],
};

// ─── GitHub 数据源地址 ───
// 内置豆列数据存储在 GitHub 仓库的 data/ 目录下
// 优先用 jsDelivr CDN（国内可访问），回退到 raw.githubusercontent.com
var DATA_BASE = "https://cdn.jsdelivr.net/gh/cyanbees/TAVDB@main/data/";
var DATA_BASE_FALLBACK = "https://raw.githubusercontent.com/cyanbees/TAVDB/main/data/";

// ─── 内置豆列名称映射（仅用于校验和显示） ───
var BUILTIN_NAMES = {
  "1652843":   "Time Out影史百大恐怖片",
  "36980":     "看电影40部最经典恐怖片",
  "36280":     "恐惧感的丧失(309部)",
  "37140418":  "难忘的经典惊悚/恐怖片(547部)",
  "526461":    "7分以上的恐怖/惊悚电影(174部)",
  "5916567":   "高分精品恐怖片(280部)",
  "3356598":   "2000后优秀恐怖电影(204部)",
  "724565":    "被忽略掉的不沉闷恐怖劲片！(77部)",
  "152540212": "Indiewire: 50位导演心中的最佳恐怖片(48部)",
  "109801736": "稀有难找 underground horror films(466部)",
  "159889980": "血浆片已阅整理 Gory Horror Film(47部)",
  "124549602": "女性导演恐怖片(383部)",
  "162107956": "Body Horror｜身体恐怖电影(155部)",
  "161922461": "瘆临其境！恐怖伪纪录片(193部)",
  "163019144": "码住！盘点欧美高分恐怖电影(585部)",
  "163048555": "怪力乱神！欧美超自然恐怖电影(206部)",
  "159035683": "审美与创意兼顾的恐怖片(96部)",
  "148836450": "我看过的恐怖片们(254部)",
  "45782339":  "我的恐怖片之旅(1534部)",
  "163145526": "码住！2026年恐怖电影大盘点(304部)",
};

// ─── 辅助：带 CDN 回退的 JSON 获取 ───
async function fetchDataJSON(path) {
  var primaryUrl = DATA_BASE + path;
  var fallbackUrl = DATA_BASE_FALLBACK + path;

  // 尝试主地址
  try {
    var res = await Widget.http.get(primaryUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 6000,
    });
    if (res && res.data) {
      console.log("[豆瓣] 数据来源: jsDelivr CDN");
      return typeof res.data === "object" ? res.data : JSON.parse(res.data);
    }
  } catch (e) {
    console.warn("[豆瓣] CDN 获取失败，尝试 GitHub raw:", e.message);
  }

  // 回退到 GitHub raw
  try {
    var res = await Widget.http.get(fallbackUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 8000,
    });
    if (res && res.data) {
      console.log("[豆瓣] 数据来源: GitHub raw");
      return typeof res.data === "object" ? res.data : JSON.parse(res.data);
    }
  } catch (e) {
    console.warn("[豆瓣] GitHub raw 也失败:", e.message);
  }

  throw new Error("无法获取数据文件，请检查网络或稍后再试");
}

// ─── 主函数 ───
async function list(params) {
  try {
    var selectedList = params.list || "1652843";

    // ── 分支1: 自定义URL → 实时抓取豆瓣（保留原有逻辑） ──
    if (selectedList === "custom") {
      return await fetchFromDouban(params);
    }

    // ── 分支2: 内置豆列 → 从 GitHub 读取 JSON ──
    var listTitle = BUILTIN_NAMES[selectedList];
    if (!listTitle) {
      throw new Error("无效的片单选择");
    }
    console.log("[豆瓣] 使用内置片单:", listTitle);

    // 读取索引文件，找到目标豆列的文件名
    var indexData = await fetchDataJSON("doulist_index.json");
    if (!indexData || !indexData.doulists) {
      throw new Error("索引文件格式错误");
    }

    // 查找对应的豆列
    var doulistMeta = null;
    for (var i = 0; i < indexData.doulists.length; i++) {
      if (indexData.doulists[i].id === selectedList) {
        doulistMeta = indexData.doulists[i];
        break;
      }
    }
    if (!doulistMeta) {
      throw new Error("未找到豆列数据: " + listTitle);
    }

    // 读取豆列数据文件
    var doulistData = await fetchDataJSON(doulistMeta.file);
    if (!doulistData || !doulistData.items) {
      throw new Error("豆列数据文件格式错误");
    }

    // 分页：每页25条
    var page = Number(params.page || 1);
    var pageSize = 25;
    var start = (page - 1) * pageSize;
    var pageItems = doulistData.items.slice(start, start + pageSize);

    console.log("[豆瓣] 片单:", listTitle, "第" + page + "页, 共" + pageItems.length + "条");

    // 转换为标准 VideoItem 格式
    return pageItems.map(function (item) {
      return {
        id: item.doubanId,
        type: "douban",
        mediaType: "movie",
        title: item.title || undefined,
        posterPath: item.posterPath || undefined,
        rating: item.rating || undefined,
      };
    });

  } catch (error) {
    console.error("[豆瓣] list 失败:", error.message || error);
    // 如果从 GitHub 读取失败，降级到实时抓取兜底
    if (error.message && error.message.indexOf("数据文件") >= 0) {
      console.warn("[豆瓣] 降级到实时抓取兜底...");
      return await fetchFromDouban(params);
    }
    throw error;
  }
}

// ─── 兜底函数：实时抓取豆瓣（保留原有逻辑，用于自定义URL或降级） ───
async function fetchFromDouban(params) {
  var selectedList = params.list || "1652843";
  var url = params.url ? params.url.trim() : "";

  if (selectedList !== "custom") {
    var presetName = BUILTIN_NAMES[selectedList];
    if (!presetName) throw new Error("无效的片单选择");
    url = "https://www.douban.com/doulist/" + selectedList + "/";
    console.log("[豆瓣] 降级抓取片单:", presetName);
  } else if (!url) {
    throw new Error("请提供豆瓣片单地址");
  }

  var page = Number(params.page || 1);
  var start = (page - 1) * 25;
  url = url.replace(/([?&])start=\d+/, '$1').replace(/[?&]$/, '');
  url += (url.indexOf('?') >= 0 ? '&' : '?') + 'start=' + start;

  console.log("[豆瓣] 实时抓取:", url);

  var response = await Widget.http.get(url, {
    headers: {
      "Referer": "https://movie.douban.com/",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 8000,
  });

  if (!response || !response.data) {
    throw new Error("获取豆瓣片单数据失败");
  }

  var $ = Widget.html.load(response.data);
  if (!$ || $ === null) {
    throw new Error("解析 HTML 失败");
  }

  var doubanItems = [];
  var seen = new Set();

  // 策略1：标准 doulist-item
  $(".doulist-item").each(function (i, el) {
    var $item = $(el);
    var $link = $item.find(".title a");
    var href = $link.attr("href");
    if (!href) return;

    var match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
    if (!match) return;

    var id = Number(match[1]);
    if (seen.has(id)) return;
    seen.add(id);

    var title = $link.text().trim();
    var posterPath = $item.find(".post img").attr("src");
    var ratingText = $item.find(".rating_nums").text().trim();

    doubanItems.push({
      id: id,
      type: "douban",
      mediaType: "movie",
      title: title || undefined,
      posterPath: posterPath || undefined,
      rating: ratingText ? Number(ratingText) : undefined,
    });
  });

  // 策略2：兜底
  if (doubanItems.length === 0) {
    $("a[href*='movie.douban.com/subject/']").each(function (i, el) {
      var href = $(el).attr("href");
      if (!href) return;
      var match = href.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (!match) return;
      var id = Number(match[1]);
      if (seen.has(id)) return;
      seen.add(id);
      var title = $(el).text().trim();
      doubanItems.push({
        id: id,
        type: "douban",
        mediaType: "movie",
        title: title || undefined,
      });
    });
  }

  console.log("[豆瓣] 实时抓取完成，提取:", doubanItems.length, "条");
  return doubanItems;
}
