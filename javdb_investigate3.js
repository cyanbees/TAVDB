const crypto = require('crypto');

const API_BASE = 'https://jdforrepam.com';

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function genSig(ts) {
  const tsSec = Math.floor(parseInt(ts) / 1000).toString();
  const secret = '71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa';
  return { signature: tsSec + '.lpw6vgqzsp.' + md5(tsSec + secret), ts: tsSec };
}

async function apiGet(token, path) {
  const ts = Date.now().toString();
  const { signature, ts: tsSec } = genSig(ts);
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Dart/3.5 (dart:io)',
      'Authorization': `Bearer ${token}`,
      'jdSignature': signature,
      'jdtimestamp': tsSec
    }
  });
  if (!resp.ok) return { error: resp.status };
  const text = await resp.text();
  try { return JSON.parse(text); } catch (e) { return { error: 'parse' }; }
}

async function login() {
  const ts = Date.now().toString();
  const { signature, ts: tsSec } = genSig(ts);
  const resp = await fetch(`${API_BASE}/api/v1/sessions`, {
    method: 'POST',
    headers: {
      'User-Agent': 'Dart/3.5 (dart:io)',
      'Content-Type': 'application/json',
      'jdSignature': signature,
      'jdtimestamp': tsSec
    },
    body: JSON.stringify({
      username: "cybees7@gmail.com",
      password: "jVXHtArwTr6@QV7",
      device_uuid: "04b9534d-5118-53de-9f87-2ddded77111e",
      device_name: "MagnetBoard",
      device_model: "Server",
      platform: "ios",
      system_version: "17.4",
      app_version: "official",
      app_version_number: "1.9.29",
      app_channel: "official"
    })
  });
  const data = await resp.json();
  return data?.data?.token;
}

async function main() {
  const token = await login();
  if (!token) { console.error('Login failed'); process.exit(1); }
  console.log('Login OK');

  // Investigate 五条妃 more thoroughly
  console.log('\n=== 五条妃 detailed ===');
  
  // Try different search patterns
  for (const q of ['五条妃', '五条妃 RKI', '五条妃 イメージビデオ', '五条妃 着エロ', '五条妃 GIF', 'Gojo', '五条妃 五条', '五条妃 妃']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      console.log(`\n  Search "${q}": ${data.data.movies.length} results`);
      for (const m of data.data.movies) {
        console.log(`    ${m.id} - ${m.number} - "${(m.title || '').substring(0, 70)}"`);
        const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
        if (detail?.data?.movie?.actors) {
          for (const a of detail.data.movie.actors) {
            console.log(`      Actor: id=${a.id}, name="${a.name}"`);
          }
        }
      }
    } else {
      console.log(`  Search "${q}": 0 results`);
    }
  }

  // Check what ids 北条麻妃 uses
  console.log('\n=== 北条麻妃 IDs check ===');
  // wZxm vs 9D1q - check if they're the same
  for (const id of ['wZxm', '9D1q']) {
    const data = await apiGet(token, `/api/v2/movies?actor_id=${id}&page=1&limit=2`);
    console.log(`  Actor ${id}: ${JSON.stringify(data).substring(0, 300)}`);
  }
  
  // Check 凪ひかる = 有栖花あか 
  console.log('\n=== 凪ひかる = 有栖花あか verification ===');
  const nagisearch = await apiGet(token, `/api/v2/search?q=${encodeURIComponent('凪ひかる SONE-666')}&type=video&page=1&limit=3`);
  console.log(`  Search result: ${JSON.stringify(nagisearch?.data?.movies?.[0]).substring(0, 400)}`);

  // Check 山岸綺花 - is there a specific movie?
  console.log('\n=== 山岸綺花 = 山岸逢花? ===');
  // Search for 山岸綺花 directly
  for (const q of ['山岸綺花', '山岸綺花 逢花']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      console.log(`\n  Search "${q}":`);
      for (const m of data.data.movies) {
        console.log(`    ${m.id} - ${m.number} - "${(m.title || '').substring(0, 70)}"`);
      }
    } else {
      console.log(`  Search "${q}": 0 results`);
    }
  }

  // Check 稲場るか vs 莉々はるか
  console.log('\n=== 莉々はるか / 稲場るか IDs ===');
  for (const id of ['vNKW', 'ZX3rv']) {
    const data = await apiGet(token, `/api/v2/movies/${id}`);
    console.log(`  ${id}: ${JSON.stringify(data).substring(0, 200)}`);
  }

  // Check if 稲場るか has both IDs
  const ruSearch = await apiGet(token, `/api/v2/search?q=${encodeURIComponent('稲場るか')}&type=video&page=1&limit=5`);
  if (ruSearch?.data?.movies) {
    for (const m of ruSearch.data.movies) {
      const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
      if (detail?.data?.movie?.actors) {
        console.log(`  Movie ${m.number}: actors = [${detail.data.movie.actors.map(a => a.id+':'+a.name).join(', ')}]`);
      }
    }
  }

  // Check miru more carefully
  console.log('\n=== miru / 坂道みる ===');
  // miru is the S1 actress, also known as 坂道みる
  // She changed from 坂道みる to miru
  // Check which ID is for the mainstream AV actress
  for (const q of ['miru S1', 'miru SSNI', 'miru SSIS']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      console.log(`\n  Search "${q}":`);
      for (const m of data.data.movies) {
        const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
        const actors = detail?.data?.movie?.actors || [];
        console.log(`    ${m.id} - ${m.number} - actors: [${actors.map(a => a.id+':'+a.name).join(', ')}]`);
      }
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
