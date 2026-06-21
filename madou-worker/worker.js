// ============================================================
//  madou-worker — 代理 HLS 流并解密 AES-128 分段
//  给 ForwardWidget 播放器提供无加密的 HLS 流
//  调用方式: /proxy?url={m3u8_url}&key={base64_key}
//  url = 完整的原始 m3u8 URL（含 token）
//  key = AES-128 密钥的 base64
// ============================================================

const DASH_BASE = 'https://dash.madou.club';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // /proxy?url=...&key=...
  if (path === '/proxy') {
    return handleProxy(request, url);
  }

  // /seg/{base64url}?k={base64key}
  if (path.startsWith('/seg/')) {
    return handleSegment(request, path);
  }

  return new Response('madou-worker\nUsage: /proxy?url={m3u8_url}&key={base64_key}', { status: 200 });
}

// ============================================================
//  处理 m3u8 播放列表
// ============================================================
async function handleProxy(request, url) {
  var m3u8Url = url.searchParams.get('url') || '';
  var keyBase64 = url.searchParams.get('key') || '';

  if (!m3u8Url) return new Response('Missing url parameter', { status: 400 });

  try {
    var m3u8Resp = await fetch(m3u8Url, {
      headers: { 'User-Agent': USER_AGENT, 'Referer': DASH_BASE + '/' }
    });
    if (!m3u8Resp.ok) return new Response('m3u8 fetch failed: ' + m3u8Resp.status, { status: 502 });
    var m3u8Text = await m3u8Resp.text();

    var lines = m3u8Text.split('\n');
    var rewrittenLines = [];
    var m3u8Base = m3u8Url.substring(0, m3u8Url.lastIndexOf('/') + 1);
    var m3u8Origin = new URL(m3u8Url).origin;

    // 解析 token 参数
    var m3u8UrlObj = new URL(m3u8Url);
    var token = m3u8UrlObj.searchParams.get('token') || '';

    // 获取 AES key
    var keyBase64 = '';
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();
      if (trimmed.indexOf('EXT-X-KEY') >= 0) {
        var uriMatch = trimmed.match(/URI="([^"]+)"/);
        if (uriMatch && uriMatch[1]) {
          var keyPath = uriMatch[1];
          var keyUrl = keyPath.startsWith('http') ? keyPath : m3u8Origin + keyPath;
          try {
            var keyResp = await fetch(keyUrl, {
              headers: { 'User-Agent': USER_AGENT, 'Referer': DASH_BASE + '/' }
            });
            if (keyResp.ok) {
              var keyData = await keyResp.arrayBuffer();
              if (keyData.byteLength === 16) {
                keyBase64 = arrayBufferToBase64(keyData);
              }
            }
          } catch(e) {}
        }
        break;
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      // 跳过 KEY 行
      if (trimmed.indexOf('EXT-X-KEY') >= 0) continue;

      // 重写分段 URL
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('<')) {
        var segFullUrl;
        if (trimmed.indexOf('://') >= 0) {
          segFullUrl = trimmed;
        } else if (trimmed.startsWith('/')) {
          segFullUrl = DASH_BASE + trimmed;
        } else {
          segFullUrl = m3u8Base + trimmed;
        }
        // 如果原始 m3u8 有 token，附加到分段
        if (token) {
          segFullUrl += (segFullUrl.indexOf('?') >= 0 ? '&' : '?') + 'token=' + encodeURIComponent(token);
        }
        var encoded = btoa(segFullUrl);
        var segLine = '/seg/' + encoded;
        if (keyBase64) segLine += '?k=' + keyBase64;
        rewrittenLines.push(segLine);
      } else {
        rewrittenLines.push(line);
      }
    }

    return new Response(rewrittenLines.join('\n'), {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (e) {
    return new Response('Worker error: ' + e.message, { status: 500 });
  }
}

// ============================================================
//  处理 TS 分段
// ============================================================
async function handleSegment(request, path) {
  var reqUrl = new URL(request.url);
  var encoded = path.replace('/seg/', '').split('?')[0];
  var keyBase64 = reqUrl.searchParams.get('k') || '';

  var segUrl = '';
  try { segUrl = atob(encoded); } catch(e) {
    return new Response('Invalid segment URL', { status: 400 });
  }
  if (!segUrl) return new Response('Missing segment URL', { status: 400 });

  try {
    var segResp = await fetch(segUrl, {
      headers: { 'User-Agent': USER_AGENT, 'Referer': DASH_BASE + '/' }
    });
    if (!segResp.ok) return new Response('Segment fetch failed: ' + segResp.status, { status: 502 });

    var encryptedData = await segResp.arrayBuffer();

    if (keyBase64) {
      try {
        var keyBytes = base64ToArrayBuffer(keyBase64);
        var iv = new Uint8Array(16); // madou 固定 IV = 0x00000000000000000000000000000000

        var decrypted = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: iv },
          await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']),
          encryptedData
        );

        return new Response(decrypted, {
          headers: {
            'Content-Type': 'video/mp2t',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch(e) {
        // 解密失败，返回原始
      }
    }

    return new Response(segResp.body, {
      headers: {
        'Content-Type': 'video/mp2t',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (e) {
    return new Response('Segment error: ' + e.message, { status: 502 });
  }
}

function base64ToArrayBuffer(base64) {
  var binary = atob(base64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  var bytes = new Uint8Array(buffer);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
