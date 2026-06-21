# 115 离线下载 — 测试记录

## 测试目标

在 Forward App 运行时环境中走通 115 离线下载：space token 获取 → 磁力链提交 → 网盘出现文件。

## 测试环境

- Forward App（拖拽模式，stream source `loadResource`）
- 115 Cookie（浏览器复制，自动提取 uid）
- 磁力示例：`magnet:?xt=urn:btih:cce4da0638efc7958b5ef0fe3ff07966fe77b1ca&dn=START-583`

## 测试路径

```
Forward 番号详情页
  → loadResource 被调用
  → searchFiles("start-583") → 2个文件，番号均不匹配
  → 进入兜底分支 B
  → await offlineOneClick(cookie, magnet)
  →     getOfflineSpaceToken(cookie)         →  { sign, time }
  →     submitOfflineTask(cookie, magnet, ...) →  { state: true, info_hash }
  → 115 网盘接收到文件
```

## 踩坑记录

### 坑 1：Fire-and-forget 导致 Promise 被回收

**症状**：`offlineOneClick` 被调用后无后续日志，115 网盘无文件。搜索请求（`webapi.115.com`）正常返回，但离线请求（`115.com`）日志中断。

**根因**：`loadResource` 中 `offlineOneClick` 未 `await`，直接返回空数组。Forward 认为 stream source 调用结束，后台 Promise 被回收。

**修复**：改为 `await offlineOneClick(...)` + try/catch。

### 坑 2：Forward 已自动 JSON decode，代码二次解析

**症状**：错误 `JSON Parse error: Unexpected identifier "object"`。

**根因**：Forward 的 `Widget.http.get` 返回的 `resp.data` 已是对象。`String({ state: true })` → `"[object Object]"` → `JSON.parse(...)` 失败。

**修复**：`typeof` 分支判断，字符串走 parse，对象直接取。

```javascript
if (typeof raw === "string") {
  json = JSON.parse(raw);
} else if (raw && typeof raw === "object") {
  json = raw;
}
```

**影响范围**：`getOfflineSpaceToken` 和 `submitOfflineTask` 两处都需要修复。

### 坑 3：POST 请求缺少必要 Header

**症状**：虽未直接触发，但测试环境与生产环境的请求上下文不同，缺少 UA / Origin 在高版本 115 可能有兼容风险。

**修复**：在 `submitOfflineTask` 的 POST 中复用 `BASE_HEADERS`。

### 坑 4：磁力链截断

**症状**：未直接导致本次失败，但 `magnet.substring(0, 60)` 切掉了 `&dn=...` 部分。虽 btih hash 仍在，但 dn 信息丢失可能影响 115 的展示名。

**修复**：改为完整 `trim()`。

## 最终结论

- ✅ Forward 环境内离线 API 调用完整可用
- ✅ 鉴权（Cookie → uid）正确
- ✅ space token（sign/time）获取正常
- ✅ 离线任务提交（POST add_task_url）成功
- ✅ 115 网盘确认收到文件

