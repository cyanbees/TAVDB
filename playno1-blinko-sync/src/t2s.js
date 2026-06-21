/**
 * 繁体中文 → 简体中文 转换
 * 使用 opencc-js 纯 JS 实现，无需原生依赖
 */
import OpenCC from 'opencc-js';

let converter = null;

async function getConverter() {
  if (!converter) {
    converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
  }
  return converter;
}

/**
 * 将繁体中文文本转换为简体中文
 * @param {string} text - 繁体中文文本
 * @returns {Promise<string>} 简体中文文本
 */
export async function t2s(text) {
  if (!text) return text;
  const convert = await getConverter();
  return convert(text);
}
