// 瓜子影视播放源 — 从 聚合实时榜单 拆分所得
WidgetMetadata = {
  id: "guazi.resource",
  title: "瓜子影视播放源",
  description: "瓜子影视搜索与播放源返回",
  author: "TG@ZenMoFiShi",
  site: "https://t.me/Nzmgs",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "瓜子影视播放源",
      description: "瓜子影视搜索与播放源返回",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 120,
      params: []
    }
  ]
};

const USER_AGENT = "TilingSales/2 CFNetwork/3860.500.112 Darwin/25.4.0";
const LIB_CRYPTO_JS = "https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js";
const LIB_JSENCRYPT = "https://cdn.jsdelivr.net/npm/jsencrypt@3.3.2/bin/jsencrypt.min.js";

const APP_CONFIG = {
  baseURL: "https://api.1000gxf.com",
  versionCode: "2026033001",
  apiVersion: "3.0.4.1",
  productnumber: "1",
  platform: "2",
  packageName: "com.jfm202203",
  code: "RNGZ0001",
  requestAes: { key: "aaaabbbbccccdddd", iv: "1111222233334444" },
  requestPublicKey: "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWJafJAdhTPWMrNpbmlk672o06smRwxe1LoHjy2XbLRaKIXfQJWgJTBhLH4qUIPMmpnIKQYqjMLTrJhwG5Bwsd3/15YHdL7eWad7lpomF5doOQmmexK2+gSBHmCOhXeumhrOD63vx8ERepxR6UCxTi5b5fZmqMdbLk45IW39mn6wIDAQAB-----END PUBLIC KEY-----",
  responsePrivateKey: "-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQCM+iJdCeYFydG3DiFG0Ajr6IS0NENW1Bb2MSwrUdvLiI7nXHG+zZZuyqewVUPUPQRdEvhSMCyTKjjX9QajRJ1Uv+xVnsOmxEQQIhAIUa1dsXsN30nLGA+VuNHF7J1SE+Vh/46duR/0Q+Iq+3esSYlb3/PdN4wgK5ab+jKeR0JA2wIDAQABAoGAbst/CkPnRZFRgl5WhMKm4FDDSqTwb2MMELygjAMvjIxsUyRyOJR2r+gRViIMxtaVgViRVHaL8bTzK7ZkWxhn1LEM7RpWB1zjKFvXxE+dzxPrYY/Qw7dobzAAMyQhZ2+7PTO/plUYOxNgZPUzsvcoI44M3HRy1yFxGbF9z9LiMDECQQDTs5eXJnjEN1JmqbBotFw0III0/se/r0oDv4AvJdbxl64t64dZI2tS3BO7NL3OAOzf+WL14Pf2uADFDZz9kzHPAkEAqnn7TBlZXc6L70TnCaggMAN9C+2Iuik2Q2dePfTBI9IyJiC54k4G66iT+kQ5F6T4MGWf6jb7xUuUTk6AHck/NQJBALk+5oAh7v0rt5QUGkSUxjXq2GUNKLbn6Ok8sisPfnVrF8Qg3A+4+ZnI8A8ZSJkxoBUgwWKMWA5w1mOX1O7i1WsCQHV0qgHajUomnx9x18U9gz/Rh3yKYmPxNSPnunTxh4kIr+i5L5mOrRH9CkeqbbOuxBmES1PyIjHjSwFQ8NCU8ekCQQCwb4PirUbcqeHbjN0Nv6vm5pqsgJ29GhA9qiy2l+1Wb637STe9L2mEt7ImUd9FGy7k3Nnsn5eou/t2SV3OkGaU-----END RSA PRIVATE KEY-----",
  iosRequestSalt: "&ffddffujhjhgvdvdvdz4Y!s!2br",
  token: "4bd478357df7f37d88151b7dc8f9167d.260de3393c2854bd24e15182ea6c0ded6ee75f5501811d3e5427389a72fa1cda5884b98b245cdc4ae08931d017252923a8de029c5a098a0e7732ac496d23a400952bb419724e1113b902fdca56b6b0226a4f7c47ddb4e7446870a6b7ac1410129005f032d07008addd565ba05ab8e1fe4aa231559ba3ec0a9100cca0e8ea35a8.36a6eb8f80f85314e79b1c1d10aecf78286c9d0658b006b6397d81c0dbb710cd",
  tokenId: "",
  deviceId: "9842D2AB-E588-4A47-B365-D5473C7DD10C",
  ip: "23.145.36.25",
  lang: "zh_cn"
};

