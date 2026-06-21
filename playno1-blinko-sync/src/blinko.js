import fetch from 'node-fetch';

let BLINKO_URL = '';
let BLINKO_TOKEN = '';

export function initBlinko(url, token) {
  BLINKO_URL = url.replace(/\/+$/, '');
  BLINKO_TOKEN = token;
}

/**
 * 创建或更新笔记
 * @param {object} note
 * @param {string} note.content - Markdown 内容
 * @param {number} note.type - 0=笔记, 1=闪念
 * @param {boolean} note.isArchived - 是否归档
 * @returns {Promise<object>}
 */
export async function upsertNote(note) {
  const url = `${BLINKO_URL}/api/v1/note/upsert`;

  const body = {
    content: note.content,
    type: note.type ?? 0,
  };

  // 如果 isArchived 有值则传入
  if (note.isArchived !== undefined && note.isArchived !== null) {
    body.isArchived = note.isArchived;
  }

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
    throw new Error(`Blinko API 错误 (${res.status}): ${text.slice(0, 200)}`);
  }

  return res.json();
}

/**
 * 测试 Blinko 连接
 */
export async function testConnection() {
  try {
    const result = await upsertNote({
      content: '🚀 PlayNO1 Blinko Sync 脚本测试连接',
      type: 0,
    });
    console.log('✅ Blinko 连接成功');
    return true;
  } catch (e) {
    console.error('❌ Blinko 连接失败:', e.message);
    return false;
  }
}
