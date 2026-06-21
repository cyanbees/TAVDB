import fetch from 'node-fetch';

const BASE_URL = 'http://www.playno1.com';
const COOKIE = 'playno1=playno1Cookie';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const HEADERS = {
  'User-Agent': USER_AGENT,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cookie': COOKIE,
};

/**
 * 休眠
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 发起 HTTP 请求
 */
async function httpGet(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.text();
}

/**
 * 从列表页提取文章 ID 列表
 * @param {string} html - 页面 HTML
 * @returns {Array<{aid: number, title: string, url: string}>}
 */
function extractArticlesFromList(html) {
  const pattern = /article-(\d+)-1\.html/g;
  const titlePattern = /<h3>[\s\S]*?<a href="[^"]*article-(\d+)-1\.html"[^>]*title="([^"]*)"[^>]*>/g;
  const articles = [];
  const seen = new Set();

  let match;
  while ((match = titlePattern.exec(html)) !== null) {
    const aid = parseInt(match[1]);
    if (!seen.has(aid)) {
      seen.add(aid);
      articles.push({
        aid,
        title: match[2],
        url: `${BASE_URL}/article-${aid}-1.html`,
      });
    }
  }

  return articles;
}

/**
 * 爬取列表页（支持分页）
 * @param {number} page - 页码
 * @returns {Promise<{articles: Array, totalPages: number}>}
 */
export async function crawlListPage(page) {
  const url = `${BASE_URL}/portal.php?mod=list&catid=78&page=${page}`;
  const html = await httpGet(url);

  const articles = extractArticlesFromList(html);

  // 提取总页数（仅在 page=1 时有用）
  let totalPages = 959; // 默认值
  if (page === 1) {
    const pageMatch = html.match(/\.\.\.\s*(\d+)"[^>]*class="last"/);
    if (pageMatch) {
      totalPages = parseInt(pageMatch[1]);
    }
  }

  return { articles, totalPages };
}

/**
 * 爬取文章详情
 * @param {number} aid - 文章 ID
 * @returns {Promise<object>}
 */
export async function crawlArticleDetail(aid) {
  const url = `${BASE_URL}/article-${aid}-1.html`;
  const html = await httpGet(url);

  // 标题（去掉尾部 ... 等修饰）
  const titleMatch = html.match(/<h1 class="ph">([\s\S]*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/\.{3,}\s*$/, '').trim() : '';

  // 作者和日期
  const authorMatch = html.match(/作者:\s*([^<]*)/);
  const author = authorMatch ? authorMatch[1].trim() : '';

  const dateMatch = html.match(/(\d{4}-\d{1,2}-\d{1,2}\s*\d{1,2}:\d{2})/);
  const date = dateMatch ? dateMatch[1].trim() : '';

  // 正文 HTML（保留图片）
  const contentMatch = html.match(/<td id="article_content">([\s\S]*?)<\/td>/);
  let contentHtml = contentMatch ? contentMatch[1] : '';

  // 提取正文纯文本 + 图片标记
  // 先提取所有图片 URL
  const imgRegex = /https?:\/\/image\.playno1\.com[^\s"']+/g;
  const images = [];
  let imgMatch;
  while ((imgMatch = imgRegex.exec(contentHtml)) !== null) {
    images.push(imgMatch[0]);
  }

  // 提取正文文本（去掉 HTML 标签 + HTML 注释）
  let plainText = contentHtml
    .replace(/<!--[\s\S]*?-->/g, '')    // 去掉 HTML 注释
    .replace(/<[^>]+>/g, '\n')          // 去掉 HTML 标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^[\s\n]+|[\s\n]+$/g, '')
    .trim();

  return {
    aid,
    title,
    author,
    date,
    contentHtml,
    plainText,
    images,
    url,
  };
}

/**
 * 批量爬取列表页（发现新文章）
 * @param {number} startPage - 起始页码
 * @param {number} endPage - 结束页码
 * @param {Set} existingAids - 已有的文章 ID 集合
 * @param {number} delay - 请求间隔（毫秒）
 * @param {function} onProgress - 进度回调
 * @returns {Promise<Array>} 新发现的文章列表
 */
export async function crawlListPages(startPage, endPage, existingAids, delay = 1000, onProgress = null) {
  const newArticles = [];
  let totalPages = endPage;

  for (let page = startPage; page <= endPage; page++) {
    try {
      const { articles } = await crawlListPage(page);

      for (const article of articles) {
        if (!existingAids.has(article.aid)) {
          newArticles.push(article);
          existingAids.add(article.aid);
        }
      }

      if (onProgress) {
        onProgress({
          currentPage: page,
          totalPages,
          foundOnPage: articles.length,
          newFound: newArticles.length,
        });
      }

      if (page < endPage) {
        await sleep(delay);
      }
    } catch (e) {
      console.error(`❌ 列表页 ${page} 爬取失败:`, e.message);
      // 出错继续下一页
      await sleep(delay * 3);
    }
  }

  return newArticles;
}

/**
 * 获取文章总数统计
 */
export async function getStats() {
  const { articles, totalPages } = await crawlListPage(1);
  return { totalPages, articlesPerPage: articles.length };
}
