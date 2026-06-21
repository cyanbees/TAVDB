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

// Find actress ID by searching movies and examining their actors field
async function findActressId(token, searchName) {
  // Step 1: Search for movies
  const searchData = await apiGet(token, `/api/v2/search?q=${encodeURIComponent(searchName)}&type=video&page=1&limit=5`);
  if (!searchData?.data?.movies?.length) return null;

  const movies = searchData.data.movies;
  
  // Step 2: For each movie, get details and extract actors
  const seenActors = new Map();
  
  for (const movie of movies) {
    const detail = await apiGet(token, `/api/v2/movies/${movie.id}`);
    if (!detail?.data?.movie) continue;
    
    const movieData = detail.data.movie;
    const actors = movieData.actors || [];
    
    for (const actor of actors) {
      const key = actor.id;
      if (!seenActors.has(key)) {
        seenActors.set(key, { id: actor.id, name: actor.name, avatar: actor.avatar_url });
      }
    }
  }
  
  // Step 3: Find best match - prefer exact match, then partial match
  const allActors = Array.from(seenActors.values());
  
  // Exact match
  let best = allActors.find(a => a.name === searchName);
  if (best) return best;
  
  // Check if search name contains actor name or vice versa
  for (const a of allActors) {
    if (a.name.includes(searchName) || searchName.includes(a.name)) {
      return a;
    }
  }
  
  // Check by partial name overlap (Japanese names)
  for (const a of allActors) {
    // Check if the displayed name matches any part
    for (const part of [searchName, a.name]) {
      const other = part === searchName ? a.name : searchName;
      // Check if at least 2 characters match
      let matchCount = 0;
      for (const ch of part) {
        if (other.includes(ch)) matchCount++;
      }
      if (matchCount >= 2 && matchCount >= Math.min(part.length, other.length) * 0.5) {
        return a;
      }
    }
  }
  
  // Return first if nothing else
  return allActors[0] || null;
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
  console.log('Logging in...');
  const token = await login();
  if (!token) { console.error('Login failed'); process.exit(1); }
  console.log('Login OK\n');

  for (const name of UNKNOWN) {
    process.stdout.write(`${name}... `);
    const result = await findActressId(token, name);
    if (result) {
      console.log(`${result.id} (${result.name})`);
    } else {
      console.log('NOT_FOUND');
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
