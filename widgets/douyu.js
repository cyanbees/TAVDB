// ============================================================
//  斗鱼直播 — 视频列表、详情与搜索模块
//  源站: https://www.douyu.com
//  API JSON (直播流)
// ============================================================

WidgetMetadata = {
  id: "forward.video-douyu",
  title: "斗鱼直播",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  description: "斗鱼直播平台，支持网游、单机、手游、娱乐等分类浏览、搜索和观看直播",
  author: "SmartBook",
  site: "https://www.douyu.com",
  globalParams: [
    {
      name: "douyuCookie",
      title: "斗鱼 Cookie",
      type: "input",
      description: "登录 douyu.com 后从浏览器复制的 Cookie，可观看高清直播。扫码获取: 运行 node douyu-login-server.js 后访问 http://localhost:3000",
      placeholders: [{ title: "acf_auth=...; acf_ltkid=...", value: "acf_auth=" }]
    }
  ],
  detailCacheDuration: 30,
  modules: [
    {
      id: "recommended",
      title: "推荐直播",
      functionName: "loadRecommended",
      cacheDuration: 60,
      params: [
        {
          name: "sort_by",
          title: "分类",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部推荐", value: "all" },
            { title: "英雄联盟", value: "1" },
            { title: "王者荣耀", value: "181" },
            { title: "DOTA2", value: "3" },
            { title: "CS2", value: "6" },
            { title: "穿越火线", value: "33" },
            { title: "无畏契约", value: "1554" },
            { title: "魔兽世界", value: "5" },
            { title: "DNF", value: "40" },
            { title: "炉石传说", value: "2" },
            { title: "三角洲行动", value: "4133" },
            { title: "APEX", value: "651" },
            { title: "永劫无间", value: "1227" },
            { title: "主机游戏", value: "19" },
            { title: "逃离塔科夫", value: "1024" },
            { title: "DNF手游", value: "1092" },
            { title: "金铲铲之战", value: "2556" },
            { title: "原神", value: "1223" },
            { title: "和平精英", value: "350" },
            { title: "崩坏：星穹铁道", value: "3379" },
            { title: "暗区突围", value: "3133" },
            { title: "火影忍者", value: "196" },
            { title: "蛋仔派对", value: "3358" },
            { title: "第五人格", value: "356" },
            { title: "星秀", value: "1008" },
            { title: "户外", value: "124" },
            { title: "颜值", value: "201" },
            { title: "派对", value: "1221" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "直播源",
      type: "stream",
      functionName: "loadResource",
      cacheDuration: 0,
      params: [
        { name: "link", title: "房间ID", type: "input" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchRooms",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ========== 常量 ==========

var PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43";
var MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";
var DOUYU_DID = "10000000000000000000000000001501";
var DOUYU_COOKIE = "";

// ========== MD5 实现（纯 JS，用于斗鱼签名） ==========

function md5(str) {
  var hexcase = 0;
  var chrsz = 8;

  function md5_ff(a, b, c, d, x, s, ac) {
    a = md5_cmn((b & c) | ((~b) & d), a, b, x, s, ac);
    return a;
  }

  function md5_gg(a, b, c, d, x, s, ac) {
    a = md5_cmn((b & d) | (c & (~d)), a, b, x, s, ac);
    return a;
  }

  function md5_hh(a, b, c, d, x, s, ac) {
    a = md5_cmn(b ^ c ^ d, a, b, x, s, ac);
    return a;
  }

  function md5_ii(a, b, c, d, x, s, ac) {
    a = md5_cmn(c ^ (b | (~d)), a, b, x, s, ac);
    return a;
  }

  function md5_cmn(q, a, b, x, s, t) {
    a = safe_add(a, q);
    a = safe_add(a, x);
    a = safe_add(a, t);
    a = bit_rol(a, s);
    return safe_add(b, a);
  }

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
  }

  function core_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return [a, b, c, d];
  }

  function str2binl(str) {
    var bin = [];
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    }
    return bin;
  }

  function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
        hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
  }

  return hex_md5(str);
}

// ========== 工具函数 ==========

function generateRandomHex(length) {
  var chars = "0123456789abcdef";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * 16));
  }
  return result;
}

function htmlUnescape(str) {
  if (!str) return "";
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

// ========== 请求封装 ==========

async function request(url, opts) {
  opts = opts || {};
  if (!opts.headers) opts.headers = {};
  if (!opts.headers["User-Agent"]) {
    opts.headers["User-Agent"] = PC_UA;
  }
  if (DOUYU_COOKIE && !opts.headers["Cookie"]) {
    opts.headers["Cookie"] = DOUYU_COOKIE;
  }
  var res;
  if (opts.method === "POST" || opts.body !== undefined) {
    var body = opts.body || "";
    delete opts.body;
    res = await Widget.http.post(url, body, opts);
  } else {
    res = await Widget.http.get(url, opts);
  }
  if (!res || res.data === undefined || res.data === null) {
    throw new Error("无效响应 from " + url);
  }
  return res;
}

// ========== 斗鱼签名 ==========

function getDouyuSign(crptext, roomId) {
  try {
    // 极简 CryptoJS polyfill：斗鱼加密脚本通常只调用 MD5 + enc.Utf8/Hex
    var CryptoJS = {
      MD5: function (str) {
        var hash = md5(String(str));
        return { toString: function () { return hash; } };
      },
      enc: {
        Utf8: {
          parse: function (str) { return str; },
          stringify: function (v) { return String(v); }
        },
        Hex: {
          parse: function (str) { return str; },
          stringify: function (v) { return String(v); }
        }
      },
      lib: {
        WordArray: function () {}
      }
    };
    var time = Math.round(Date.now() / 1000);
    eval(crptext);
    var result = ub98484234(roomId, DOUYU_DID, time);
    return result;
  } catch (e) {
    console.error("[DouyuSign] eval error: " + (e.message || e));
    return "";
  }
}

// ========== 获取房间信息 ==========

async function getRoomInfo(roomId) {
  var res = await request("https://www.douyu.com/betard/" + roomId, {
    headers: {
      "Referer": "https://www.douyu.com/" + roomId
    }
  });
  var data = res.data;
  if (data && data.room) {
    return data.room;
  }
  return null;
}

// ========== 获取加密JS ==========

async function getEncryptJS(roomId) {
  var res = await request("https://www.douyu.com/swf_api/homeH5Enc?rids=" + roomId, {
    headers: {
      "Referer": "https://www.douyu.com/" + roomId
    }
  });
  var data = res.data;
  if (data && data.data && data.data["room" + roomId]) {
    return data.data["room" + roomId];
  }
  return null;
}

// ========== 获取播放地址 ==========

async function getPlayUrl(roomId, signData, rate, cdn) {
  try {
    var bodyStr = signData + "&cdn=" + (cdn || "") + "&rate=" + (rate || 0) +
      "&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";

    var res = await request("https://www.douyu.com/lapi/live/getH5Play/" + roomId, {
      method: "POST",
      body: bodyStr,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://www.douyu.com/" + roomId
      }
    });
    var result = res.data;
    if (!result || !result.data || !result.data.rtmp_url || !result.data.rtmp_live) {
      return null;
    }

    var d = result.data;
    var rtmpUrl = d.rtmp_url;
    var rtmpLive = htmlUnescape(String(d.rtmp_live));
    var flvUrl = rtmpUrl + "/" + rtmpLive;

    var hlsUrl = null;
    if (d.hls_url && d.hls_live) {
      hlsUrl = d.hls_url + "/" + htmlUnescape(String(d.hls_live));
    }

    return { url: hlsUrl || flvUrl, flvUrl: flvUrl };
  } catch (e) {
    console.error("[getPlayUrl] error: " + (e.message || e));
    return null;
  }
}

var SKIP_REDIRECT_PROBE_HEADER = "X-Forward-Skip-Redirect-Probe";

function isFlvUrl(url) {
  return /\.flv(?:\?|$)/i.test(String(url || ""));
}

function buildPlaybackHeaders(roomId, url) {
  var headers = {
    "User-Agent": PC_UA,
    "Referer": "https://www.douyu.com/" + roomId
  };
  if (DOUYU_COOKIE) {
    headers["Cookie"] = DOUYU_COOKIE;
  }
  if (isFlvUrl(url)) {
    headers[SKIP_REDIRECT_PROBE_HEADER] = "1";
  }
  return headers;
}

function buildVideoResource(roomId, name, url, description) {
  return {
    name: name,
    description: description,
    url: url,
    customHeaders: buildPlaybackHeaders(roomId, url),
    playerType: "app"
  };
}

// ========== 获取分类推荐房间 ==========

async function fetchCateRooms(cate1Id, cate2Info, maxItems) {
  try {
    maxItems = maxItems || 8;
    // 找到该一级分类下的第一个二级分类
    var subCate = null;
    for (var s = 0; s < cate2Info.length; s++) {
      if (cate2Info[s].cate1Id === cate1Id) {
        subCate = cate2Info[s];
        break;
      }
    }
    if (!subCate) return [];

    var res = await request(
      "https://www.douyu.com/gapi/rkc/directory/mixList/2_" + subCate.cate2Id + "/1"
    );
    var listData = res.data;
    var rl = (listData && listData.data && listData.data.rl) || [];
    var items = [];
    var count = Math.min(rl.length, maxItems);
    for (var i = 0; i < count; i++) {
      var item = rl[i];
      if (item.type !== 1) continue;
      items.push({
        id: String(item.rid || ""),
        type: "url",
        title: String(item.rn || ""),
        coverUrl: String(item.rs16 || ""),
        vod_remarks: String(item.nn || ""),
        link: String(item.rid || ""),
        backdropPath: null,
        description: String(item.nn || "") + " - " + String(item.rn || "")
      });
    }
    return items;
  } catch (e) {
    console.error("[fetchCateRooms] error: " + (e.message || e));
    return [];
  }
}

// ========== 推荐直播（首页 + 分类过滤 + sort_by 分类选择） ==========

async function loadRecommended(params) {
  try {
    DOUYU_COOKIE = params.douyuCookie || "";
    // 1. 优先处理 genreId 路由（从详情页分类标签点进来）
    if (params.genreId) {
      return await loadCategoryRooms(params.genreId, params.page || 1);
    }

    // 2. 处理 sort_by 分类选择（值为子分类 cate2Id，直接传入）
    var selectedCate = params.sort_by || "all";
    if (selectedCate !== "all") {
      return await loadCategoryRooms(selectedCate, params.page || 1);
    }

    // 3. sort_by === "all"：默认混合推荐视图
    var page = Number(params.page || 1);

    if (page > 1) {
      // 翻页时使用全部推荐列表（斗鱼无"所有分类混合"的翻页API，allpage 是唯一可翻页的端点）
      // 首页按分类聚合展示，翻页后降级为全站推荐扁平列表
      var res = await request(
        "https://www.douyu.com/japi/weblist/apinc/allpage/6/" + page
      );
      var data = res.data;
      var rl = (data && data.data && data.data.rl) || [];
      return parseRoomList(rl);
    }

    // 首页：获取分类列表 + 每个分类的推荐房间
    var cateRes = await request("https://m.douyu.com/api/cate/list", {
      headers: { "User-Agent": MOBILE_UA }
    });
    var cateData = cateRes.data;

    if (!cateData || !cateData.data) {
      // 降级：使用全部推荐
      var fallbackRes = await request("https://www.douyu.com/japi/weblist/apinc/allpage/6/1");
      var fbData = fallbackRes.data;
      var fbRl = (fbData && fbData.data && fbData.data.rl) || [];
      return parseRoomList(fbRl);
    }

    var cate1Info = cateData.data.cate1Info || [];
    cate1Info.sort(function (a, b) {
      return (a.cate1Id || 0) - (b.cate1Id || 0);
    });

    var maxCates = Math.min(cate1Info.length, 6);
    var allRooms = [];
    var promises = [];

    for (var c = 0; c < maxCates; c++) {
      promises.push(fetchCateRooms(cate1Info[c].cate1Id, cateData.data.cate2Info || [], 4));
    }

    var results = await Promise.all(promises);
    for (var r = 0; r < results.length; r++) {
      allRooms = allRooms.concat(results[r]);
    }

    return allRooms;
  } catch (error) {
    console.error("[loadRecommended] 失败:", error.message || error);
    throw error;
  }
}

// ========== 分类房间列表 ==========

async function loadCategoryRooms(typeId, page) {
  try {
    if (!page) page = 1;

    var res = await request(
      "https://www.douyu.com/gapi/rkc/directory/mixList/2_" + typeId + "/" + page
    );
    var rs = res.data;

    var rl = (rs && rs.data && rs.data.rl) || [];
    return parseRoomList(rl);
  } catch (error) {
    console.error("[loadCategoryRooms] 失败:", error.message || error);
    throw error;
  }
}

function parseRoomList(rl) {
  var items = [];
  for (var i = 0; i < rl.length; i++) {
    var item = rl[i];
    if (item.type !== 1) continue;
    items.push({
      id: String(item.rid || ""),
      type: "url",
      title: String(item.rn || ""),
      coverUrl: String(item.rs16 || ""),
      vod_remarks: String(item.nn || ""),
      link: String(item.rid || ""),
      backdropPath: null,
      description: String(item.nn || "") + " - " + String(item.rn || "")
    });
  }
  return items;
}

// ========== 搜索 ==========

async function searchRooms(params) {
  try {
    DOUYU_COOKIE = params.douyuCookie || "";
    var keyword = params.keyword;
    var page = Number(params.page || 1);

    if (!keyword) throw new Error("请输入搜索关键词");

    var did = generateRandomHex(32);
    var url = "https://www.douyu.com/japi/search/api/searchShow?kw=" +
      encodeURIComponent(keyword) + "&page=" + page + "&pageSize=20";

    var res = await request(url, {
      headers: {
        "Referer": "https://www.douyu.com/search/",
        "Cookie": "dy_did=" + did + ";acf_did=" + did
      }
    });
    var result = res.data;

    if (result && result.error !== 0) {
      throw new Error("搜索API错误: " + (result.msg || "未知错误"));
    }

    var items = [];
    var relateShow = (result && result.data && result.data.relateShow) || [];

    for (var i = 0; i < relateShow.length; i++) {
      var item = relateShow[i];
      items.push({
        id: String(item.rid || ""),
        type: "url",
        title: String(item.roomName || ""),
        coverUrl: String(item.roomSrc || ""),
        vod_remarks: String(item.nickName || ""),
        link: String(item.rid || ""),
        backdropPath: null,
        description: String(item.nickName || "") + " - " + String(item.roomName || "")
      });
    }

    return items;
  } catch (error) {
    console.error("[searchRooms] 失败:", error.message || error);
    throw error;
  }
}

// ========== 房间详情 ==========

async function loadDetail(link) {
  try {
    var roomId = String(link);

    // 1. 获取房间信息
    var roomInfo = await getRoomInfo(roomId);
    if (!roomInfo) throw new Error("无法获取房间信息: " + roomId);

    var title = String(roomInfo.room_name || "");
    var ownerName = String(roomInfo.owner_name || "");
    var roomPic = String(roomInfo.room_pic || "");
    var showDetails = String(roomInfo.show_details || "");
    var isLive = roomInfo.show_status === 1 && roomInfo.videoLoop !== 1;

    return {
      id: "room_" + roomId,
      type: "url",
      title: title,
      coverUrl: roomPic,
      link: roomId,
      backdropPath: null,
      description: showDetails || (isLive ? "直播中 - 主播: " + ownerName : "未开播"),
      genreItems: [{
        id: String(roomInfo.cate_id || roomInfo.cate1_id || roomInfo.game_id || "unknown"),
        title: String(roomInfo.second_lvl_name || roomInfo.cate_name || roomInfo.game_name || "未知分类")
      }],
      peoples: [{
        id: ownerName,
        title: ownerName,
        role: "主播"
      }],
      vod_remarks: isLive ? "直播中" : "未开播"
    };
  } catch (error) {
    console.error("[loadDetail] 失败:", error.message || error);
    throw error;
  }
}

// ========== 直播流获取（type: stream 模块，按播放时实时生成） ==========

async function loadResource(params) {
  try {
    params = params || {};
    DOUYU_COOKIE = params.douyuCookie || "";
    var roomId = String(params.link || params.roomId || "").trim();
    if (!roomId) {
      throw new Error("缺少房间ID");
    }

    var roomInfo = await getRoomInfo(roomId);
    if (!roomInfo) {
      throw new Error("无法获取房间信息: " + roomId);
    }
    var isLive = roomInfo.show_status === 1 && roomInfo.videoLoop !== 1;
    if (!isLive) {
      return [];
    }

    var crptext = await getEncryptJS(roomId);
    if (!crptext) {
      throw new Error("无法获取斗鱼签名脚本: " + roomId);
    }

    var signData = getDouyuSign(crptext, roomId);
    if (!signData) {
      throw new Error("无法生成斗鱼播放签名: " + roomId);
    }

    var roomName = String(roomInfo.room_name || "");
    var ownerName = String(roomInfo.owner_name || "");
    var description = ownerName ? (ownerName + " - " + roomName) : roomName;

    // 发现请求：获取所有可用码率和 CDN
    var discBody = signData + "&cdn=&rate=-1&ver=Douyu_223061205&iar=1&ive=1&hevc=0&fa=0";
    var discRes = await request("https://www.douyu.com/lapi/live/getH5Play/" + roomId, {
      method: "POST",
      body: discBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://www.douyu.com/" + roomId
      }
    });
    var discData = discRes.data;
    if (!discData || !discData.data) {
      return [];
    }

    // 收集 CDN 列表（scdn 放最后）
    var cdns = [];
    var cdnsWithName = discData.data.cdnsWithName || [];
    for (var ci = 0; ci < cdnsWithName.length; ci++) {
      cdns.push(String(cdnsWithName[ci].cdn || ""));
    }
    cdns.sort(function (a, b) {
      var aS = a.indexOf("scdn") === 0 ? 1 : 0;
      var bS = b.indexOf("scdn") === 0 ? 1 : 0;
      return aS - bS;
    });

    // 收集码率并按 rate 降序（原画优先，排前面为默认选中）
    var rates = discData.data.multirates || [];
    rates.sort(function (a, b) { return (b.rate || 0) - (a.rate || 0); });

    // 遍历每个码率，获取播放地址
    var resources = [];
    for (var ri = 0; ri < rates.length; ri++) {
      var rateVal = rates[ri].rate || 0;
      var rateName = String(rates[ri].name || "未知");

      // 先试该码率下所有 CDN
      var url = null;
      for (var ci = 0; ci < cdns.length; ci++) {
        var playInfo = await getPlayUrl(roomId, signData, rateVal, cdns[ci]);
        if (playInfo && playInfo.url) {
          url = playInfo.url;
          break;
        }
      }
      // 再试空 CDN
      if (!url) {
        var playInfo2 = await getPlayUrl(roomId, signData, rateVal, "");
        if (playInfo2 && playInfo2.url) url = playInfo2.url;
      }

      if (url) {
        resources.push(buildVideoResource(roomId, rateName, url, description));
      }
    }

    return resources;
  } catch (error) {
    console.error("[loadResource] 失败:", error.message || error);
    throw error;
  }
}
