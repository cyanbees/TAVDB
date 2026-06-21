/**
 * 清理脚本：删除所有从 playno1 同步到 Blinko 的笔记
 * 使用 OpenAPI 格式
 */
import fetch from 'node-fetch';

const BLINKO_URL = process.env.BLINKO_URL;
const BLINKO_TOKEN = process.env.BLINKO_TOKEN;

if (!BLINKO_URL || !BLINKO_TOKEN) {
  console.error('❌ 请设置 BLINKO_URL 和 BLINKO_TOKEN');
  process.exit(1);
}

const API = BLINKO_URL.replace(/\/+$/, '');

async function openApi(path, body) {
  const url = `${API}/api/v1${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BLINKO_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function main() {
  console.log('🔍 搜索所有 playno1 相关笔记...');

  // 搜索含 playno1.com 的笔记
  const notes = await openApi('/note/list', {
    page: 1,
    size: 200,
    searchText: 'playno1.com',
  });

  if (!notes || notes.length === 0) {
    console.log('✅ 没有找到 playno1 相关笔记');
    return;
  }

  console.log(`📊 找到 ${notes.length} 篇`);
  const ids = notes.map(n => n.id);
  console.log(`   ID: ${ids.join(', ')}`);

  console.log('🗑️  删除中...');
  const result = await openApi('/note/batch-delete', { ids });
  console.log(`✅ 成功删除 ${ids.length} 篇笔记`);
}

main().catch(e => {
  console.error('💥 出错:', e.message);
  process.exit(1);
});
