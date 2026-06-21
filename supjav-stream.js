// ============================================================
//  supjav-stream - Supjav 播放源模块
//  用途：从 Supjav 获取 HLS 视频流，聚合到详情页
//  数据流：
//    detail page → TV data-link → reverse → supremejav API → master m3u8
//
//  重要：不拆分子播放列表，直接返回 master m3u8 URL。
//  因为 master 中包含音频轨条目（伪装成 480P/720P 分辨率但码率仅
//  52~105kbps），播放器解析 master 后会自动合并视频+音频轨。
//  直接播放子列表（如 1080P 纯视频 URL）会无声。
// ============================================================

WidgetMetadata = {
  id: "supjav.stream",
  title: "Supjav Stream",
  description: "通过番号匹配 Supjav 播放源",
  author: "EL",
  site: "https://supjav.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "Supjav 播放源",
      description: "从 Supjav 获取 HLS 视频流（master m3u8，含音轨）",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

// ==================== 常量 ====================

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15";

const SUPJAV_BASE = "https://supjav.com";

const REQUEST_TIMEOUT = 15000;

const WORKER_BASE = "https://supjav-proxy.cybees7.workers.dev";

function reverseString(s) {
  return String(s || "").split("").reverse().join("");
}

function getText(value) {
  return String(value || "").trim();
}

/**
 * 根据 m3u8 URL 生成 customHeaders
 */
function headersFor(url) {
  let referer = SUPJAV_BASE + "/";

  try {
    const origin = new URL(url).origin;
    referer = origin + "/";
  } catch (e) {
    console.warn("[supjav-stream] 解析 URL 失败，使用默认 Referer:", url, e.message || e);
  }

  return {
    "Referer": referer,
    "User-Agent": UA,
    "Accept": "*/*"
  };
}

/**
 * 从文本中提取番号 / ID
 *
 * 参考 missav_stream_v1.2 的 extractSearchCode + pan115_v1.3.1 的 extractNumber：
 * - pan115: 用两段捕获组 ([A-Z]{2,15})[- ]?(\d{2,10}) 输出 "番号-数字" 格式
 * - missav: allowPureNumeric 控制是否匹配纯数字，避免深层扫描误匹配
 * - 已知厂商标识列表优先匹配
 *
 * @param {string} text   输入文本
 * @param {object} options
 * @param {boolean} options.allowPureNumeric  是否允许纯数字（默认 true）
 * @param {boolean} options.allowHtmlId       是否允许 .html 中的数字 ID（默认 true）
 * @returns {string} 提取的番号/ID，或空字符串
 */
function extractSearchCode(text, options = {}) {
  const allowPureNumeric = options.allowPureNumeric !== false;
  const allowHtmlId = options.allowHtmlId !== false;

  let s = getText(text).toUpperCase();
  if (!s) return "";

  // 1. 去掉域名前缀: hhd800.com@, hhb800.com@, xxx.yyy@
  s = s.replace(/^[A-Z0-9]+(?:\.[A-Z0-9]+)+@/, "");

  // 2. 去掉已知资源站脏前缀(域名无@后缀时)
  s = s.replace(/^(?:HHD800|HHB800)[_\-@.\s]?/, "");

  // 3. 分隔符归一化
  const normalized = s
    .replace(/\./g, " ")
    .replace(/_/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  // 4. 已知厂商标识优先匹配（FC2/CARIB/1PONDO/HEYZO/T28 由下方独立拼接处理）
  const knownMakerPattern = /\b(?:SONE|S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS|ESD|GVG|REAL|LAF|SMD|MD|BAD|MOND|ARSO|MOCKY|FONE|GANA|MUKO|PAPA|RASH|TAMA|ZUKO|HEY|PACO)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/i;

  const makerMatch = normalized.match(knownMakerPattern);
  if (makerMatch?.[0]) {
    return makerMatch[0]
      .replace(/\s+/g, "")
      .replace(/_/g, "-")
      .replace(/-+/g, "-")
      .toUpperCase();
  }

  // FC2
  let fc2m = normalized.match(/\bFC2(?:[- ]?PPV)?[- ]?(\d{5,8})\b/i);
  if (fc2m) return "FC2-" + fc2m[1];
  let caribm = normalized.match(/\bCARIB[- ]?(\d{6,8})\b/i);
  if (caribm) return "CARIB-" + caribm[1];
  let pondom = normalized.match(/\b1PONDO[- ]?(\d{6,8})\b/i);
  if (pondom) return "1PONDO-" + pondom[1];
  let heyzom = normalized.match(/\bHEYZO[- ]?(\d{3,6})\b/i);
  if (heyzom) return "HEYZO-" + heyzom[1];
  let t28m = normalized.match(/\bT28[- ]?(\d{6,8})\b/i);
  if (t28m) return "T28-" + t28m[1];

  // 6. 通用 JAV 番号: 字母部分 + 数字部分（来自 pan115 的两段捕获组方式）
  //    格式统一为 "SSNI-123"
  const genericPattern = /\b([A-Za-z]{2,15})\s*[-_ ]?\s*(\d{2,10})\b/;
  const genericMatch = normalized.match(genericPattern);
  if (genericMatch) {
    const letters = genericMatch[1].toUpperCase();
    const digits = genericMatch[2];
    return letters + "-" + digits;
  }

  // 7. 纯数字匹配（Supjav 使用数值 ID 如 422598）
  if (allowPureNumeric) {
    const numMatch = s.match(/\b(\d{4,8})\b/);
    if (numMatch) return numMatch[1];
  }

  // 8. 从 URL 中提取纯数字 ID (如 https://supjav.com/422598.html)
  if (allowHtmlId) {
    const urlNumMatch = s.match(/(\d{4,8})\.html/);
    if (urlNumMatch) return urlNumMatch[1];
  }

  return "";
}

function collectStringValues(value, depth = 0, out = [], visited = new Set()) {
  if (value === null || value === undefined) return out;
  if (depth > 5) return out;

  const valueType = typeof value;

  if (valueType === "string" || valueType === "number") {
    const text = String(value).trim();
    if (text) out.push(text);
    return out;
  }

  if (valueType !== "object") return out;
  if (visited.has(value)) return out;
  visited.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringValues(item, depth + 1, out, visited);
    }
    return out;
  }

  for (const key of Object.keys(value)) {
    collectStringValues(value[key], depth + 1, out, visited);
  }

  return out;
}

