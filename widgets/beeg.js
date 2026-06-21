// ============================================================
//  Beeg — 视频列表、详情与搜索模块
//  源站: https://beeg.com
//  纯 JSON API — store.externulls.com
// ============================================================

WidgetMetadata = {
  id: "forward.beeg",
  title: "Beeg",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "Beeg 视频模块 — 多频道/多模特浏览，HLS 多画质播放",
  author: "EL",
  site: "https://beeg.com",
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
      id: "byChannel",
      title: "频道浏览",
      functionName: "loadChannel",
      cacheDuration: 300,
      params: [
        {
          name: "channel",
          title: "选择频道",
          type: "enumeration",
          value: "blacked",
          enumOptions: [
            { title: "Blacked", value: "blacked" },
            { title: "Vixen", value: "vixencom" },
            { title: "Team Skeet", value: "teamskeet" },
            { title: "Teen Mega World", value: "teenmegaworld" },
            { title: "Nubiles", value: "nubilesporn" },
            { title: "Wow Girls", value: "wowgirls" },
            { title: "Bratty Sis", value: "brattysis" },
            { title: "Adult Time", value: "adulttime" },
            { title: "Family Strokes", value: "familystrokes" },
            { title: "Nubile Films", value: "nubilefilms" },
            { title: "LetsDoeIt", value: "letsdoeit" },
            { title: "Tiny 4K", value: "tiny4k" },
            { title: "Naughty America", value: "naughtyamerica" },
            { title: "Sis Loves Me", value: "sislovesme" },
            { title: "Pure Taboo", value: "puretaboo" },
            { title: "Moms Teach Sex", value: "momsteachsex" },
            { title: "Hot Wife XXX", value: "hotwifexxx" },
            { title: "Dorcel Club", value: "dorcelclub" },
            { title: "Vixen Plus", value: "vixenplus" },
            { title: "Passion HD", value: "passionhd" },
            { title: "Tushy", value: "tushy" },
            { title: "Deeper", value: "deeperofficial" },
            { title: "Blacked Raw", value: "blackedraw" },
            { title: "21 Sextury", value: "21sextury" },
            { title: "Hegre", value: "hegre" },
            { title: "Evil Angel", value: "evilangel" },
            { title: "Caribbeancom", value: "caribbeancom" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchBeeg",
      title: "搜索 Beeg",
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
const API_BASE = "https://store.externulls.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

// ============================================================
//  工具函数
// ============================================================

async function fetchAPI(url) {
  const resp = await Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Origin": "https://beeg.com",
      "Referer": "https://beeg.com/"
    }
  });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  const parsed = typeof resp.data === "string" ? JSON.parse(resp.data) : resp.data;
  return parsed;
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "";
  seconds = Math.round(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  return m + ":" + String(s).padStart(2, "0");
}

/** 从视频对象构建列表项 */
function buildItem(video) {
  const fcFacts = video.fc_facts ? video.fc_facts[0] : null;
  const factId = fcFacts ? fcFacts.id : null;
  const fileData = video.file && video.file.data ? video.file.data : [];
  const fileId = video.file && video.file.id ? video.file.id : (fileData.length > 0 && fileData[0].cd_file ? fileData[0].cd_file : factId);
  if (!fileId) return null;

  const duration = video.file && video.file.fl_duration ? video.file.fl_duration : 0;
  const height = video.file && video.file.fl_height ? video.file.fl_height : 0;
  const fcThumbs = fcFacts && fcFacts.fc_thumbs ? fcFacts.fc_thumbs : [];

  // 标题
  let title = "Untitled";
  for (var i = 0; i < fileData.length; i++) {
    if (fileData[i].cd_column === "sf_name") {
      title = fileData[i].cd_value || title;
      break;
    }
  }

  // 封面
  let cover = "";
  if (fcThumbs.length > 0) {
    cover = "https://thumbs.externulls.com/videos/" + fileId + "/" + fcThumbs[0] + ".jpg";
  } else if (fileData[0] && fileData[0].cd_file) {
    cover = "https://img.externulls.com/" + fileData[0].cd_file + "/preview_01.jpg";
  }

  const link = String(fileId);
  const durationText = formatDuration(duration);
  var remark = "";
  if (height > 0) remark += height + "p";
  if (durationText) remark += (remark ? " " : "") + durationText;

  return {
    id: link,
    type: "url",
    mediaType: "movie",
    title: title,
    link: link,
    coverUrl: cover || "",
    posterPath: cover || "",
    backdropPath: cover || "",
    durationText: durationText,
    remark: height > 0 ? height + "p" + (durationText ? " " + durationText : "") : (durationText || ""),
    ext: { fileId: fileId }
  };
}

// ============================================================
//  loadLatest — 最新列表（首页）
// ============================================================
async function loadLatest(params) {
  try {
    if (params.genreId) return loadChannel({ channel: params.genreId, page: params.page });
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const offset = (page - 1) * 48;
    const url = API_BASE + "/tag/videos/index?limit=48&offset=" + offset;
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const video of data) {
        const item = buildItem(video);
        if (item) items.push(item);
      }
    }
    return items;
  } catch (error) {
    console.error("[Beeg loadLatest] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadChannel — 按频道浏览
// ============================================================
async function loadChannel(params) {
  try {
    if (params.peopleId) return searchVideos({ keyword: params.peopleId });

    const slug = params.genreId || params.channel || "";
    if (!slug) throw new Error("缺少频道参数");

    const page = Math.max(1, Number(params.page) || 1);
    const offset = (page - 1) * 48;
    const url = API_BASE + "/tag/videos/" + slug + "?limit=48&offset=" + offset;
    const data = await fetchAPI(url);

    const items = [];
    if (Array.isArray(data)) {
      for (const video of data) {
        const item = buildItem(video);
        if (item) items.push(item);
      }
    }
    return items;
  } catch (error) {
    console.error("[Beeg loadChannel] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索（遍历首页匹配标题）
// ============================================================
async function searchVideos(params) {
  try {
    if (params.peopleId) {
      return searchVideos({ keyword: params.peopleId, page: params.page || 1 });
    }

    const keyword = (params.keyword || "").trim().toLowerCase();
    if (!keyword) throw new Error("请输入搜索关键词");

    // 分词
    const words = keyword.split(/[^a-z0-9]+/).filter(function(w) { return w.length >= 2; });
    if (words.length === 0) throw new Error("关键词太短");

    const page = Math.max(1, Number(params.page) || 1);

    // 每页搜索扫描 5 个首页页面的内容
    const pagesPerSearch = 5;
    const startPage = (page - 1) * pagesPerSearch + 1;
    const endPage = startPage + pagesPerSearch - 1;

    const seen = {};
    const items = [];

    for (var hp = startPage; hp <= endPage; hp++) {
      const offset = (hp - 1) * 48;
      const url = API_BASE + "/tag/videos/index?limit=48&offset=" + offset;
      const data = await fetchAPI(url);

      if (!Array.isArray(data)) continue;

      for (let vi = 0; vi < data.length; vi++) {
        const video = data[vi];
        const item = buildItem(video);
        if (!item || seen[item.id]) continue;

        // 检查标题是否包含所有搜索词
        const titleLower = item.title.toLowerCase();
        let allMatch = true;
        for (let wi = 0; wi < words.length; wi++) {
          if (titleLower.indexOf(words[wi]) < 0) {
            allMatch = false;
            break;
          }
        }
        if (!allMatch) continue;

        seen[item.id] = true;
        items.push(item);
        if (items.length >= 48) break;
      }
      if (items.length >= 48) break;
    }

    return items;
  } catch (error) {
    console.error("[Beeg searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const fileId = String(link).replace(/[^0-9a-zA-Z_-]/g, "");
    if (!fileId) throw new Error("无效的视频 ID");

    // 从 API 获取视频详情（含播放地址）
    const detailUrl = API_BASE + "/facts/file/" + fileId;
    const data = await fetchAPI(detailUrl);
    if (!data || !data.file) throw new Error("未找到视频数据");

    const hlsResources = data.file.hls_resources || {};
    const fileData = data.file.data || [];

    // 标题
    let title = "Untitled";
    for (var i = 0; i < fileData.length; i++) {
      if (fileData[i].cd_column === "sf_name") {
        title = fileData[i].cd_value || title;
        break;
      }
    }

    // 演员（从 tags 中提取 is_person=true 的条目）
    var peoples = [];
    var genreItems = [];
    if (data.tags && Array.isArray(data.tags)) {
      for (var ti = 0; ti < data.tags.length; ti++) {
        var tag = data.tags[ti];
        if (!tag || !tag.id) continue;
        if (tag.is_person) {
          peoples.push({
            id: String(tag.id),
            title: tag.tg_name || "Unknown",
            role: "actor"
          });
        } else {
          genreItems.push({
            id: tag.tg_slug || String(tag.id),
            title: tag.tg_name || "Unknown"
          });
        }
      }
    }

    // 时长
    const duration = data.file.fl_duration || 0;
    const durationText = formatDuration(duration);

    // 封面
    const fcFacts = data.fc_facts ? data.fc_facts[0] : null;
    let cover = "";
    if (fcFacts && fcFacts.fc_thumbs && fcFacts.fc_thumbs.length > 0) {
      cover = "https://thumbs.externulls.com/videos/" + fileId + "/" + fcFacts.fc_thumbs[0] + ".jpg";
    } else if (fileData[0] && fileData[0].cd_file) {
      cover = "https://img.externulls.com/" + fileData[0].cd_file + "/preview_01.jpg";
    }

    // 剧照
    const backdropPaths = [];
    if (cover) backdropPaths.push(cover);

    // 提取播放地址：解析 master playlist，取最高画质
    var playUrl = "";
    var multiRaw = hlsResources["fl_cdn_multi"];
    if (multiRaw) {
      var masterUrl = "https://video.beeg.com/" + multiRaw;
      // 抓取 master playlist，找到最高分辨率的子流
      try {
        var masterResp = await Widget.http.get(masterUrl, {
          headers: {
            "User-Agent": UA,
            "Origin": "https://beeg.com",
            "Referer": "https://beeg.com/"
          }
        });
        if (masterResp && masterResp.data) {
          var masterText = typeof masterResp.data === "string" ? masterResp.data : String(masterResp.data);
          var bestUrl = "";
          var bestHeight = 0;
          var lines = masterText.split("\n");
          var currentHeight = 0;
          for (var li = 0; li < lines.length; li++) {
            var line = lines[li].trim();
            // 读取 RESOLUTION
            var resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
            if (resMatch) {
              currentHeight = parseInt(resMatch[2], 10);
            }
            // 下一行是子流 URL（以 /key= 开头）
            if (line.indexOf("/key=") === 0 && currentHeight > bestHeight) {
              bestHeight = currentHeight;
              bestUrl = "https://video.beeg.com" + line;
            }
          }
          if (bestUrl) playUrl = bestUrl;
        }
      } catch(e) {
        // fallback: 返回 master playlist URL
        playUrl = masterUrl;
      }
    }

    // 预告片
    var trailers = [];
    if (playUrl) {
      trailers.push({ url: playUrl, coverUrl: cover });
    }

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: cover || "",
      posterPath: cover || "",
      backdropPath: cover || "",
      videoUrl: playUrl || "",
      durationText: durationText,
      peoples: peoples.length > 0 ? peoples : undefined,
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      backdropPaths: backdropPaths.length > 0 ? backdropPaths : undefined,
      trailers: trailers.length > 0 ? trailers : undefined
    };
  } catch (error) {
    console.error("[Beeg loadDetail] 失败:", error.message || error);
    throw error;
  }
}
