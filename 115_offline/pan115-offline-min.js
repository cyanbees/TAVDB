// ==================== 115 离线下载最小模块 v1.0 ====================
// 用途：
//   提供给其他 Forward Widget 模块（如 javdb）调用，完成 115 离线下载
//
// 接入方式：
//   eval(fs.readFileSync("./forward_player/pan115-offline-min.js", "utf8"));
//   或直接复制本文件内容到目标模块中
//
// 用法：
//   const { sign, time } = await getOfflineSpaceToken(cookie);
//   const result = await submitOfflineTask(cookie, magnet, { sign, time, uid });
//   // 或一步到位：
//   const result = await offlineOneClick(cookie, magnet);
//   // result = { state: true, info_hash: "..." }
//   // result = { state: false, error: "..." }
//
// 授权方式：手动输入 Cookie（115.com 域下的登录态 Cookie）
//
// 底层 API：
//   GET  https://115.com/?ct=offline&ac=space        → { sign, time }
//   POST https://115.com/web/lixian/?ct=lixian&ac=add_task_url  → { state }
//
// ==================== 常量 ====================

var OFFLINE_API_115 = "https://115.com";
var OFFLINE_TIMEOUT = 15000;

var OFFLINE_BASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://115.com/",
  "Origin": "https://115.com"
};

// ==================== HTTP 封装 ====================

async function offlineHttpGet(url, options) {
  options = options || {};
  var finalOptions = {
    headers: Object.assign({}, OFFLINE_BASE_HEADERS, options.headers || {}),
    timeout: options.timeout || OFFLINE_TIMEOUT
  };

  var resp = await Widget.http.get(url, finalOptions);
  if (!resp || resp.statusCode !== 200) {
    throw new Error("HTTP " + (resp && resp.statusCode || "unknown") + ": " + url.slice(0, 80));
  }
  return resp.data;
}

function offlineCookieHeader(cookie) {
  if (!cookie) return {};
  return { "Cookie": cookie };
}

// ==================== 核心函数 ====================

/**
 * 从 Cookie 首段提取 UID
 * Cookie 格式通常为: UID=xxx; CID=...; SEID=...; ...
 */
function extractUidFromCookie(cookie) {
  var first = String(cookie || "").split(";")[0].trim();
  var idx = first.indexOf("=");
  return idx >= 0 ? first.slice(idx + 1) : "";
}

/**
 * 获取 115 离线 token (sign + time)
 * GET https://115.com/?ct=offline&ac=space
 * 返回: { sign, time, size, limit }
 * 需要 Cookie 处于登录态
 */
async function getOfflineSpaceToken(cookie) {
  var url = OFFLINE_API_115 + "/?ct=offline&ac=space&_=" + Date.now();
  var raw = await offlineHttpGet(url, { headers: offlineCookieHeader(cookie) });
  var json = null;
  if (typeof raw === "string") {
    json = JSON.parse(raw);
  } else if (raw && typeof raw === "object") {
    json = raw;
  } else {
    throw new Error("space 返回格式异常: " + String(raw));
  }
  if (json.state !== true) {
    throw new Error("space 获取失败: " + (json.error || json.error_msg || JSON.stringify(json)));
  }
  return {
    sign: json.sign,
    time: json.time,
    size: json.size,
    limit: json.limit
  };
}

/**
 * 提交一条磁力链离线任务
 * POST https://115.com/web/lixian/?ct=lixian&ac=add_task_url
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ sign: string, time: string|number, uid?: string }} tokenObj - 离线授权参数
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function submitOfflineTask(cookie, magnet, tokenObj) {
  // 只取前 60 字符（刚好保留完整 btih hash）
  var maglink = String(magnet || "").trim();
  var uid = tokenObj.uid || extractUidFromCookie(cookie);
  var body = "url=" + encodeURIComponent(maglink)
           + "&uid=" + encodeURIComponent(uid)
           + "&sign=" + encodeURIComponent(tokenObj.sign)
           + "&time=" + encodeURIComponent(tokenObj.time);

  var raw = await Widget.http.post(
    OFFLINE_API_115 + "/web/lixian/?ct=lixian&ac=add_task_url",
    body,
    {
      headers: Object.assign({}, OFFLINE_BASE_HEADERS, offlineCookieHeader(cookie), {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": OFFLINE_API_115 + "/",
        "Origin": OFFLINE_API_115
      }),
      timeout: 20000
    }
  );

  var data = raw && raw.data;
  var json = null;
  if (typeof data === "string") {
    json = JSON.parse(data);
  } else if (data && typeof data === "object") {
    json = data;
  } else {
    throw new Error("POST 返回格式异常: " + String(data));
  }

  if (json.state === true) {
    return { state: true, info_hash: json.info_hash || "" };
  }
  return {
    state: false,
    error: json.errcode === "911"
      ? "账号使用异常，请手工验证"
      : (json.error_msg || json.error || "未知错误"),
    errcode: json.errcode,
  };
}

/**
 * 一键离线：space token → 提交任务
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ uid?: string }} [opts] - 可选参数，不传则自动从 cookie 提取 uid
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function offlineOneClick(cookie, magnet, opts) {
  opts = opts || {};
  var token = await getOfflineSpaceToken(cookie);
  return submitOfflineTask(cookie, magnet, {
    sign: token.sign,
    time: token.time,
    uid: opts.uid || "",
  });
}
