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
  if (!resp.ok) return null;
  const text = await resp.text();
  try { return JSON.parse(text); } catch (e) { return null; }
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

async function investigate(token, searchName) {
  console.log(`\n========== ${searchName} ==========`);
  
  const searchData = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(searchName)}&type=video&page=1&limit=5`);
  if (!searchData?.data?.movies?.length) {
    console.log('  No movies found');
    return;
  }

  const movies = searchData.data.movies;
  
  for (const movie of movies) {
    console.log(`\n  Movie: ${movie.id} - ${movie.number} - "${(movie.title || '').substring(0, 80)}"`);
    
    const detail = await apiGet(token, `/api/v2/movies/${movie.id}`);
    if (!detail?.data?.movie) continue;
    
    const movieData = detail.data.movie;
    const actors = movieData.actors || [];
    
    if (actors.length === 0) {
      console.log('    No actors listed');
    } else {
      for (const a of actors) {
        console.log(`    Actor: id=${a.id}, name="${a.name}"`);
      }
    }
  }
}

async function main() {
  const token = await login();
  if (!token) { console.error('Login failed'); process.exit(1); }
  console.log('Login OK');

  // Investigate problematic cases
  // 1. 凪ひかる - try searching with her romanized name or specific maker
  await investigate(token, '凪ひかる S1');
  await investigate(token, '凪ひかる SONE');
  await investigate(token, 'Nagi Hikaru');
  
  // Check if 有栖花あか is actually 凪ひかる's alias
  await investigate(token, '有栖花あか');
  
  // 2. 五条妃 - try different approaches
  await investigate(token, '五条妃 REBD');
  await investigate(token, '五条妃 イメージ');
  await investigate(token, '五条妃 写真');
  // Maybe she's known as 五条妃 (Gojou Kisaki)
  await investigate(token, 'Gojo Kisaki');
  
  // 3. 山岸綺花 - try different approach
  await investigate(token, '山岸綺花 PRED');
  await investigate(token, '山岸綺花 綺花');
  await investigate(token, 'Yamagishi Ayaka');
  
  // 4. miru - check both candidates
  await investigate(token, '坂道みる');
  
  // 5. 莉々はるか - verify if 稲場るか is correct
  await investigate(token, '稲場るか');
  
  // 6. 浅野こころ - verify 歌野こころ
  await investigate(token, '歌野こころ');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
