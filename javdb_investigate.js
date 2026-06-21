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

  // Investigate the questionable ones
  await investigate(token, '浅野こころ');
  await investigate(token, '凪ひかる');
  await investigate(token, '北条麻妃');
  await investigate(token, '莉々はるか');
  await investigate(token, '五条妃');
  await investigate(token, '山岸綺花');
  await investigate(token, 'miru');
  await investigate(token, '楪カレン');
  await investigate(token, '鷲尾めい');
  
  // Also try some alternative searches
  console.log('\n\n========== Alternative searches ==========');
  
  // Try searching for 凪ひかる with different queries
  for (const q of ['凪ひかる SONE', '凪ひかる S1']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      const m = data.data.movies[0];
      console.log(`\n  Search "${q}": ${m.id} - ${m.number}`);
      const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
      if (detail?.data?.movie?.actors) {
        for (const a of detail.data.movie.actors) {
          console.log(`    Actor: id=${a.id}, name="${a.name}"`);
        }
      }
    }
  }
  
  // Try 五条妃 with different search
  for (const q of ['五条妃 唯井', '五条妃 REBD', '五条妃 RKI']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      const m = data.data.movies[0];
      console.log(`\n  Search "${q}": ${m.id} - ${m.number} - "${(m.title||'').substring(0,60)}"`);
      const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
      if (detail?.data?.movie?.actors) {
        for (const a of detail.data.movie.actors) {
          console.log(`    Actor: id=${a.id}, name="${a.name}"`);
        }
      }
    }
  }
  
  // Try 莉々はるか with more specific search
  for (const q of ['莉々はるか REBD']) {
    const data = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(q)}&type=video&page=1&limit=3`);
    if (data?.data?.movies?.length) {
      const m = data.data.movies[0];
      console.log(`\n  Search "${q}": ${m.id} - ${m.number}`);
      const detail = await apiGet(token, `/api/v2/movies/${m.id}`);
      if (detail?.data?.movie?.actors) {
        for (const a of detail.data.movie.actors) {
          console.log(`    Actor: id=${a.id}, name="${a.name}"`);
        }
      }
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
