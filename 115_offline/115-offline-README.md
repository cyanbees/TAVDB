# 115 离线下载最小模块

## 文件

| 文件 | 用途 |
|---|---|
| `pan115-offline-min.js` | 最小离线模块，零额外依赖，约 150 行 |
| `pan115_v1.1.0-stable.js` | 完整模块（搜索 + 播放 + 离线），离线功能已内嵌 |
| `115-offline-TESTLOG.md` | 测试记录与踩坑总结 |

## 最小模块接入方式

### 在另一个 Forward Widget 中调用

```javascript
// 在目标模块文件中 eval 载入
// eval(fs.readFileSync("./forward_player/pan115-offline-min.js", "utf8"));
// 或直接把文件内容复制到目标模块开头

// 用法 1 — 一键离线
const result = await offlineOneClick(cookie, "magnet:?xt=urn:btih:...");
// → { state: true, info_hash: "cce4da..." }
// → { state: false, error: "..." }

// 用法 2 — 分步控制
const { sign, time } = await getOfflineSpaceToken(cookie);
const result = await submitOfflineTask(cookie, magnet, { sign, time });
```

### 参数说明

`offlineOneClick(cookie, magnet, opts?)`

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `cookie` | string | 是 | 115.com 登录态 Cookie，含 UID 字段 |
| `magnet` | string | 是 | 磁力链接，完整传入（内部不做截断） |
| `opts.uid` | string | 否 | 可选，不传则自动从 Cookie 首段提取 |

`submitOfflineTask(cookie, magnet, tokenObj)`

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `tokenObj.sign` | string | 是 | 从 `getOfflineSpaceToken` 获取 |
| `tokenObj.time` | string\|number | 是 | 同上 |
| `tokenObj.uid` | string | 否 | 不传则自动从 Cookie 提取 |

### 返回值

```typescript
// 成功
{ state: true, info_hash: string }

// 失败
{ state: false, error: string, errcode?: string }
```

## Cookie 格式要求

Cookie 首段必须是 UID，格式如：

```
UID=363271016_D1_1779946391; CID=...; SEID=...
```

从浏览器 F12 → Network → 任意 115.com 请求的 Request Headers 中复制。

## 注意事项

1. **每次调用均需现场获取 space token**（sign/time 有时效性），不要缓存复用
2. 磁力链无需截断，完整传入即可
3. 本模块依赖 `Widget.http`（Forward 运行时内置），不依赖其他第三方库
4. 提交离线后任务异步执行，返回 `info_hash` 不代表文件立即可播

