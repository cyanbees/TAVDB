import { t2s } from './t2s.js';

/**
 * 判断日期是否是今天
 */
function isToday(dateStr) {
  if (!dateStr) return false;
  const datePart = dateStr.split(' ')[0]; // "2026-6-18" 或 "2026-06-18"
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  // 兼容 "2026-6-18" 和 "2026-06-18"
  const [py, pm, pd] = datePart.split('-').map(Number);
  return py === y && pm === m && pd === d;
}

/**
 * 将文章格式化为 Blinko Markdown 笔记
 * @param {object} article - 文章对象
 * @returns {Promise<{content: string, type: number, isArchived: boolean}>}
 */
export async function formatArticleAsNote(article) {
  const dateLine = [article.date, article.author].filter(Boolean).join(' | ');

  // 繁转简
  const titleCN = await t2s(article.title);
  const authorCN = await t2s(article.author);
  const bodyCN = await t2s(article.plainText);

  // 决定类型：今天发布的 → 闪念；更早的 → 归档笔记
  const publishedToday = isToday(article.date);
  const noteType = publishedToday ? 1 : 0;  // 1=闪念
  const isArchived = !publishedToday;       // 非今天发布的直接归档

  // 构建正文
  const sections = [];

  // 标题（转简体）
  sections.push(`# ${titleCN}`);
  sections.push('');

  // 来源行
  const sourceParts = [`**来源**: [playno1.com](${article.url})`];
  if (dateLine) sourceParts.push(dateLine);
  sections.push(`> ${sourceParts.join('  |  ')}`);
  sections.push('');

  // 作者标签（用 # 标签，Blinko 自动识别）
  if (authorCN) {
    sections.push(`#${authorCN.replace(/\s+/g, '')}`);
    sections.push('');
  }

  sections.push('---');
  sections.push('');

  // 正文（简体）
  if (bodyCN) {
    const cleanText = bodyCN.replace(/\n{3,}/g, '\n\n');
    sections.push(cleanText);
    sections.push('');
  }

  // 图片
  if (article.images.length > 0) {
    sections.push('---');
    sections.push('');
    sections.push('### 📷 文章配图');
    sections.push('');
    for (const imgUrl of article.images) {
      sections.push(`![${titleCN}](${imgUrl})`);
      sections.push('');
    }
  }

  // 原文链接
  sections.push('---');
  sections.push('');
  sections.push(`> 🔗 [查看原文](${article.url})`);

  return {
    content: sections.join('\n'),
    type: noteType,
    isArchived,
  };
}
