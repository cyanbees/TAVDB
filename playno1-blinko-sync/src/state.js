import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, '..', 'state.json');

const DEFAULT_STATE = {
  lastAid: 0,           // 上次爬到的最大文章 ID
  lastListPage: 0,      // 上次爬到的列表页页码
  totalListPages: 959,  // 列表总页数
  processedAids: [],    // 已处理的文章 ID 列表（防止重复）
  lastRunAt: null,      // 上次运行时间
  mode: null,           // 运行模式: 'full' | 'incremental'
};

export function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      const raw = readFileSync(STATE_FILE, 'utf-8');
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('⚠️  state.json 读取失败，使用默认状态:', e.message);
      return { ...DEFAULT_STATE };
    }
  }
  return { ...DEFAULT_STATE };
}

export function saveState(state) {
  state.lastRunAt = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}
