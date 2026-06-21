// ============================================================
//  独播库 — 播放源解析模块
//  源站: https://www.dbku.tv
//  MacCMS player_data 解密 → HLS 直链
// ============================================================

WidgetMetadata = {
  id: "forward.duboku-resource",
  title: "独播库",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "独播库(dbku.tv)播放源解析 — 通过剧名搜索并解析播放地址",
  author: "EL",
  site: "https://www.dbku.tv",
  modules: [
    {
      id: "loadResource",
      title: "独播库解析",
      description: "独播库搜索与播放源返回",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: []
    }
  ]
};

const BASE = "https://www.dbku.tv";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";
const PLAY_HEADERS = { "User-Agent": UA, "Referer": BASE + "/", "Origin": BASE };

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: { "User-Agent": UA, "Referer": BASE + "/" } });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function safeAtob(str) {
  if (typeof atob === "function") return atob(str);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  str = String(str).replace(/=+$/, "");
  for (let i = 0; i < str.length; i += 4) {
    const a = chars.indexOf(str[i]);
    const b = chars.indexOf(str[i + 1] || "=");
    const c = chars.indexOf(str[i + 2] || "=");
    const d = chars.indexOf(str[i + 3] || "=");
    output += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== -1) output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== -1) output += String.fromCharCode(((c & 3) << 6) | d);
  }
  return output;
}

// 从播放页提取 player_data 并解密 HLS 地址
// player_data.encrypt == 2: unescape(base64decode(url))
async function resolvePlayUrl(vodId, sid, nid) {
  try {
    const url = BASE + "/vodplay/" + vodId + "-" + sid + "-" + nid;
    const html = await fetchPage(url);
    const start = html.indexOf("player_data = {");
    if (start < 0) return "";

    let depth = 0, inStr = false, end = start;
    for (let i = start; i < html.length; i++) {
      const c = html[i];
      if (c === "\\") { i++; continue; }
      if (c === '"' && (i === 0 || html[i - 1] !== "\\")) inStr = !inStr;
      if (!inStr) {
        if (c === "{") depth++;
        else if (c === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
      }
    }

    const jsonStr = html.slice(start + "player_data = ".length, end);
    const data = JSON.parse(jsonStr);
    const urlEncoded = data.url || "";
    if (!urlEncoded) return "";

    const decoded = safeAtob(urlEncoded);
    return decodeURIComponent(decoded) || "";
  } catch (e) {
    console.error("[Duboku resolvePlayUrl] 失败:", e.message || e);
    return "";
  }
}

async function loadResource(params) {
  try {
    // Mode 1: 直接传播放标识 vod_id/sid/nid
    const vodId = params.vod_id || "";
    const sid = params.sid || "1";
    const nid = params.nid || "1";
    if (vodId) {
      const videoUrl = await resolvePlayUrl(vodId, sid, nid);
      if (videoUrl) return [{ name: "独播库", url: videoUrl, customHeaders: PLAY_HEADERS }];
    }

    // Mode 2: 通过 seriesName 搜索定位
    const seriesName = params.seriesName || params.title || "";
    if (!seriesName) return [];

    const searchHtml = await fetchPage(BASE + "/vodsearch/-------------.html?wd=" + encodeURIComponent(seriesName));
    const resultMatch = searchHtml.match(/href="\/voddetail\/(\d+)\.html"[^>]*title="([^"]+)"/);
    if (!resultMatch) return [];

    const foundId = resultMatch[1];
    const detailHtml = await fetchPage(BASE + "/voddetail/" + foundId + ".html");
    const epLinks = [];
    const epRegex = /href="\/vodplay\/(\d+)-(\d+)-(\d+\.html)"[^>]*>([^<]+)<\/a>/g;
    let m;
    while ((m = epRegex.exec(detailHtml)) !== null) {
      epLinks.push({ vod_id: m[1], sid: m[2], nid: m[3], name: m[4].trim() });
    }
    if (!epLinks.length) return [];

    const wantEpisode = parseInt(params.episode, 10) || 0;
    let target = null;
    if (wantEpisode > 0) {
      target = epLinks.find(e => parseInt(e.nid, 10) === wantEpisode) || epLinks.find(e => e.name.indexOf("第" + wantEpisode) >= 0);
    }
    target = target || epLinks.find(e => e.name === "正片") || epLinks[0];

    const videoUrl = await resolvePlayUrl(target.vod_id, target.sid, target.nid);
    if (!videoUrl) return [];

    return [{
      name: "独播库 " + (target.name || ""),
      description: resultMatch[2] + " - " + (target.name || ""),
      url: videoUrl,
      customHeaders: PLAY_HEADERS,
      playerType: "system"
    }];
  } catch (e) {
    console.error("[Duboku loadResource] 失败:", e.message || e);
    return [];
  }
}
