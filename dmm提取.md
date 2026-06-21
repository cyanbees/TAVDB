# DMM/FANZA ランキング番号提取方案

## 方法概述

DMM/FANZA 的排名页面采用 Next.js 客户端渲染，数据通过 GraphQL API 加载。**不能**直接从页面 HTML 或图片 URL 提取真正的番号。

- 图片 URL 中的路径如 `sqte00633` 是内部 CID（配信品番），**不是**真正的番号
- 真正的番号是 **メーカー品番**（制造商产品编号），需要从每个产品的详情页提取
- 例如：CID `sqte00633` → メーカー品番 `SQTE-633`

## 步骤

### 1. 从 GraphQL API 获取全部 CID

排名页面通过调用 `https://api.video.dmm.co.jp/graphql` 获取数据，返回完整的 100 条排名数据。

**方式 A：Playwright 截获 GraphQL 响应**

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
});
const page = await context.newPage();

let graphqlBody = '';
page.on('response', async response => {
  const url = response.url();
  if (url.includes('api.video.dmm.co.jp/graphql')) {
    const text = await response.text();
    if (text.length > 100000) graphqlBody = text;  // 大的那个是排名数据
  }
});

// 1. 先过年龄验证
await page.goto('https://video.dmm.co.jp/av/ranking/?term=monthly', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  const a = document.querySelector('a[href*="declared=yes"]');
  if (a) window.location.href = a.href;
});
await page.waitForTimeout(5000);

// 2. 滚动加载全部 100 条
for (let i = 0; i < 10; i++) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
}

// 3. 解析 GraphQL 数据中的 id 和 rank
const itemRegex = /\{"id":"([^"]+)","rank":(\d+),/g;
let match;
while ((match = itemRegex.exec(graphqlBody)) !== null) {
  console.log(`#${match[2]}: ${match[1]}`);
}
```

**方式 B：从图片 URL 提取 CID（快捷但不完整）**

有些素人系 CID（如 `h_1745hrsm00087`）使用不同的图片格式，会被漏掉。

```javascript
const cids = await page.evaluate(() => {
  const ids = [];
  document.querySelectorAll('img[src*="awsimgsrc.dmm.co.jp/pics_dig/digital/video/"]').forEach(img => {
    const match = img.src.match(/\/video\/([a-z0-9]+)\/\1ps\.jpg/);
    if (match) ids.push(match[1]);
  });
  return ids;
});
```

### 2. 从详情页提取メーカー品番

有了 CID 后，访问产品详情页提取真正的番号：

```javascript
const p = await context.newPage();
await p.goto(`https://video.dmm.co.jp/av/content/?id=${cid}`, { 
  waitUntil: 'domcontentloaded' 
});
await p.waitForTimeout(2000);

const text = await p.evaluate(() => document.body.innerText);
const lines = text.split('\n');
let makerProduct = '';

