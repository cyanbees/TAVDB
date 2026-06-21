const crypto = require('crypto');

const API_BASE = 'https://jdforrepam.com';

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function generateSignature(ts) {
  const tsSec = Math.floor(parseInt(ts) / 1000).toString();
  const secret = '71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa';
  const payload = tsSec + ".lpw6vgqzsp." + md5(tsSec + secret);
  return { signature: payload, ts: tsSec };
}

const loginPayload = {
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
};

async function login() {
  const ts = Date.now().toString();
  const { signature, ts: tsSec } = generateSignature(ts);
  const resp = await fetch(`${API_BASE}/api/v1/sessions`, {
    method: 'POST',
    headers: {
      'User-Agent': 'Dart/3.5 (dart:io)',
      'Content-Type': 'application/json',
      'jdSignature': signature,
      'jdtimestamp': tsSec
    },
    body: JSON.stringify(loginPayload)
  });
  const data = await resp.json();
  const token = data?.data?.token;
  if (token) return token;
  throw new Error('Login failed: ' + JSON.stringify(data));
}

async function apiGet(token, path) {
  const ts = Date.now().toString();
  const { signature, ts: tsSec } = generateSignature(ts);
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Dart/3.5 (dart:io)',
      'Authorization': `Bearer ${token}`,
      'jdSignature': signature,
      'jdtimestamp': tsSec
    }
  });
  const text = await resp.text();
  if (!resp.ok) {
    console.log(`  GET ${path} -> ${resp.status}: ${text.substring(0, 200)}`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log(`  GET ${path} -> JSON parse error: ${text.substring(0, 200)}`);
    return null;
  }
}

async function searchMovies(token, name) {
  const path = `/api/v2/search?q=${encodeURIComponent(name)}&type=video&page=1&limit=5`;
  const data = await apiGet(token, path);
  if (!data || !data.data || !data.data.movies) return [];
  return data.data.movies;
}

async function getMovieDetail(token, movieId) {
  return await apiGet(token, `/api/v1/movies/${movieId}`);
}

const UNKNOWN = [
  '浅野こころ',
  '小那海あや',
  '楪カレン',
  '鷲尾めい',
  'miru',
  '天月あず',
  '凪ひかる',
  '天馬ゆい',
  '北条麻妃',
  '莉々はるか',
  '五条妃',
  '山岸綺花',
];

async function main() {
  console.log('=== Logging in to JavDB ===');
  const token = await login();
  console.log('Token obtained\n');

  const results = {};

  for (const name of UNKNOWN) {
    console.log(`\n=== ${name} ===`);
    const movies = await searchMovies(token, name);
    console.log(`  Movies found: ${movies.length}`);
    
    if (movies.length === 0) {
      results[name] = null;
      continue;
    }
    
    // Show movie IDs
    for (const m of movies) {
      console.log(`  Movie: ${m.id} - ${m.number} - ${(m.title || '').substring(0, 60)}`);
    }
    
    // Fetch details for first 2 movies to find actress info
    let foundActressId = null;
    let foundActressName = null;
    
    for (const m of movies.slice(0, 2)) {
      console.log(`  Fetching detail for movie ${m.id}...`);
      const detail = await getMovieDetail(token, m.id);
      if (!detail) continue;
      
      console.log(`  Detail keys: ${Object.keys(detail).join(', ')}`);
      
      // Check different possible locations for actress data
      const data = detail.data || detail;
      console.log(`  Data keys: ${Object.keys(data).join(', ')}`);
      
      // Look for actress/actors in all possible locations
      for (const field of ['actress', 'actors', 'people', 'stars', 'performers']) {
        if (data[field]) {
          console.log(`  ${field}: ${JSON.stringify(data[field]).substring(0, 500)}`);
          const arr = Array.isArray(data[field]) ? data[field] : [data[field]];
          for (const a of arr) {
            const aId = a.id || a.actress_id || '';
            const aName = a.name || a.actress_name || '';
            console.log(`    -> id=${aId}, name=${aName}`);
            if (aId && !foundActressId) {
              foundActressId = aId;
              foundActressName = aName;
            }
          }
        }
      }
      
      // Also check movie tags/people
      if (data.tags) {
        console.log(`  tags (first few): ${JSON.stringify((data.tags || []).slice(0, 5))}`);
      }
      if (data.cast) {
        console.log(`  cast: ${JSON.stringify(data.cast).substring(0, 300)}`);
      }
      
      // Try fetching the movie's people endpoint if exists
      if (m.id) {
        const people = await apiGet(token, `/api/v1/movies/${m.id}/people`);
        if (people) {
          console.log(`  /people: ${JSON.stringify(people).substring(0, 500)}`);
        }
        const actresses = await apiGet(token, `/api/v1/movies/${m.id}/actresses`);
        if (actresses) {
          console.log(`  /actresses: ${JSON.stringify(actresses).substring(0, 500)}`);
        }
      }
      
      if (foundActressId) break;
    }
    
    if (foundActressId) {
      console.log(`  >> FOUND: ${name} -> ${foundActressId} (${foundActressName})`);
      results[name] = foundActressId;
    } else {
      console.log(`  >> NOT FOUND in movie details`);
      results[name] = null;
    }
  }

  console.log('\n\n========================================');
  console.log('FINAL RESULTS');
  console.log('========================================');
  for (const [name, id] of Object.entries(results)) {
    console.log(`${name}=${id || 'NOT_FOUND'}`);
  }
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
