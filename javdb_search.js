const crypto = require('crypto');

const API_BASE = 'https://jdforrepam.com';

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function generateSignature(ts) {
  // ts is milliseconds
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
  const url = `${API_BASE}/api/v1/sessions`;
  const resp = await fetch(url, {
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
  console.log('Login status:', resp.status);
  const token = data?.data?.token;
  if (token) {
    console.log('Token obtained:', token.substring(0, 20) + '...');
    return token;
  }
  console.log('Login response:', JSON.stringify(data, null, 2));
  throw new Error('Login failed: no token in response');
}

async function searchAndExtractActresses(token, name) {
  // Search with type=video
  const ts = Date.now().toString();
  const { signature, ts: tsSec } = generateSignature(ts);
  
  // Try different URL patterns
  const urls = [
    `${API_BASE}/v2/search?q=${encodeURIComponent(name)}&type=video&page=1&limit=10`,
    `${API_BASE}/api/v2/search?q=${encodeURIComponent(name)}&type=video&page=1&limit=10`,
    `${API_BASE}/api/v1/search?q=${encodeURIComponent(name)}&type=video&page=1&limit=10`,
  ];
  
  let data = null;
  let respStatus = 0;
  
  for (const url of urls) {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Dart/3.5 (dart:io)',
        'Authorization': `Bearer ${token}`,
        'jdSignature': signature,
        'jdtimestamp': tsSec
      }
    });
    respStatus = resp.status;
    const text = await resp.text();
    console.log(`  URL: ${url.substring(0, 80)} -> status ${respStatus}`);
    console.log(`  Response (first 300): ${text.substring(0, 300)}`);
    
    if (resp.ok && text.trim().startsWith('{')) {
      try {
        data = JSON.parse(text);
        console.log(`  Parsed OK from ${url.substring(0, 60)}`);
        break;
      } catch (e) {
        console.log(`  JSON parse failed for ${url.substring(0, 60)}`);
      }
    }
  }
  
  if (!data) {
    return { totalResults: 0, items: [], actressesFound: [], raw: { error: 'all_urls_failed', status: respStatus } };
  }
  
  const actresses = new Map();
  let itemWithActress = null;
  
  if (data.items && Array.isArray(data.items)) {
    for (const item of data.items) {
      // Check various possible fields
      for (const field of ['actress', 'actors', 'people', 'stars', 'performers']) {
        if (item[field] && Array.isArray(item[field])) {
          for (const a of item[field]) {
            const key = a.id || a.name || JSON.stringify(a);
            if (!actresses.has(key)) {
              actresses.set(key, a);
            }
          }
          if (!itemWithActress) itemWithActress = item;
        }
      }
    }
  }
  
  return {
    totalResults: data.total || data.total_count || (data.items ? data.items.length : 0),
    items: data.items || [],
    actressesFound: Array.from(actresses.values()),
    raw: data
  };
}

const UNKNOWN_ACTTRESSES = [
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
  let token;
  try {
    token = await login();
  } catch (e) {
    console.error('Login failed:', e.message);
    process.exit(1);
  }

  console.log('\n=== Searching for each unknown actress ===\n');

  const foundActresses = {};

  for (const name of UNKNOWN_ACTTRESSES) {
    console.log(`\n--- Searching: ${name} ---`);
    try {
      const result = await searchAndExtractActresses(token, name);
      
      if (result.actressesFound.length > 0) {
        console.log(`  Found ${result.actressesFound.length} actresses in results:`);
        for (const a of result.actressesFound) {
          console.log(`    id=${a.id || '(no id)'}, name=${a.name || a.actress_name || JSON.stringify(a)}`);
        }
        // Find the best match - one whose name closely matches
        let bestMatch = null;
        for (const a of result.actressesFound) {
          const aName = a.name || a.actress_name || '';
          if (aName === name || aName.includes(name) || name.includes(aName)) {
            bestMatch = a;
            break;
          }
        }
        if (!bestMatch) {
          bestMatch = result.actressesFound[0];
        }
        if (bestMatch && bestMatch.id) {
          foundActresses[name] = bestMatch.id;
        }
      } else {
        console.log(`  No results for "${name}"`);
        // Show raw first item structure to understand format
        if (result.items.length > 0) {
          const keys = Object.keys(result.items[0]);
          console.log(`  First item keys: ${keys.join(', ')}`);
        }
      }
      
      // Also try searching as actress type
      try {
        const ts2 = Date.now().toString();
        const { signature: sig2, ts: tsSec2 } = generateSignature(ts2);
        const url2 = `${API_BASE}/v2/search?q=${encodeURIComponent(name)}&type=actress&page=1&limit=5`;
        const resp2 = await fetch(url2, {
          method: 'GET',
          headers: {
            'User-Agent': 'Dart/3.5 (dart:io)',
            'Authorization': `Bearer ${token}`,
            'jdSignature': sig2,
            'jdtimestamp': tsSec2
          }
        });
        if (resp2.ok) {
          const data2 = await resp2.json();
          console.log(`  Actress search (type=actress): ${JSON.stringify(data2).substring(0, 600)}`);
          if (data2.items && data2.items.length > 0) {
            for (const a of data2.items) {
              console.log(`    actress result: id=${a.id}, name=${a.name}`);
              if (a.id) foundActresses[name] = a.id;
            }
          }
        } else {
          const errText = await resp2.text();
          console.log(`  Actress search failed (${resp2.status}): ${errText.substring(0, 200)}`);
        }
      } catch (e2) {
        console.log(`  Actress-type search error: ${e2.message}`);
      }
      
    } catch (e) {
      console.error(`  Error searching ${name}: ${e.message}`);
    }
  }

  console.log('\n\n========================================');
  console.log('=== FINAL RESULTS: Unknown Actresses ===');
  console.log('========================================\n');
  for (const name of UNKNOWN_ACTTRESSES) {
    const id = foundActresses[name] || 'NOT_FOUND';
    console.log(`${name}=${id}`);
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