let __libsReady = false;
let __refreshTried = false;

async function ensureLibs() {
  if (__libsReady && typeof CryptoJS !== "undefined" && typeof JSEncrypt !== "undefined") return;
  const g = (function () {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    return this;
  })();
  if (!g.window) g.window = g;
  if (!g.self) g.self = g;
  if (!g.global) g.global = g;
  if (!g.navigator) g.navigator = { appName: "Netscape", userAgent: USER_AGENT };
  if (typeof CryptoJS === "undefined") {
    const resp = await Widget.http.get(LIB_CRYPTO_JS, { headers: { "User-Agent": USER_AGENT } });
    (0, eval)(typeof resp.data === "string" ? resp.data : String(resp.data || ""));
  }
  if (typeof JSEncrypt === "undefined") {
    const resp = await Widget.http.get(LIB_JSENCRYPT, { headers: { "User-Agent": USER_AGENT } });
    (0, eval)(typeof resp.data === "string" ? resp.data : String(resp.data || ""));
  }
  if (typeof CryptoJS === "undefined") throw new Error("CryptoJS 加载失败");
  if (typeof JSEncrypt === "undefined") throw new Error("JSEncrypt 加载失败");
  __libsReady = true;
}

function buildHeaders(extra = {}) {
  return Object.assign({
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Version": APP_CONFIG.versionCode,
    "api-ver": APP_CONFIG.apiVersion,
    "packagename": APP_CONFIG.packageName,
    "code": APP_CONFIG.code,
    "ver": APP_CONFIG.apiVersion,
    "deviceid": APP_CONFIG.deviceId,
    "ip": APP_CONFIG.ip,
    "lang": APP_CONFIG.lang,
    "x-customer-client-ip": "",
    "User-Agent": USER_AGENT,
    "parent-code": ""
  }, extra);
}

function aesEncryptHex(text, keyStr, ivStr) {
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  const iv = CryptoJS.enc.Utf8.parse(ivStr);
  const data = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString();
}

function aesDecryptHex(cipherHex, keyStr, ivStr) {
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  const iv = CryptoJS.enc.Utf8.parse(ivStr);
  return CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(cipherHex) }, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
}

function rsaEncryptBase64(text, publicKey) {
  const js = new JSEncrypt();
  js.setPublicKey(publicKey);
  return js.encrypt(text);
}

function rsaDecryptBase64(text, privateKey) {
  const js = new JSEncrypt();
  js.setPrivateKey(privateKey);
  return js.decrypt(text);
}

function buildRequestBody(params = {}) {
  const ts = Math.floor(Date.now() / 1000);
  const requestKey = aesEncryptHex(JSON.stringify(params), APP_CONFIG.requestAes.key, APP_CONFIG.requestAes.iv);
  const keys = rsaEncryptBase64(JSON.stringify(APP_CONFIG.requestAes), APP_CONFIG.requestPublicKey);
  const signBase = "token_id=" + APP_CONFIG.tokenId + ",token=" + APP_CONFIG.token + ",phone_type=" + APP_CONFIG.platform + ",request_key=" + requestKey + ",app_id=" + APP_CONFIG.productnumber + ",time=" + String(ts) + ",keys=" + keys;
  const signature = CryptoJS.MD5(signBase + "*" + APP_CONFIG.iosRequestSalt).toString().toUpperCase();
  return { token: APP_CONFIG.token, token_id: APP_CONFIG.tokenId, time: ts, app_id: APP_CONFIG.productnumber, phone_type: APP_CONFIG.platform, keys, request_key: requestKey, signature, ad_version: 1 };
}

function decryptResponse(responseData) {
  const aesInfo = JSON.parse(rsaDecryptBase64(responseData.keys, APP_CONFIG.responsePrivateKey));
  return JSON.parse(aesDecryptHex(responseData.response_key, aesInfo.key, aesInfo.iv));
}

