import { crawlListPage, crawlArticleDetail } from './crawler.js';

const { articles } = await crawlListPage(1);
console.log('文章数:', articles.length);

const today = new Date();
const y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();
const todayStr = `${y}-${m}-${d}`;

let todayCount = 0;
for (const a of articles) {
  // 爬详情获取日期
  const detail = await crawlArticleDetail(a.aid);
  const datePart = detail.date.split(' ')[0];
  const isT = datePart === todayStr || detail.date.startsWith(todayStr);
  console.log(`#${detail.aid} | ${detail.date} | ${isT ? '✅ 今天' : '📅 之前'} | ${detail.title.slice(0, 50)}`);
  if (isT) todayCount++;
}

console.log(`\n共 ${todayCount} 篇今天的文章`);