function extractCodeFromParams(params = {}) {
  // 优先级字段
  const candidates = [
    params.code,
    params.videoId,
    params.number,
    params.id,
    params.title,
    params.name,
    params.fileName,
    params.filename,
    params.file_name,
    params.path,
    params.filePath,
    params.file_path,
    params.mediaPath,
    params.media_path,
    params.itemPath,
    params.item_path,
    params.localPath,
    params.local_path,
    params.originalFilename,
    params.originalFileName,
    params.originalTitle,
    params.originalName,
    params.episodeName,
    params.description,
    params.genreTitle,
    params.overview,
    params.seriesName,
    params.link,
    params.url,
    params.videoUrl,
    params.playUrl,
    params.streamUrl
  ];

  // 嵌套对象
  if (params.tmdbInfo) {
    candidates.push(
      params.tmdbInfo.title, params.tmdbInfo.name,
      params.tmdbInfo.originalTitle, params.tmdbInfo.originalName,
      params.tmdbInfo.overview
    );
  }
  if (params.info) {
    candidates.push(
      params.info.title, params.info.name,
      params.info.originalTitle, params.info.originalName,
      params.info.overview
    );
  }
  if (params.mediaSource) {
    candidates.push(
      params.mediaSource.name, params.mediaSource.fileName,
      params.mediaSource.filename, params.mediaSource.path,
      params.mediaSource.url, params.mediaSource.streamUrl
    );
  }
  if (Array.isArray(params.mediaSources)) {
    for (const source of params.mediaSources) {
      if (source) {
        candidates.push(
          source.name, source.fileName, source.filename,
          source.path, source.url, source.streamUrl
        );
      }
    }
  }

  for (const value of candidates) {
    const code = extractSearchCode(value, { allowPureNumeric: true });
    if (code) return code;
  }

  // 递归扫描（不允许纯数字，避免误把日期/ID/时间戳当成番号）
  const allStrings = collectStringValues(params);
  for (const value of allStrings) {
    const code = extractSearchCode(value, { allowPureNumeric: false, allowHtmlId: false });
    if (code) return code;
  }

  return "";
}