for (let j = 0; j < lines.length; j++) {
  if (lines[j].includes('メーカー品番')) {
    const match = lines[j].match(/メーカー品番[：:]\s*(\S+)/);
    if (match) {
      makerProduct = match[1];
    } else {
      const nextLine = lines[j+1]?.trim();
      if (nextLine && !nextLine.includes('：') && !nextLine.includes(':')) {
        makerProduct = nextLine;
      }
    }
    break;
  }
}
```

### 3. 完整提取脚本

参见项目中的 `scripts/dmm-ranking-extract.js`（如果存在）。

## 常见问题

### Q: 为什么图片 URL 的 ID 不是番号？

DMM 的图片路径使用内部 CID（content ID），如 `sqte00633`。这与メーカー品番 `SQTE-633` 不同：
- 一些 CID 需要补零：`sqte00633` → `SQTE-633`（去掉前导零）
- 一些 CID 去掉前缀：`1start00373` → `START-373`
- 一些 CID 完全不同：`h_1745hrsm00087` → `HRSM-087`

必须访问详情页才能确认。

### Q: 部分 CID 获取不到怎么办？

素人系列（CID 以 `h_` 开头）的图片可能使用不同的 CDN 域名。务必使用 **GraphQL API 截获** 方式获取全部 100 条数据，而不是仅依赖图片提取。

### Q: 年龄验证如何处理？

DMM 有年龄验证页面。通过 Playwright 点击「はい」按钮（或直接跳转到 `declared=yes` 的 URL）来设置 cookie，之后的请求就通过了：

```javascript
await page.evaluate(() => {
  const a = document.querySelector('a[href*="declared=yes"]');
  if (a) window.location.href = a.href;
});
```

---

## 榜单入口一览

DMM/FANZA 视频区有以下几个榜单类型，均通过左侧边栏的「ランキングから探す」区域访问。

### 作品ランキング（Video Ranking）

| 榜单 | URL `?term=` 参数 | 说明 |
|------|-------------------|------|
| 📅 日間 | `daily` | 每日更新 |
| 📅 週間 | `weekly` | 每周更新 |
| 📅 月間 | `monthly` | 每月更新（默认） |
| ⏱ 10分(2D) | `realtime` | 10分钟短片排行 |
| ⏱ 10分(VR) | `realtime&only=vr` | 10分钟VR短片排行 |

**完整 URL 示例**：
```
https://video.dmm.co.jp/av/ranking/?term=monthly        # 月間作品
https://video.dmm.co.jp/av/ranking/?term=daily           # 日間作品
https://video.dmm.co.jp/av/ranking/?term=weekly          # 週間作品
https://video.dmm.co.jp/av/ranking/?term=realtime        # 10分(2D)
https://video.dmm.co.jp/av/ranking/?term=realtime&only=vr # 10分(VR)
```

**GraphQL**: 使用 `ppvContentRanking` 查询，返回 100 条带 CID 的数据。

### 女優ランキング（Actress Ranking）

| 榜单 | URL | 说明 |
|------|-----|------|
| 📅 月間AV女優 | `?term=monthly&type=actress` | 月間女優人気順 |
| 📅 週間AV女優 | `?term=weekly&type=actress` | 週間女優人気順 |
| 📅 日間AV女優 | `?term=daily&type=actress` | 日間女優人気順 |

**完整 URL 示例**：
```
https://video.dmm.co.jp/av/ranking/?term=monthly&type=actress
https://video.dmm.co.jp/av/ranking/?term=weekly&type=actress
https://video.dmm.co.jp/av/ranking/?term=daily&type=actress
```

**GraphQL**: 使用 `actressesRanking(floor: VIDEO, type: SALES_MONTHLY, limit: 100)` 查询。

**响应结构**（来自 SideBar 查询）：
```graphql
actressesRanking(floor: $floor, type: SALES_MONTHLY, limit: 5) {
  items {
    actress {
      id
      name
      imageUrl
      contentsCountOnSale
      latestContent { id title }
    }
    rank
  }
}
```

**页面提取方式**：和作品排名一样用 Playwright 截获 GraphQL 或直接解析页面文本。

### シリーズランキング（Series Ranking）

| 榜单 | URL | 说明 |
|------|-----|------|
| 📅 月間シリーズ | `?term=monthly&type=series` | 月間シリーズ人気順 |

```
https://video.dmm.co.jp/av/ranking/?term=monthly&type=series
```

**GraphQL**: 使用 `seriesRanking(floor: VIDEO, type: SALES_MONTHLY, limit: 30)` 查询。

### 注意点

- **新人女優ランキング 不存在** — DMM 没有独立的「新人女优」榜单页面。`type=newcomer`、`type=debut`、`type=popular` 等都会返回 404。
- 女優排行榜的数据可以在实际提取时通过截获 GraphQL 的 `actressesRanking` 查询获得完整的 actress id、name、imageUrl 等信息。

## GraphQL API 细节

- **端点**: `https://api.video.dmm.co.jp/graphql`
- **方法**: POST
- **请求体**: GraphQL query（具体 query 可以从页面 JS 中反编译获得，或直接截获）
- **响应结构**:
  ```json
  {
    "data": {
      "ppvContentRanking": {
        "items": [
          {
            "id": "sqte00633",
            "rank": 1,
            "content": {
              "title": "いつでも使えるオナホ後輩 依本しおり",
              "packageImage": { "mediumUrl": "...", "largeUrl": "..." },
              "actresses": [{ "name": "依本しおり" }],
              "review": { "average": 4.3, "total": 68 },
              ...
            }
          },
          ...
        ]
      }
    }
  }
  ```