async function refreshTokenIfNeeded() {
  await ensureLibs();
  const body = buildRequestBody({});
  const response = await Widget.http.post(APP_CONFIG.baseURL + "/App/Authentication/Authenticator/refresh", body, { headers: buildHeaders(), timeout: 8000 });
  const root = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  if (!root || root.code !== 200 || !root.data) return false;
  const data = decryptResponse(root.data);
  if (data && data.token) APP_CONFIG.token = data.token;
  if (data && typeof data.token_id !== "undefined") APP_CONFIG.tokenId = data.token_id;
  return true;
}

async function privatePost(path, params = {}) {
  await ensureLibs();
  let body = buildRequestBody(params);
  let response = await Widget.http.post(APP_CONFIG.baseURL + path, body, { headers: buildHeaders(), timeout: 8000 });
  let root = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  if (root && root.code === 451 && !__refreshTried) {
    __refreshTried = true;
    if (await refreshTokenIfNeeded()) {
      body = buildRequestBody(params);
      response = await Widget.http.post(APP_CONFIG.baseURL + path, body, { headers: buildHeaders(), timeout: 8000 });
      root = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    }
  }
  if (!root || root.code !== 200) throw new Error((root && root.msg) || "请求失败");
  return root.data && root.data.response_key ? decryptResponse(root.data) : (root.data || root);
}

function safeArray(v) { return Array.isArray(v) ? v : []; }

function cleanText(text) {
  return String(text || "")
    .replace(/[\u200B-\u200D\uFEFF\u2060\u00AD]/g, "")
    .trim();
}

function toInt(v, defVal = 0) {
  const n = parseInt(String(v == null ? "" : v).trim(), 10);
  return Number.isFinite(n) ? n : defVal;
}

const CN_NUMS = ["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"];

function extractSeasonNumber(text) {
  const t = cleanText(text);
  let m = t.match(/第\s*([一二三四五六七八九十]+|\d+)\s*[季部]/);
  if (m) {
    const v = m[1];
    if (/^\d+$/.test(v)) return parseInt(v, 10);
    const idx = CN_NUMS.indexOf(v);
    if (idx >= 0) return idx;
  }
  m = t.match(/Season\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/\bS(\d{1,2})\b/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/([一二三四五六七八九十])季$/);
  if (m) {
    const idx = CN_NUMS.indexOf(m[1]);
    if (idx >= 0) return idx;
  }
  return null;
}

function extractYear(text) {
  const m = cleanText(text).match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : "";
}

function stripSeasonHints(text) {
  return cleanText(text)
    .replace(/第\s*[一二三四五六七八九十0-9]+\s*[季部]/g, "")
    .replace(/Season\s*\d+/ig, "")
    .replace(/\bS\d{1,2}(E\d{1,2})?\b/ig, "")
    .trim();
}

