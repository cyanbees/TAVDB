// Heiliao/Bagua 图片解密代理 Worker
// AES-128-CBC 解密 51cg1.com / mrds66.com 的加密图片
// 密钥/IV 从网站前端 JS (zzz.js) 逆向所得

const KEY_STRING = 'f5d965df75336270';
const IV_STRING = '97b60394abc2fbe1';
// 只代理 pic. 开头的图片域名，防止滥用
// 网站经常换 CDN 域名，所以用通配匹配
const ALLOWED_PATTERN = /^https:\/\/pic\.[a-z0-9-]+\.[a-z]+/;

function guessContentType(url) {
  const ext = url.split('.').pop().toLowerCase().split('?')[0];
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
  return map[ext] || 'image/jpeg';
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const imageUrl = url.searchParams.get('url');
      if (!imageUrl) return new Response('Missing url', { status: 400 });

      if (!ALLOWED_PATTERN.test(imageUrl)) {
        return new Response('Domain not allowed: ' + new URL(imageUrl).hostname, { status: 403 });
      }

      const resp = await fetch(imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://51cg1.com/' }
      });
      if (!resp.ok) return new Response('Fetch failed: ' + resp.status, { status: 502 });

      const encryptedData = await resp.arrayBuffer();

      // AES-128-CBC 解密
      const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(KEY_STRING),
        { name: 'AES-CBC' }, false, ['decrypt']
      );
      const iv = new TextEncoder().encode(IV_STRING);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv }, key, encryptedData
      );

      return new Response(decryptedData, {
        headers: {
          'Content-Type': guessContentType(imageUrl),
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }
};
