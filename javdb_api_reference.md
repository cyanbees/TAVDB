# JavDB API 完整参考

> 版本：v1.0 · 最后更新：2026-06-09
> 用途：可直接作为上下文引入，在代码中调用 JavDB API

## 目录

1. [认证与签名](#1-认证与签名)
2. [通用请求头](#2-通用请求头)
3. [无需登录的端点](#3-无需登录的端点)
4. [需要登录的端点](#4-需要登录的端点)
5. [数据结构](#5-数据结构)
6. [图片 URL 清洗](#6-图片-url-清洗)
7. [缓存策略](#7-缓存策略)
8. [用户使用流程](#8-用户使用流程)
9. [常见错误与处理](#9-常见错误与处理)
10. [附录：MD5 实现](#10-附录md5-实现)

---

## 1. 认证与签名

### 1.1 签名头 jdSignature（所有请求必须）

```javascript
const SECRET_KEY = '71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa';

function generateJavdbSignature() {
  const timestamp = Math.floor(Date.now() / 1000);
  const signBase = `${timestamp}${SECRET_KEY}`;
  const signHash = md5(signBase);
  return `${timestamp}.lpw6vgqzsp.${signHash}`;
}
```

**格式：** `{timestamp}.lpw6vgqzsp.{md5(timestamp + secretKey)}`

签名基于逆向 JavDB App 得到的硬编码 secretKey + 时间戳 MD5。每次请求都需要重新生成（时间戳每次不同）。

### 1.2 用户登录（需登录的端点必做）

**端点：** `POST /api/v1/sessions`
**Host：** `jdforrepam.com`

**请求参数（query string）：**
| 参数 | 值 | 说明 |
|---|---|---|
| username | 用户名或邮箱 | |
| password | 密码 | |
| device_uuid | 04b9534d-5118-53de-9f87-2ddded77111e | 固定值 |
| device_name | Chrome | 固定值 |
| device_model | Browser | 固定值 |
| platform | web | 固定值 |
| system_version | 1.0 | 固定值 |
| app_version | official | 固定值 |
| app_version_number | 1.9.29 | 固定值 |
| app_channel | official | 固定值 |

**请求头：** 同通用请求头（含 jdSignature）

**成功响应：**
```json
{
  "success": 1,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**登录后使用 Token：** 在后续请求的 Header 中添加：
```
Authorization: Bearer {token}
```

Token 有效期约 30 天。建议将 token + 过期时间存储在 localStorage 中避免频繁登录。

### 1.3 凭据加密存储

```javascript
// 加密（Base64 + 字符偏移混淆）
function encryptCredentials(username, password) {
  const data = JSON.stringify({ u: username, p: password, t: Date.now() });
  const shifted = data.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) + (i % 7) + 3)
  ).join('');
  return btoa(encodeURIComponent(shifted));
}

// 解密
function decryptCredentials(encrypted) {
  const shifted = decodeURIComponent(atob(encrypted));
  const data = shifted.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) - (i % 7) - 3)
  ).join('');
  return JSON.parse(data); // { username, password }
}
```

---

## 2. 通用请求头

```javascript
const HEADERS = {
  'User-Agent': 'Dart/3.5 (dart:io)',
  'Accept-Language': 'zh-TW',
  'Host': 'jdforrepam.com',
  'jdSignature': generateJavdbSignature()
};

// 如果需要登录
if (token) {
  HEADERS['Authorization'] = `Bearer ${token}`;
}
```

**注意：** 所有 API 通过 `jdforrepam.com` 代理访问。客户端需要支持 CORS 或运行在允许跨域的环境（如浏览器 userscript / 本地 HTML 文件）。

---

## 3. 无需登录的端点

所有公共端点只需 `jdSignature` 签名头，无需 `Authorization`。

### 3.1 搜索影片

```
GET https://jdforrepam.com/api/v2/search
```

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| q | string | 必填 | 搜索关键词（URL 编码） |
| type | string | movie | movie/actor/series/maker/code |
| movie_type | string | all | all/0(有码)/1(无码)/2(欧美)/3(FC2)/4(动漫) |
| movie_sort_by | string | relevance | relevance/release/update/score |
| movie_filter_by | string | all | all/can_play/magnets/subtitle |
| page | number | 1 | |
| limit | number | 24 | |

**番号搜索示例：** `?q=IPZZ-014&type=movie&limit=1&movie_sort_by=relevance`

### 3.2 影片详情（核心端点）

```
GET https://jdforrepam.com/api/v4/movies/{movieId}
```

| 参数 | 类型 | 说明 |
|---|---|---|
| movieId | string | 路径参数，从搜索结果的 id 字段获取 |
| from_rankings | bool | 可选 |

返回影片的完整信息：基础信息、演员、标签、剧照列表 preview_images[]、预告片 URL preview_video_url、短评摘要 review、相关推荐等。

### 3.3 排行榜（类型分页）

```
GET /api/v1/rankings?type=0&period=monthly
```

| 参数 | 值 | 说明 |
|---|---|---|
| type | 0/1/2/3 | 0=有码, 1=无码, 2=欧美, 3=FC2 |
| period | daily/weekly/monthly | 周期 |

此端点取代了需要登录的 /api/v1/movies/top。

### 3.4 热播榜

```
GET /api/v1/rankings/playback
```

| 参数 | 值 | 说明 |
|---|---|---|
| filter_by | all / high_score | |
| period | daily / weekly / monthly | |

完整参数矩阵：`filter_by=all|high_score` + `period=daily|weekly|monthly`

### 3.5 最新影片

```
GET /api/v1/movies/latest
```

| 参数 | 值 |
|---|---|
| type | all/0/1/2 |
| filter_by | all/magnets/can_play/subtitle |
| sort_by | release/update/score/hit/want_watch_count/watched_count |
| order_by | desc/asc（仅 release 支持） |
| page, limit | 分页（默认 48，首页磁链区 18） |

**首页近期磁链更新：** `?type=all&filter_by=magnets&sort_by=update&page=1&limit=18`
**首页新片速递：** `?type=all&filter_by=can_play&sort_by=update&page=1&limit=18`

### 3.6 推荐影片

```
GET /api/v1/movies/recommend
```
返回简化的热门推荐影片列表（参数当前主机上暂无明显效果）。

### 3.7 热门短评

```
GET /api/v1/reviews/hotly?period=daily
```
必填参数 `period`：daily / weekly / monthly。

### 3.8 影片磁链

```
GET /api/v1/movies/{movieId}/magnets
```
返回磁力链接列表。

### 3.9 影片短评（公开）

```
GET /api/v1/movies/{movieId}/reviews
```
返回公开短评列表，无需登录。

### 3.10 其他公共端点

```
GET /api/v1/movies/recommend_periods
GET /api/v1/startup
GET /api/v1/actors?page=1&limit=48
GET /api/v1/series?page=1&limit=48
GET /api/v1/makers?page=1&limit=48
GET /api/v1/movies/tags?page=1&limit=48
```

---

## 4. 需要登录的端点

所有端点除 jdSignature 外还需要 `Authorization: Bearer {token}`。

### 4.1 TOP250 排行榜

```
GET /api/v1/movies/top
```

| 参数 | 值 |
|---|---|
| period | daily/weekly/monthly |
| type | 0/1/all |
| start_rank | 1/51/101/151/201（APK 翻页方式） |
| ignore_watched | true/false |
| page, limit | 默认 limit=50 |

**APK 通用请求形状：**
```
?start_rank=1&type=all&type_value=&ignore_watched=false&page=1&limit=50
?start_rank=51&type=all&type_value=&ignore_watched=true&page=1&limit=50
```

### 4.2 猜你喜欢

```
GET /api/v1/movies/may_also_like?movie_id={movieId}
```

### 4.3 用户信息

```
GET /api/v1/users
```
返回 id, username, email, is_vip, want_watch_count, watched_count 等。

### 4.4 用户附加信息

```
GET /api/v1/users/additional
```
返回 reports_count, deleted_comments_count, muted_count 等。

### 4.5 近期浏览

```
GET /api/v1/users/recent_viewed
```

### 4.6 想看/看过的影片

```
GET /api/v2/users/review_movies?status=want_watch&type=0&sort_by=create&page=1&limit=48
```
status: want_watch(想看) / watched(看过)
sort_by: create/release-desc/release-asc/score/hit/want-watch-count/watched-count

### 4.7 我的清单

```
GET /api/v1/lists/simple
```

### 4.8 收藏列表

```
GET /api/v1/users/collected_actors?page=1&limit=60
GET /api/v1/users/collected_series?page=1&limit=48
GET /api/v1/users/collected_makers?page=1&limit=48
GET /api/v1/users/collected_codes?page=1&limit=48
GET /api/v1/users/collected_directors?page=1&limit=48
```

### 4.9 钱包信息

```
GET /api/v1/wallets
```

---

## 5. 数据结构

### 5.1 统一响应格式

```json
{
  "success": 1,
  "action": null,
  "message": null,
  "data": { ... }
}
```

错误时：`{ "success": 0, "error": "JWTVerificationError", "message": "请登录账号" }`

常见错误类型：JWTVerificationError(需登录), ParameterInvalid(缺参数), PermissionDeniedToPayment(需VIP), ResourceNotFound(不存在)

### 5.2 影片对象

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 影片唯一 ID |
| number | string | 番号，如 IPZZ-014 |
| title | string | 标题 |
| origin_title | string | 原始标题 |
| score | string | 评分（字符串） |
| thumb_url | string | 缩略图 URL |
| cover_url | string | 封面 URL |
| duration | number | 时长（分钟） |
| release_date | string | 发行日期 |
| maker_name | string | 片商名 |
| series_name | string | 系列名 |
| director_name | string | 导演名 |
| tags | array | [{id, name}] |
| actors | array | [{id, name, gender, avatar_url}] |
| magnets_count | number | |
| reviews_count | number | |
| want_watch_count | number | |
| watched_count | number | |
| can_play | bool | |
| has_preview_video | bool | |
| has_preview_images | bool | |
| has_cnsub | bool | |
| preview_video_url | string | 预告片 URL |
| preview_images | array | 剧照列表 |
| relative_movies | array | 相关推荐 |
| actor_movies | array | 演员其他作品 |
| review | object | 短评摘要 |
| play_sources | array | 播放源 |

### 5.3 剧照对象

```json
{
  "thumb_url": "https://tp-iu.cmastd.com/.../samples/xxx_s_0.jpg",
  "large_url": "https://tp-iu.cmastd.com/.../samples/xxx_l_0.jpg"
}
```

### 5.4 短评对象

| 字段 | 说明 |
|---|---|
| id, username, user_id | 基本信息 |
| score | 评分 |
| content | 评论内容 |
| likes_count | 点赞数 |
| liked | 当前用户是否已赞 |
| created_at | 创建时间 |

### 5.5 磁链对象

| 字段 | 说明 |
|---|---|
| name, hash | 文件名和 BT Hash |
| size | 文件大小 |
| cnsub, hd | 中字/高清标记 |
| files_count | 文件数 |
| created_at | 创建时间 |
| pikpak_url | PikPak 链接 |

---

## 6. 图片 URL 清洗

```javascript
function normalizeFanartImageUrl(url, size = 'l') {
  if (!url) return '';
  const raw = String(url).trim().replace(/^http:/i, 'https:');

  try {
    const parsed = new URL(raw);
    const samplesIndex = parsed.pathname.indexOf('/samples/');
    if (samplesIndex !== -1) {
      const path = parsed.pathname.slice(samplesIndex)
        .replace(/_([sl])_(\d+\.(?:jpg|jpeg|png|webp))$/i, `_${size}_$2`);
      return `https://c0.jdbstatic.com${path}`;
    }
  } catch (e) {}

  return raw.replace(/_([sl])_(\d+\.(?:jpg|jpeg|png|webp)(?:[?#].*)?)$/i, `_${size}_$2`);
}
```

**规则：**
1. http -> https
2. 路径含 /samples/ -> 域名重写为 c0.jdbstatic.com
3. _s_ (小图) -> _l_ (大图)，_l_ 保持不变
4. 支持 jpg/jpeg/png/webp

---

## 7. 缓存策略

### 内存缓存（页面内导航）

```javascript
const cache = {
  movieSearch: new Map(),   // code -> movieInfo
  movieDetail: new Map(),   // movieId -> detail data
  images: new Map(),        // movieId -> image URLs
  reviews: new Map(),       // movieId -> reviews
};
```

### localStorage 缓存（跨页面持久化）

```
JAVDB_CACHE_KEY = 'javdb_cache'
CACHE_MAX_SIZE = 500KB
CACHE_MAX_ITEMS = 50
CACHE_EXPIRY_HOURS = 24
```

缓存内容：影片搜索、短评（24h 过期）、Token（30天）、预告片 URL

---

## 8. 用户使用流程

### 核心流程：搜索 -> 详情 -> 剧照/短评

```
搜索 (GET /api/v2/search?q=番号)
  -> 得到 movieId
  -> 查看详情 (GET /api/v4/movies/{movieId})
    -> 展示影片信息卡
    -> 展示剧照 (preview_images[] -> URL 清洗 -> <img>)
    -> 展示短评 (GET /api/v1/movies/{movieId}/reviews)
    -> 展示磁链 (GET /api/v1/movies/{movieId}/magnets)
```

### 番号提取逻辑

```javascript
function getExternalFanartCode(item) {
  const candidates = [
    item.OriginalTitle,
    ...Object.values(item.ProviderIds || {}),
    item.Name, item.SortName,
  ];
  for (const c of candidates) {
    const code = normalizeCode(c);
    if (code) return code;
  }
  // DOM 兜底：从 h1/.itemName 等选择器提取
  return null;
}

function normalizeCode(str) {
  if (!str) return null;
  const m = String(str).trim().toUpperCase()
    .match(/\b([A-Z]{2,10}(?:-[A-Z]+)?)-(\d{2,7})\b/);
  return m ? `${m[1]}-${m[2]}` : null;
}
```

### 前导数字重试

```javascript
async function searchWithRetry(code) {
  let result = await searchJavdbMovie(code);
  if (!result && /^\d+[a-z]/i.test(code)) {
    const retryCode = code.replace(/^\d+(?=[a-z])/i, '');
    result = await searchJavdbMovie(retryCode);
  }
  return result;
}
```

---

## 9. 常见错误与处理

| 错误 | 原因 | 处理 |
|---|---|---|
| JWTVerificationError | 需要登录 | 提示用户登录 |
| ParameterInvalid | 缺少必填参数 | 检查请求参数 |
| PermissionDeniedToPayment | 需要 VIP | 提示升级 |
| ResourceNotFound | 资源不存在 | 404 处理 |
| HTTP 403 (Cloudflare) | 被 WAF 拦截 | 检查 UA 和签名 |
| HTTP 500 | 服务端错误 | 重试 |

---

## 10. 附录：MD5 实现

完整 MD5 实现在 [extrafanart&trailers.js](userscripts/extrafanart&trailers.js) 中（约 200 行），或可使用标准库：

- **浏览器：** `crypto.subtle.digest('MD5', data)` + hex 编码
- **Node.js：** `crypto.createHash('md5').update(data).digest('hex')`
- **浏览器降级：** 使用完整的 JavaScript MD5 实现

---

## 参考

- Base URL: `https://jdforrepam.com`
- [extrafanart&trailers.js](userscripts/extrafanart&trailers.js) — Emby 增强脚本
- [2026-05-27 javdb app api.md](userscripts/2026-05-27%20javdb%20app%20api.md) — 初始逆向笔记
- [jav_db_api_authenticated.md](userscripts/jav_db_api_authenticated.md) — 需登录端点
- [jav_db_api_movie_rankings.md](userscripts/jav_db_api_movie_rankings.md) — 排行端点
- [javdb_api_explorer.html](javdb_api_explorer.html) — 交互式 API 调试工具
- [javdb_api_demo.html](javdb_api_demo.html) — 分步演示页面
