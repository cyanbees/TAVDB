# PlayNO1 → Blinko AV 文章同步

自动爬取 [playno1.com](http://www.playno1.com/) AV 分类（catid=78）的全部文章，同步写入 Blinko 笔记。

## 安装

```bash
cd playno1-blinko-sync
npm install
```

## 配置

复制环境变量模板并填写：

```bash
cp .env.example .env
```

编辑 `.env`：

| 变量 | 说明 |
|------|------|
| `BLINKO_URL` | Blinko 服务地址，如 `http://192.168.1.100:1111` |
| `BLINKO_TOKEN` | Blinko Access Token（设置 → Access Token 中获取） |
| `REQUEST_DELAY` | 爬取请求间隔，默认 `800` 毫秒 |
| `WRITE_DELAY` | 写入 Blinko 间隔，默认 `500` 毫秒 |

### 获取 Access Token

1. 打开你的 Blinko 实例
2. 进入 设置 → Access Token
3. 复制 JWT Token（以 `eyJ...` 开头）

## 使用

### 测试连接

```bash
BLINKO_URL=http://你的地址:1111 BLINKO_TOKEN=eyJ... node src/index.js --mode=test-connection
```

### 全量爬取（首次运行）

```bash
BLINKO_URL=http://你的地址:1111 BLINKO_TOKEN=eyJ... node src/index.js --mode=full
```

> ⚠️ 全量约 86,000 篇文章，请做好限速，预计耗时数天。

### 增量爬取（每日）

```bash
BLINKO_URL=http://你的地址:1111 BLINKO_TOKEN=eyJ... node src/index.js --mode=incremental
```

## 定时任务（cron）

在远程服务器上设置每日增量爬取：

```bash
# 每天上午 8:00 运行
0 8 * * * cd /path/to/playno1-blinko-sync && BLINKO_URL=http://localhost:1111 BLINKO_TOKEN=eyJ... node src/index.js --mode=incremental >> sync.log 2>&1
```

## 状态管理

脚本会在 `state.json` 中记录进度：

```json
{
  "lastAid": 44663,
  "lastListPage": 42,
  "totalListPages": 959,
  "processedAids": [1, 2, 3, ...],
  "lastRunAt": "2026-06-18T..."
}
```

- 全量爬取中断后可**断点续爬**
- 增量模式只爬比 `lastAid` 更新的文章

## 笔记样式

写入 Blinko 的笔记格式：

```
# (START-597)大潮紅、翻白眼…宮島めい(宮島芽衣)...

> **来源**: [playno1.com](...) | 作者: 一劍浣春秋 | 日期: 2026-06-18

---
正文内容...

---
### 📷 文章配图
![..](...)
![..](...)

---
> 🔗 [查看原文](...)
```
