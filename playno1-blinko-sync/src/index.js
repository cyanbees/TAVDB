/**
 * PlayNO1 → Blinko 同步脚本
 *
 * 用法:
 *   node src/index.js --mode=full         # 全量爬取（从第一页开始）
 *   node src/index.js --mode=incremental   # 增量爬取（只爬新文章）
 *   node src/index.js --mode=test-connection  # 测试 Blinko 连接
 *
 * 环境变量:
 *   BLINKO_URL      - Blinko 服务地址
 *   BLINKO_TOKEN    - Access Token
 *   REQUEST_DELAY   - 请求间隔（毫秒，默认 800）
 *   WRITE_DELAY     - 写入间隔（毫秒，默认 500）
 */

import { loadState, saveState } from './state.js';
import { initBlinko, upsertNote, testConnection } from './blinko.js';
import { crawlListPages, crawlArticleDetail, crawlListPage } from './crawler.js';
import { formatArticleAsNote } from './formatter.js';

const REQUEST_DELAY = parseInt(process.env.REQUEST_DELAY || '800');
const WRITE_DELAY = parseInt(process.env.WRITE_DELAY || '500');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 打印 Banner
 */
function printBanner() {
  console.log(`
╔══════════════════════════════════════════╗
║  PlayNO1 → Blinko AV 文章同步脚本        ║
╚══════════════════════════════════════════╝
  `);
}

/**
 * 测试连接
 */
async function cmdTestConnection() {
  printBanner();
  const ok = await testConnection();
  process.exit(ok ? 0 : 1);
}

/**
 * 全量爬取模式
 * 从 page=1 开始，遍历所有列表页
 */
async function cmdFullCrawl(state) {
  printBanner();
  console.log('📦 模式: 全量爬取');
  console.log(`📄 从列表页 ${state.lastListPage + 1} 开始\n`);

  // 先获取总页数
  const { totalPages: actualPages } = await crawlListPage(1);
  // 如果设置了 MAX_PAGES 环境变量，则限制爬取范围
  const maxPages = parseInt(process.env.MAX_PAGES || '0');
  const totalPages = maxPages > 0 ? Math.min(maxPages, actualPages) : actualPages;
  state.totalListPages = totalPages;
  console.log(`📊 列表页数: ${totalPages}（总 ${actualPages} 页）\n`);

  const existingAids = new Set(state.processedAids);

  // 遍历所有列表页
  for (let page = state.lastListPage + 1; page <= totalPages; page++) {
    const { articles } = await crawlListPage(page);
    console.log(`📄 列表页 ${page}/${totalPages} | 发现 ${articles.length} 篇文章`);

    let newCount = 0;
    for (const article of articles) {
      if (existingAids.has(article.aid)) continue;

      try {
        console.log(`  📝 爬取: #${article.aid} ${article.title.slice(0, 50)}...`);

        const detail = await crawlArticleDetail(article.aid);
        const noteData = await formatArticleAsNote(detail);

        await upsertNote(noteData);
        console.log(`  ✅ 已写入 Blinko: #${article.aid} ${noteData.isArchived ? '📦归档' : '💡闪念'}`);

        existingAids.add(article.aid);
        newCount++;

        // 逐篇更新状态
        state.lastAid = article.aid;
        state.processedAids = [...existingAids];
        saveState(state);

        await sleep(WRITE_DELAY);
      } catch (e) {
        console.error(`  ❌ 文章 #${article.aid} 处理失败:`, e.message);
        await sleep(REQUEST_DELAY * 2);
      }
    }

    state.lastListPage = page;
    saveState(state);

    if (page < totalPages) {
      await sleep(REQUEST_DELAY);
    }
  }

  console.log('\n🎉 全量爬取完成!');
}

/**
 * 增量爬取模式
 * 只爬取比 lastAid 更新的文章
 */
async function cmdIncrementalCrawl(state) {
  printBanner();
  console.log('📦 模式: 增量爬取');
  console.log(`📎 上次爬到的最大文章 ID: ${state.lastAid || '无'}\n`);

  const existingAids = new Set(state.processedAids);
  const newArticles = [];

  // 只检查前几页（新文章通常在首页）
  const pagesToCheck = 3;
  for (let page = 1; page <= pagesToCheck; page++) {
    const { articles } = await crawlListPage(page);
    for (const article of articles) {
      if (!existingAids.has(article.aid)) {
        newArticles.push(article);
        existingAids.add(article.aid);
      }
    }
    await sleep(REQUEST_DELAY);
  }

  if (newArticles.length === 0) {
    console.log('✨ 没有新文章，跳过');
    return;
  }

  // 按 aid 从小到大排序（先爬旧的，再爬最新的）
  newArticles.sort((a, b) => a.aid - b.aid);

  console.log(`📊 发现 ${newArticles.length} 篇新文章\n`);

  for (const article of newArticles) {
    try {
      console.log(`  📝 爬取: #${article.aid} ${article.title.slice(0, 50)}...`);

      const detail = await crawlArticleDetail(article.aid);
      const noteData = await formatArticleAsNote(detail);

      await upsertNote(noteData);
      console.log(`  ✅ 已写入 Blinko: #${article.aid} ${noteData.isArchived ? '📦归档' : '💡闪念'}`);

      state.lastAid = article.aid;
      state.processedAids = [...existingAids];
      saveState(state);

      await sleep(WRITE_DELAY);
    } catch (e) {
      console.error(`  ❌ 文章 #${article.aid} 处理失败:`, e.message);
      await sleep(WRITE_DELAY * 2);
    }
  }

  console.log('\n✅ 增量爬取完成!');
}

/**
 * 入口
 */
async function main() {
  const args = process.argv.slice(2);
  const modeArg = args.find(a => a.startsWith('--mode='));
  const mode = modeArg ? modeArg.split('=')[1] : 'incremental';

  // 加载配置
  const BLINKO_URL = process.env.BLINKO_URL;
  const BLINKO_TOKEN = process.env.BLINKO_TOKEN;

  if (!BLINKO_URL || !BLINKO_TOKEN) {
    console.error('❌ 请设置环境变量 BLINKO_URL 和 BLINKO_TOKEN');
    console.error('   参考 .env.example');
    process.exit(1);
  }

  initBlinko(BLINKO_URL, BLINKO_TOKEN);

  // 测试连接
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ 无法连接到 Blinko，请检查 BLINKO_URL 和 BLINKO_TOKEN');
    process.exit(1);
  }

  // 加载状态
  const state = loadState();

  switch (mode) {
    case 'test-connection':
      await cmdTestConnection();
      break;
    case 'full':
      await cmdFullCrawl(state);
      break;
    case 'incremental':
    default:
      await cmdIncrementalCrawl(state);
      break;
  }
}

main().catch(e => {
  console.error('💥 脚本异常退出:', e);
  process.exit(1);
});