// ==================== HTTP 封装 ====================

async function httpGet(url, options = {}) {
  const finalOptions = {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": SUPJAV_BASE + "/",
      ...(options.headers || {})
    },
    timeout: options.timeout || REQUEST_TIMEOUT
  };

  const resp = await Widget.http.get(url, finalOptions);

  if (!resp) {
    throw new Error(`HTTP 无响应: ${url}`);
  }

  return resp;
}

// ==================== 核心流程 ====================

/**
 * 通过 Cloudflare Worker 代理获取 master m3u8
 * Worker 从 Cloudflare 网络请求 Supjav，绕过 Cloudflare 反爬
 * @param {string} code - 纯数字 ID（如 333438）或 JAV 番号（如 MIMK-280）
 * @returns {string} master m3u8 URL
 */
async function getMasterViaWorker(code) {
  const isNumeric = /^\d{4,8}$/.test(code);
  const workerUrl = isNumeric
    ? `${WORKER_BASE}/?id=${code}&fmt=json`
    : `${WORKER_BASE}/?q=${encodeURIComponent(code)}&fmt=json`;

  console.log("[supjav-stream] 请求 Worker:", isNumeric ? `id=${code}` : `q=${code}`);

  const resp = await httpGet(workerUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": UA
    },
    timeout: 20000
  });

  if (resp.statusCode !== 200) {
    let errMsg = `Worker HTTP ${resp.statusCode}`;
    try {
      const body = JSON.parse(resp.data || "{}");
      if (body.error) errMsg = "Worker: " + body.error;
    } catch (e) {}
    throw new Error(errMsg);
  }

  let body;
  try {
    body = JSON.parse(resp.data || "{}");
  } catch (e) {
    throw new Error("Worker 返回非 JSON 响应");
  }

  if (!body.url) {
    throw new Error("Worker 返回中未找到 url: " + (body.error || "未知错误"));
  }

  console.log("[supjav-stream] Worker 返回 master m3u8:", body.url);
  return body.url;
}

// ==================== Stream 输出 ====================

function buildStreamItem(masterUrl, detailUrl, code) {
  const displayName = code ? `[${code}] 1080P` : "Supjav Auto";
  return {
    name: displayName,
    description:
      `来源：Supjav TV\n` +
      `模式：Master playlist（含音轨）\n` +
      `番号：${code || "（未知）"}\n` +
      `详情页：${detailUrl}`,
    url: masterUrl,
    customHeaders: headersFor(masterUrl)
  };
}

// ==================== 主入口 ====================

async function loadResource(params = {}) {
  console.log("[supjav-stream] loadResource 开始，params:", JSON.stringify(params));

  let code = "";
  try {
    // 1. 提取番号 / ID
    code = extractCodeFromParams(params);
    console.log("[supjav-stream] 提取到 code:", code);

    // 2. 通过 Worker 获取 master m3u8
    if (code) {
      const masterUrl = await getMasterViaWorker(code);
      const detailId = /^\d{4,8}$/.test(code) ? code : "（搜索获取）";
      const detailUrl = `${SUPJAV_BASE}/${detailId}.html`;
      return [buildStreamItem(masterUrl, detailUrl, code)];
    }

    // 3. 未提取到番号，不返回任何源
    console.log("[supjav-stream] 未提取到番号，跳过");
    return [];

  } catch (error) {
    console.error("[supjav-stream] loadResource 失败:", error.message || error);
    return [];
  }
}
