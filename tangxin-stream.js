// ==================== 糖心 Stream Source v1.0 ====================
// 用途：作为 Forward 的 stream source，把糖心播放源聚合到其他视频详情页下方。
//
// 策略：
// - 从当前详情页 params 中提取关键词（title / keyword / name）
// - 用关键词搜索糖心 API
// - 返回匹配的 m3u8 播放链接

WidgetMetadata = {
  id: "tangxin_stream",
  title: "糖心 Stream",
  description: "搜索糖心视频播放源",
  author: "GM",
  site: "http://tth.txh069.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "糖心播放源",
      description: "根据当前视频信息匹配糖心播放链接",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

// ==================== 常量 ====================
var BASE = 'http://tth.txh069.com';
var KEY = 'fd14f9f8e38808fa';
var TOKEN = '';
var DEVICE_ID = '';

// AES-128-ECB 纯 JS 实现
var Sbox=[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
var Rcon=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];
function keyExp(k){var Nk=4,Nb=4,Nr=10,w=new Uint8Array(Nb*(Nr+1)*4);for(var i=0;i<Nk;i++){w[i*4]=k[i*4];w[i*4+1]=k[i*4+1];w[i*4+2]=k[i*4+2];w[i*4+3]=k[i*4+3];}for(var i=Nk;i<Nb*(Nr+1);i++){var t=[w[(i-1)*4],w[(i-1)*4+1],w[(i-1)*4+2],w[(i-1)*4+3]];if(i%Nk===0){var tmp=t[0];t[0]=t[1];t[1]=t[2];t[2]=t[3];t[3]=tmp;t[0]=Sbox[t[0]];t[1]=Sbox[t[1]];t[2]=Sbox[t[2]];t[3]=Sbox[t[3]];t[0]^=Rcon[i/Nk];}w[i*4]=w[(i-Nk)*4]^t[0];w[i*4+1]=w[(i-Nk)*4+1]^t[1];w[i*4+2]=w[(i-Nk)*4+2]^t[2];w[i*4+3]=w[(i-Nk)*4+3]^t[3];}return w;}
function addRK(s,w,r){var o=r*16;for(var i=0;i<16;i++)s[i]^=w[o+i];}
function subB(s){for(var i=0;i<16;i++)s[i]=Sbox[s[i]];}
function shfR(s){var t;t=s[1];s[1]=s[5];s[5]=s[9];s[9]=s[13];s[13]=t;t=s[2];s[2]=s[10];s[10]=t;t=s[6];s[6]=s[14];s[14]=t;t=s[3];s[3]=s[15];s[15]=s[11];s[11]=s[7];s[7]=t;}
function gfM(a,b){var r=0;for(var i=0;i<8;i++){if(b&1)r^=a;var h=a&0x80;a=(a<<1)&0xFF;if(h)a^=0x1b;b>>=1;}return r;}
function mixC(s){for(var i=0;i<4;i++){var c=i*4,s0=s[c],s1=s[c+1],s2=s[c+2],s3=s[c+3];s[c]=gfM(s0,2)^gfM(s1,3)^gfM(s2,1)^gfM(s3,1);s[c+1]=gfM(s0,1)^gfM(s1,2)^gfM(s2,3)^gfM(s3,1);s[c+2]=gfM(s0,1)^gfM(s1,1)^gfM(s2,2)^gfM(s3,3);s[c+3]=gfM(s0,3)^gfM(s1,1)^gfM(s2,1)^gfM(s3,2);}}
function invSB(s){var is=[];for(var i=0;i<256;i++)is[Sbox[i]]=i;for(var i=0;i<16;i++)s[i]=is[s[i]];}
function invSR(s){var t;t=s[13];s[13]=s[9];s[9]=s[5];s[5]=s[1];s[1]=t;t=s[2];s[2]=s[10];s[10]=t;t=s[6];s[6]=s[14];s[14]=t;t=s[7];s[7]=s[11];s[11]=s[15];s[15]=s[3];s[3]=t;}
function invMC(s){for(var i=0;i<4;i++){var c=i*4,s0=s[c],s1=s[c+1],s2=s[c+2],s3=s[c+3];s[c]=gfM(s0,14)^gfM(s1,11)^gfM(s2,13)^gfM(s3,9);s[c+1]=gfM(s0,9)^gfM(s1,14)^gfM(s2,11)^gfM(s3,13);s[c+2]=gfM(s0,13)^gfM(s1,9)^gfM(s2,14)^gfM(s3,11);s[c+3]=gfM(s0,11)^gfM(s1,13)^gfM(s2,9)^gfM(s3,14);}}
function encB(b,w){var s=new Uint8Array(b),Nr=10;addRK(s,w,0);for(var r=1;r<Nr;r++){subB(s);shfR(s);mixC(s);addRK(s,w,r);}subB(s);shfR(s);addRK(s,w,Nr);return s;}
function decB(b,w){var s=new Uint8Array(b),Nr=10;addRK(s,w,Nr);for(var r=Nr-1;r>0;r--){invSR(s);invSB(s);addRK(s,w,r);invMC(s);}invSR(s);invSB(s);addRK(s,w,0);return s;}
function ecbEnc(pt,kb){var w=keyExp(kb),pad=16-pt.length%16,r=new Uint8Array(pt.length+pad);r.set(pt);for(var i=pt.length;i<r.length;i++)r[i]=pad;for(var i=0;i<r.length;i+=16){var e=encB(r.slice(i,i+16),w);r.set(e,i);}return r;}
function ecbDec(ct,kb){var w=keyExp(kb),r=new Uint8Array(ct.length);for(var i=0;i<ct.length;i+=16){var d=decB(ct.slice(i,i+16),w);r.set(d,i);}var pad=r[r.length-1];return r.slice(0,r.length-pad);}
function b64e(b){var c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',r='';for(var i=0;i<b.length;i+=3){var v=((b[i])<<16)|((i+1<b.length?b[i+1]:0)<<8)|(i+2<b.length?b[i+2]:0);r+=c[(v>>18)&63]+c[(v>>12)&63];r+=i+1<b.length?c[(v>>6)&63]:'=';r+=i+2<b.length?c[v&63]:'=';}return r;}
function b64d(s){var c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';s=String(s).replace(/[\r\n\s]/g,'');var r=[];for(var i=0;i<s.length;i+=4){var v=(c.indexOf(s[i])<<18)|(c.indexOf(s[i+1])<<12)|((c.indexOf(s[i+2])&63)<<6)|(c.indexOf(s[i+3])&63);r.push((v>>16)&255);if(c.indexOf(s[i+2])!==-1&&s[i+2]!=='=')r.push((v>>8)&255);if(c.indexOf(s[i+3])!==-1&&s[i+3]!=='=')r.push(v&255);}return new Uint8Array(r);}
function u8e(s){var r=[];for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);if(c<0x80)r.push(c);else if(c<0x800){r.push(0xC0|(c>>6));r.push(0x80|(c&0x3F));}else if(c<0xD800||c>=0xE000){r.push(0xE0|(c>>12));r.push(0x80|((c>>6)&0x3F));r.push(0x80|(c&0x3F));}else{i++;c=0x10000+(((c&0x3FF)<<10)|(s.charCodeAt(i)&0x3FF));r.push(0xF0|(c>>18));r.push(0x80|((c>>12)&0x3F));r.push(0x80|((c>>6)&0x3F));r.push(0x80|(c&0x3F));}}return new Uint8Array(r);}
function u8d(b){var r='';for(var i=0;i<b.length;){var c=b[i++];if(c<0x80)r+=String.fromCharCode(c);else if(c<0xE0)r+=String.fromCharCode(((c&0x1F)<<6)|(b[i++]&0x3F));else if(c<0xF0)r+=String.fromCharCode(((c&0x0F)<<12)|((b[i++]&0x3F)<<6)|(b[i++]&0x3F));else{r+=String.fromCharCode(((c&0x07)<<18)|((b[i++]&0x3F)<<12)|((b[i++]&0x3F)<<6)|(b[i++]&0x3F));i++;}}return r;}
function encReq(j){return b64e(ecbEnc(u8e(j),u8e(KEY)));}
function decResp(b){try{return JSON.parse(u8d(ecbDec(b64d(b),u8e(KEY))));}catch(e){return null;}}

// ==================== API 调用 ====================
async function apiCall(path, data) {
  if (!DEVICE_ID) { TOKEN = Widget.storage.get('tx_token')||''; DEVICE_ID = Widget.storage.get('tx_deviceId')||''; }
  if (!DEVICE_ID) {
    var t = Math.round(Date.now()/1000);
    var r1 = await Widget.http.post(BASE+'/h5/system/info', encReq(JSON.stringify({data:{},token:'',deviceId:'',device:'MacIntel',source:'',driver:null})), {headers:{'Content-Type':'text/plain','time':String(t),'deviceType':'web','version':'4.76'}});
    var d1 = decResp(r1.data);
    DEVICE_ID = d1&&d1.status==='y'&&d1.data?d1.data.device_id:'';
    if (DEVICE_ID) { Widget.storage.set('tx_deviceId',DEVICE_ID);
      try { var r2=await Widget.http.post(BASE+'/h5/system/menu', encReq(JSON.stringify({data:{channel_code:'',share_code:''},token:'',deviceId:DEVICE_ID,device:'MacIntel',source:'',driver:null})), {headers:{'Content-Type':'text/plain','time':String(t),'deviceType':'web','version':'4.76'}});
        var d2=decResp(r2.data); if(d2&&d2.status==='y'&&d2.data&&d2.data.token&&d2.data.user_id){TOKEN=d2.data.token+'_'+d2.data.user_id;Widget.storage.set('tx_token',TOKEN);}
      }catch(e){}
    }
    if(!TOKEN) TOKEN = Widget.storage.get('tx_token')||'d67cb541774ef4f173dae9a5be7b2f64_123990311';
  }
  var t=Math.round(Date.now()/1000);
  var body = encReq(JSON.stringify({data:data||{},token:TOKEN||'',deviceId:DEVICE_ID||'',device:'MacIntel',source:'',driver:null}));
  var resp = await Widget.http.post(BASE+path, body, {headers:{'Content-Type':'text/plain','time':String(t),'deviceType':'web','version':'4.76'}});
  var text = typeof resp.data==='string'?resp.data:String(resp.data);
  var result = decResp(text);
  if(!result||result.status!=='y') throw new Error((result&&result.error)||'API Error');
  return result.data;
}

// ==================== 流源主函数 ====================
async function loadResource(params) {
  try {
    // 从 params 中提取关键词
    var keyword = '';
    var candidates = [params.title, params.keyword, params.name, params.code, params.videoId,
      params.fileName, params.seriesName, params.originalTitle, params.episodeName,
      params.query, params.search, params.q];
    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i] && String(candidates[i]).trim()) {
        keyword = String(candidates[i]).trim().substring(0, 30);
        break;
      }
    }
    if (!keyword && params.tmdbInfo) {
      keyword = String(params.tmdbInfo.title || '').trim().substring(0, 30);
    }
    if (!keyword) {
      // 兜底：扫描所有 params 字符串
      var all = collectStr(params);
      for (var i = 0; i < all.length; i++) {
        if (all[i].length > 3) { keyword = all[i].substring(0, 30); break; }
      }
    }
    if (!keyword) return [];

    // 搜索糖心
    var list = await apiCall('/h5/movie/search', {page:1, pageSize:24, order:'new', search:keyword.trim()});
    if (!list || !Array.isArray(list) || list.length === 0) return [];

    // 对每个匹配结果获取详情并返回流
    var items = [];
    var seen = {};
    for (var i = 0; i < Math.min(list.length, 5); i++) {
      var v = list[i];
      if (!v.id || seen[v.id]) continue;
      seen[v.id] = true;
      try {
        var detail = await apiCall('/h5/movie/detail', {id:v.id});
        if (!detail || !detail.play_link) continue;
        // 解锁
        ['ad','ads','ad_apps','layer_ad','layer_ads','play_ads','breaks'].forEach(function(f){if(detail[f])delete detail[f];});
        var url = detail.play_link.startsWith('http')?detail.play_link:BASE+detail.play_link;
        var name = (v.name || '糖心').substring(0, 20) + (detail.lines && detail.lines.length > 1 ? '' : '');
        items.push({name: name + ' 糖心', type: 'hls', url: url, customHeaders: {'Referer':BASE+'/','User-Agent':'Mozilla/5.0'}});
      } catch(e) {}
    }
    return items;
  } catch(e) {
    console.error('[tangxin-stream]', e.message||e);
    return [];
  }
}

function collectStr(value, depth, out, visited) {
  if (!depth) depth = 0; if (!out) out = []; if (!visited) visited = new Set();
  if (depth > 3 || value === null || value === undefined) return out;
  if (typeof value === 'string' && value.trim()) { out.push(value.trim()); return out; }
  if (typeof value !== 'object' || visited.has(value)) return out;
  visited.add(value);
  if (Array.isArray(value)) { for (var i=0;i<value.length;i++) collectStr(value[i],depth+1,out,visited); }
  else { for (var k in value) { try { collectStr(value[k],depth+1,out,visited); } catch(e) {} } }
  return out;
}