function normalizeName(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[\s·•・:：\-–—_!！?？.,，。、"'`~()（）\[\]【】]/g, "");
}

function typeScoreByParams(item, params) {
  const tid = String(item.t_id || item.type_id || "");
  if (!tid) return 0;
  if (params.type === "movie") return tid === "1" ? 35 : -25;
  if (params.type === "tv") {
    if (tid === "1") return -45;
    if (tid === "2") return 30;
    return 8;
  }
  return 0;
}

function scoreCandidate(item, want, params) {
  const name = String(item.vod_name || item.title || "");
  const normName = normalizeName(name);
  const baseName = normalizeName(stripSeasonHints(name));
  const year = String(item.vod_year || "");
  const seasonNum = extractSeasonNumber(name);
  let score = 0;
  if (want.fullNorm && normName === want.fullNorm) score += 320;
  if (want.baseNorm && baseName === want.baseNorm) score += 220;
  if (want.baseNorm && (normName.includes(want.baseNorm) || want.baseNorm.includes(normName))) score += 45;
  score += typeScoreByParams(item, params);
  if (want.season > 0 && seasonNum === want.season) score += 40;
  if (want.season > 0 && seasonNum != null && seasonNum !== want.season) score -= 35;
  if (want.year && year === want.year) score += 70;
  if (want.year && year && year !== want.year) score -= 20;
  if (/解说|速看|合集|全系列|电影解说/.test(name)) score -= 60;
  return score;
}

function pickBestVod(list, params) {
  const rawSeries = cleanText(params.seriesName || params.title || "");
  const rawEpisodeName = cleanText(params.episodeName || "");
  const fullText = [rawSeries, rawEpisodeName].filter(Boolean).join(" ");
  const inferredSeason = toInt(params.season, 0) || extractSeasonNumber(fullText) || extractSeasonNumber(rawSeries) || extractSeasonNumber(rawEpisodeName) || 0;
  const inferredYear = String(params.premiereDate || "").slice(0, 4) || extractYear(fullText) || "";
  const baseTitle = stripSeasonHints(rawSeries || rawEpisodeName || fullText);
  const want = {
    season: inferredSeason,
    year: inferredYear,
    fullNorm: normalizeName(rawSeries || fullText),
    baseNorm: normalizeName(baseTitle || rawSeries || fullText)
  };
  const ranked = safeArray(list)
    .map(item => ({ item, score: scoreCandidate(item, want, params) }))
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return null;
  return ranked[0].item;
}

function parseParamQuery(text) {
  const out = {};
  String(text || "").split("&").forEach(part => {
    if (!part || part.indexOf("=") < 0) return;
    const idx = part.indexOf("=");
    const k = part.slice(0, idx);
    const v = part.slice(idx + 1);
    out[k] = v;
  });
  return out;
}

function pickEpisode(list, params) {
  const eps = safeArray(list);
  if (!eps.length) return null;
  if (params.type === "movie") return eps[0];
  const wantEp = toInt(params.episode, 0) || 1;
  for (const ep of eps) {
    const titleNum = String(ep.title || "").replace(/\D/g, "");
    if (titleNum && parseInt(titleNum, 10) === wantEp) return ep;
  }
  for (const ep of eps) {
    if (toInt(ep.sort, 0) === wantEp) return ep;
  }
  if (wantEp >= 1 && wantEp <= eps.length) return eps[wantEp - 1];
  return eps[0];
}

async function resolvePlayUrls(ep) {
  const out = [];
  for (const res of ["1080", "720", "480"]) {
    const slot = ((ep.play || {})[res]) || {};
    if (!slot.param || String(slot.show_type) !== "0") continue;
    const q = parseParamQuery(slot.param);
    if (!q.vod_d_id || !q.vurl_id) continue;
    try {
      const data = await privatePost("/App/Resource/VurlDetail/showOne", {
        vod_d_id: q.vod_d_id,
        vurl_id: q.vurl_id,
        domain_type: q.domain_type,
        resolution: res,
        type: "play"
      });
      if (data && data.url) {
        out.push({
          name: "瓜子影视 " + res + "P",
          description: "清晰度：" + res + "P" + (data.vip ? " VIP：" + data.vip : "") + (data.m3u8 ? " m3u8：" + data.m3u8 : ""),
          url: data.url
        });
      }
    } catch (e) {
      console.error("[瓜子影视] " + res + "P 解析失败:", e.message || e);
    }
  }
  return out;
}

async function loadResource(params) {
  try {
    const rawSeries = String(params.seriesName || params.title || "").trim();
    const rawEpisodeName = String(params.episodeName || "").trim();
    const searchKeyword = stripSeasonHints(rawSeries || rawEpisodeName || "") || rawSeries || rawEpisodeName;
    if (!searchKeyword) return [];
    const searchData = await privatePost("/App/Index/findMoreVod", { keywords: searchKeyword, order_val: "" });
    const best = pickBestVod(searchData && searchData.list, params);
    if (!best || !best.vod_id) return [];
    const vurlData = await privatePost("/App/Resource/Vurl/show", { vod_d_id: best.vod_id, vurl_cloud_id: "2" });
    const pickedEp = pickEpisode(vurlData && vurlData.list, params);
    if (!pickedEp) return [];
    return await resolvePlayUrls(pickedEp);
  } catch (error) {
    console.error("[瓜子影视] loadResource 失败:", error.message || error);
    throw error;
  }
}
