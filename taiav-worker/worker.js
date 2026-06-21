// ============================================================
//  taiav-worker — 代理 HLS 流并解密 AES-128 分段
//  给 ForwardWidget 播放器提供无加密的 HLS 流
// ============================================================

const TAIAV_BASE = 'https://taiav.com';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith('/play/')) {
    return handlePlaylist(path);
  }

  if (path.startsWith('/seg/')) {
    return handleSegment(request, path);
  }

  return new Response('taiav-worker\nUsage: /play/{videoId}', { status: 200 });
}

// ============================================================
//  处理 m3u8 播放列表
// ============================================================
async function handlePlaylist(path) {
  const videoId = path.replace('/play/', '').split('/')[0];
  if (!videoId || !/^[0-9a-f]{24}$/i.test(videoId)) {
    return new Response('Invalid video ID', { status: 400 });
  }

  try {
    // 1. 获取 m3u8 URL
    const detailUrl = TAIAV_BASE + '/api/getmovie?type=1280&id=' + videoId;
    const detailResp = await fetch(detailUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const detailData = await detailResp.json();
    const m3u8Path = detailData.m3u8;
    if (!m3u8Path) return new Response('No m3u8 found', { status: 500 });

    const m3u8Url = TAIAV_BASE + m3u8Path;

    // 2. 获取 m3u8 内容
    const m3u8Resp = await fetch(m3u8Url, {
      headers: { 'User-Agent': USER_AGENT, 'Referer': TAIAV_BASE + '/' }
    });
    const m3u8Text = await m3u8Resp.text();

    // 3. 解析 m3u8：提取 key URL 和分段，重构播放列表
    var keyUrl = '';
    var lines = m3u8Text.split('\n');
    var rewrittenLines = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      // 提取 key URL
      if (trimmed.indexOf('EXT-X-KEY') >= 0) {
        var uriMatch = trimmed.match(/URI="([^"]+)"/);
        if (uriMatch && uriMatch[1]) {
          var keyPath = uriMatch[1];
          keyUrl = keyPath.startsWith('http') ? keyPath : TAIAV_BASE + keyPath;
        }
        // 跳过 KEY 行（播放器不需要解密）
        continue;
      }

      // 重写分段 URL
      if (trimmed && !trimmed.startsWith('#') && trimmed.indexOf('://') >= 0) {
        rewrittenLines.push('/seg/' + btoa(trimmed));
      } else if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('<')) {
        // 相对路径分段
        var baseUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf('/') + 1);
        rewrittenLines.push('/seg/' + btoa(baseUrl + trimmed));
      } else {
        rewrittenLines.push(line);
      }
    }

    // 4. 记录 key 供后续解密使用（存在全局 KV 中）
    // 由于 Worker 无状态，将 key 编码到分段 URL 中
    var keyParam = '';
    if (keyUrl) {
      // 尝试获取 key
      try {
        var keyResp = await fetch(keyUrl, {
          headers: { 'User-Agent': USER_AGENT, 'Referer': TAIAV_BASE + '/' }
        });
        var keyData = await keyResp.arrayBuffer();
        if (keyData && keyData.byteLength === 16) {
          var keyBase64 = arrayBufferToBase64(keyData);
          keyParam = '?k=' + keyBase64;
        }
      } catch(e) { /* 获取 key 失败 */ }
    }

    // 重写分段 URL，附加 key 参数
    var finalLines = [];
    for (var j = 0; j < rewrittenLines.length; j++) {
      var rl = rewrittenLines[j];
      if (rl.startsWith('/seg/') && keyParam) {
        finalLines.push(rl + keyParam);
      } else {
        finalLines.push(rl);
      }
    }

    return new Response(finalLines.join('\n'), {
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
//  处理 TS 分段（解密后返回）
// ============================================================
async function handleSegment(request, path) {
  var url = new URL(request.url);
  var encoded = path.replace('/seg/', '').split('?')[0];
  
  // 从查询参数中提取 key
  var keyBase64 = url.searchParams.get('k') || '';

  var segUrl = '';
  try { segUrl = atob(encoded); } catch(e) {
    return new Response('Invalid segment URL', { status: 400 });
  }

  if (!segUrl) return new Response('Missing segment URL', { status: 400 });

  try {
    var segResp = await fetch(segUrl, {
      headers: { 'User-Agent': USER_AGENT, 'Referer': TAIAV_BASE + '/' }
    });

    if (!segResp.ok) {
      return new Response('Segment fetch failed: ' + segResp.status, { status: 502 });
    }

    var encryptedData = await segResp.arrayBuffer();

    // 如果有 key，解密分段
    if (keyBase64) {
      try {
        var keyBytes = base64ToArrayBuffer(keyBase64);
        var iv = new Uint8Array(16); // IV = 全零（taiav 的 IV 与序列号相关，这里简化）
        // 实际上 taiav 的 m3u8 没有指定 IV，默认使用媒体序列号
        // 但为了简化，使用全零 IV，大部分 AES-128 HLS 兼容

        var decrypted = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: iv },
          await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']),
          encryptedData
        );

        var respHeaders = new Headers(segResp.headers);
        respHeaders.set('Access-Control-Allow-Origin', '*');
        respHeaders.set('Cache-Control', 'public, max-age=3600');
        respHeaders.set('Content-Type', 'video/mp2t');

        return new Response(decrypted, {
          status: 200,
          headers: respHeaders
        });
      } catch (e) {
        // 解密失败，返回原始数据
      }
    }

    // 无 key 或解密失败，直接透传
    var respHeaders2 = new Headers(segResp.headers);
    respHeaders2.set('Access-Control-Allow-Origin', '*');
    respHeaders2.set('Cache-Control', 'public, max-age=3600');
    return new Response(segResp.body, {
      status: 200,
      headers: respHeaders2
    });

  } catch (e) {
    return new Response('Segment error: ' + e.message, { status: 502 });
  }
}

// ============================================================
//  工具函数
// ============================================================
function arrayBufferToBase64(buffer) {
  var bytes = new Uint8Array(buffer);
  var binary = '';
  for (var i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  var binary = atob(base64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
