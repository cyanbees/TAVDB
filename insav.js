// ==================== Insav Stream Source v1.0 ====================
// 用途：作为 Forward 的 stream source，搜索 4k.insav.tv 并返回播放链接。
//
// 策略：
// - 从当前详情页 params 中提取标题/番号/关键词。
// - 用关键词搜索 4k.insav.tv 的 API。
// - 找到匹配的视频，获取 m3u8 播放地址。
// - 返回 Insav 4K 播放源。
//
// API 加密说明：
// - 所有 API 请求体使用 AES-256-CBC 加密 (post-data 格式)
// - 需要 MD5 签名 + 自定义请求头 (suffix, lang)
// - Token 从 insav-pages.pages.dev/token 自动获取

WidgetMetadata = {
  id: "insav_stream",
  title: "Insav 4K Stream",
  description: "通过标题匹配 4k.insav.tv 播放源",
  author: "EL",
  site: "https://4k.insav.tv",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "Insav 4K 播放源",
      description: "搜索 4k.insav.tv 匹配当前视频",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

// ==================== 加密参数 ====================
var CRYPTO_KEY_STR = "0XxdjmI55ZjjqQLO3nI7gGqrBP0Vz9jS";
var CRYPTO_IV_PREFIX = "RWf23muavY";
var CRYPTO_SIGN_KEY = "NRkw0g3iJLDvw5tJ5PuVt5276z0SOuyL";
var CRYPTO_SUFFIX = "NWSdef";
var API_DOMAIN = "https://4k.insav.tv";

var REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
  "Referer": "https://4k.insav.tv/",
  "Content-Type": "application/json",
  "suffix": "NWSdef",
  "lang": "zh"
};

// ==================== atob polyfill ====================
if (typeof atob === "undefined") {
  function atob(s) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(s).replace(/[\r\n\s]/g, "");
    var result = "";
    for (var i = 0; i < str.length; i += 4) {
      var c1 = chars.indexOf(str.charAt(i));
      var c2 = chars.indexOf(str.charAt(i + 1));
      var c3 = chars.indexOf(str.charAt(i + 2));
      var c4 = chars.indexOf(str.charAt(i + 3));
      if (c1 === -1 || c2 === -1) break;
      var triple = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
      result += String.fromCharCode((triple >>> 16) & 255);
      if (c3 !== -1 && str.charAt(i + 2) !== "=") result += String.fromCharCode((triple >>> 8) & 255);
      if (c4 !== -1 && str.charAt(i + 3) !== "=") result += String.fromCharCode(triple & 255);
    }
    return result;
  }
}

// ==================== MD5 纯 JS ====================
function md5(s) {
  function rotateLeft(lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); }
  function addUnsigned(lX, lY) {
    var lX4 = lX & 0x40000000, lY4 = lY & 0x40000000;
    var lX8 = lX & 0x80000000, lY8 = lY & 0x80000000;
    var lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    } else return (lResult ^ lX8 ^ lY8);
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | (~z)); }
  function FF(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function GG(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function HH(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function II(a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function convertToWordArray(str) {
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0, lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  var x = convertToWordArray(s);
  var a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  for (var k = 0; k < x.length; k += 16) {
    var AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235); c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }
  function wordToHex(lValue) {
    var w = "", t, b;
    for (var i = 0; i <= 3; i++) { b = (lValue >>> (i * 8)) & 255; t = "0" + b.toString(16); w += t.substr(t.length - 2, 2); }
    return w;
  }
  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

// ==================== Base64 ====================
function base64Decode(str) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var result = [];
  str = String(str).replace(/[\r\n\s]/g, "");
  for (var i = 0; i < str.length; i += 4) {
    var c1 = chars.indexOf(str.charAt(i)), c2 = chars.indexOf(str.charAt(i + 1));
    var c3 = chars.indexOf(str.charAt(i + 2)), c4 = chars.indexOf(str.charAt(i + 3));
    if (c1 === -1 || c2 === -1) break;
    var triple = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
    result.push((triple >>> 16) & 255);
    if (c3 !== -1 && str.charAt(i + 2) !== "=") result.push((triple >>> 8) & 255);
    if (c4 !== -1 && str.charAt(i + 3) !== "=") result.push(triple & 255);
  }
  return new Uint8Array(result);
}

function base64Encode(bytes) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var result = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var b1 = bytes[i], b2 = i + 1 < bytes.length ? bytes[i + 1] : 0, b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    var triple = (b1 << 16) | (b2 << 8) | b3;
    result += chars.charAt((triple >>> 18) & 63);
    result += chars.charAt((triple >>> 12) & 63);
    if (i + 1 < bytes.length) result += chars.charAt((triple >>> 6) & 63); else result += "=";
    if (i + 2 < bytes.length) result += chars.charAt(triple & 63); else result += "=";
  }
  return result;
}

// ==================== AES-256-CBC 纯 JS ====================
var Sbox = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];
var Rcon = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

function keyExpansion(key) {
  var Nk = 8, Nb = 4, Nr = 14, w = new Uint8Array(Nb * (Nr + 1) * 4);
  for (var i = 0; i < Nk; i++) { w[i*4]=key[i*4]; w[i*4+1]=key[i*4+1]; w[i*4+2]=key[i*4+2]; w[i*4+3]=key[i*4+3]; }
  for (var i = Nk; i < Nb * (Nr + 1); i++) {
    var t = new Uint8Array(4); t[0]=w[(i-1)*4]; t[1]=w[(i-1)*4+1]; t[2]=w[(i-1)*4+2]; t[3]=w[(i-1)*4+3];
    if (i % Nk === 0) { var r = t[0]; t[0]=t[1]; t[1]=t[2]; t[2]=t[3]; t[3]=r; t[0]=Sbox[t[0]]; t[1]=Sbox[t[1]]; t[2]=Sbox[t[2]]; t[3]=Sbox[t[3]]; t[0] ^= Rcon[i/Nk]; }
    else if (i % Nk === 4) { t[0]=Sbox[t[0]]; t[1]=Sbox[t[1]]; t[2]=Sbox[t[2]]; t[3]=Sbox[t[3]]; }
    w[i*4]=w[(i-Nk)*4]^t[0]; w[i*4+1]=w[(i-Nk)*4+1]^t[1]; w[i*4+2]=w[(i-Nk)*4+2]^t[2]; w[i*4+3]=w[(i-Nk)*4+3]^t[3];
  }
  return w;
}

function aesCbcDecrypt(ct, keyBytes, iv) {
  var w = keyExpansion(keyBytes), bc = ct.length / 16, pt = new Uint8Array(ct.length), prev = new Uint8Array(iv);
  function ar(st, w, r) { var o=r*16; for(var i=0;i<16;i++) st[i]^=w[o+i]; }
  function isb(st) { var is=[]; for(var i=0;i<256;i++) is[Sbox[i]]=i; for(var i=0;i<16;i++) st[i]=is[st[i]]; }
  function isr(st) { var t; t=st[13];st[13]=st[9];st[9]=st[5];st[5]=st[1];st[1]=t; t=st[2];st[2]=st[10];st[10]=t; t=st[6];st[6]=st[14];st[14]=t; t=st[7];st[7]=st[11];st[11]=st[15];st[15]=st[3];st[3]=t; }
  function gf(a,b) { var r=0; for(var i=0;i<8;i++){if(b&1)r^=a;var h=a&0x80;a=(a<<1)&0xFF;if(h)a^=0x1b;b>>=1;}return r; }
  function imc(st) { for(var i=0;i<4;i++){var c=i*4,s0=st[c],s1=st[c+1],s2=st[c+2],s3=st[c+3]; st[c]=gf(s0,14)^gf(s1,11)^gf(s2,13)^gf(s3,9); st[c+1]=gf(s0,9)^gf(s1,14)^gf(s2,11)^gf(s3,13); st[c+2]=gf(s0,13)^gf(s1,9)^gf(s2,14)^gf(s3,11); st[c+3]=gf(s0,11)^gf(s1,13)^gf(s2,9)^gf(s3,14); } }
  function adb(bk, w) { var st=new Uint8Array(bk); ar(st,w,14); for(var r=14-1;r>0;r--){isr(st);isb(st);ar(st,w,r);imc(st);} isr(st);isb(st);ar(st,w,0); return st; }
  for (var b = 0; b < bc; b++) {
    var block = ct.slice(b*16,(b+1)*16), dec = adb(block, w);
    for (var i=0;i<16;i++) pt[b*16+i] = dec[i] ^ prev[i];
    prev = block;
  }
  return pt;
}

function aesCbcEncrypt(pt, keyBytes, iv) {
  var padLen = 16 - (pt.length % 16), padded = new Uint8Array(pt.length + padLen);
  padded.set(pt); for(var i=pt.length;i<padded.length;i++) padded[i]=padLen;
  var w = keyExpansion(keyBytes), bc = padded.length/16, ct = new Uint8Array(padded.length), prev = new Uint8Array(iv);
  function ar(st,w,r){var o=r*16;for(var i=0;i<16;i++)st[i]^=w[o+i];}
  function sb(st){for(var i=0;i<16;i++)st[i]=Sbox[st[i]];}
  function sr(st){var t;t=st[1];st[1]=st[5];st[5]=st[9];st[9]=st[13];st[13]=t;t=st[2];st[2]=st[10];st[10]=t;t=st[6];st[6]=st[14];st[14]=t;t=st[3];st[3]=st[15];st[15]=st[11];st[11]=st[7];st[7]=t;}
  function gf(a,b){var r=0;for(var i=0;i<8;i++){if(b&1)r^=a;var h=a&0x80;a=(a<<1)&0xFF;if(h)a^=0x1b;b>>=1;}return r;}
  function mc(st){for(var i=0;i<4;i++){var c=i*4,s0=st[c],s1=st[c+1],s2=st[c+2],s3=st[c+3];st[c]=gf(s0,2)^gf(s1,3)^gf(s2,1)^gf(s3,1);st[c+1]=gf(s0,1)^gf(s1,2)^gf(s2,3)^gf(s3,1);st[c+2]=gf(s0,1)^gf(s1,1)^gf(s2,2)^gf(s3,3);st[c+3]=gf(s0,3)^gf(s1,1)^gf(s2,1)^gf(s3,2);}}
  function aeb(bk,w){var st=new Uint8Array(bk);ar(st,w,0);for(var r=1;r<14;r++){sb(st);sr(st);mc(st);ar(st,w,r);}sb(st);sr(st);ar(st,w,14);return st;}
  for (var b = 0; b < bc; b++) {
    var block = padded.slice(b*16,(b+1)*16);
    for (var i=0;i<16;i++) block[i] ^= prev[i];
    var enc = aeb(block, w); ct.set(enc, b*16); prev = enc;
  }
  return ct;
}

// ==================== UTF-8 工具 ====================
function strToBytes(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 0x80) result.push(c);
    else if (c < 0x800) { result.push(0xC0|(c>>6)); result.push(0x80|(c&0x3F)); }
    else if (c < 0xD800||c>=0xE000) { result.push(0xE0|(c>>12)); result.push(0x80|((c>>6)&0x3F)); result.push(0x80|(c&0x3F)); }
    else { i++; var cp = 0x10000+(((c&0x3FF)<<10)|(str.charCodeAt(i)&0x3FF)); result.push(0xF0|(cp>>18)); result.push(0x80|((cp>>12)&0x3F)); result.push(0x80|((cp>>6)&0x3F)); result.push(0x80|(cp&0x3F)); }
  }
  return new Uint8Array(result);
}

function bytesToStr(bytes) {
  var result = '';
  for (var i = 0; i < bytes.length;) {
    var c = bytes[i++];
    if (c < 0x80) result += String.fromCharCode(c);
    else if (c < 0xE0) result += String.fromCharCode(((c&0x1F)<<6)|(bytes[i++]&0x3F));
    else if (c < 0xF0) result += String.fromCharCode(((c&0x0F)<<12)|((bytes[i++]&0x3F)<<6)|(bytes[i++]&0x3F));
    else { result += String.fromCharCode(((c&0x07)<<18)|((bytes[i++]&0x3F)<<12)|((bytes[i++]&0x3F)<<6)|(bytes[i++]&0x3F)); i++; }
  }
  return result;
}

// ==================== 加解密 ====================
function encryptInsav(pt, suffix) {
  var k = strToBytes(CRYPTO_KEY_STR), iv = strToBytes(CRYPTO_IV_PREFIX + (suffix||CRYPTO_SUFFIX));
  var pb = typeof pt === 'string' ? strToBytes(pt) : pt;
  return base64Encode(aesCbcEncrypt(pb, k, iv));
}

function decryptInsav(data, suffix) {
  try {
    var buf = base64Decode(data); if (!buf||buf.length<16) return null;
    var pt = aesCbcDecrypt(buf, strToBytes(CRYPTO_KEY_STR), strToBytes(CRYPTO_IV_PREFIX + (suffix||CRYPTO_SUFFIX)));
    var pad = pt[pt.length-1]; if (pad<1||pad>16) return null;
    return bytesToStr(pt.slice(0, pt.length-pad));
  } catch(e) { return null; }
}

// ==================== 签名 ====================
function calcSign(params) {
  var keys = []; for (var k in params) { if (params.hasOwnProperty(k)) keys.push(k); }
  keys.sort();
  var str = ""; for (var i=0;i<keys.length;i++) { str += keys[i] + "=" + params[keys[i]] + "&"; }
  return md5(str + CRYPTO_SIGN_KEY);
}

// ==================== Token ====================
var _token = null;
async function getToken() {
  if (_token) return _token;
  try {
    var resp = await Widget.http.get("https://insav-pages.pages.dev/token", {
      headers: {"User-Agent": REQUEST_HEADERS["User-Agent"], "Accept": "application/json"}
    });
    if (resp && resp.data) {
      var data = typeof resp.data === 'string' ? JSON.parse(resp.data) : resp.data;
      if (data && data.token) { _token = data.token; return data.token; }
    }
  } catch(e) { console.error("[insav_stream] token失败:", e.message); }
  return null;
}

// ==================== API 调用 ====================
async function apiPost(endpoint, paramsObj) {
  var c = { site:4, device:2, timestamp: new Date().getTime() };
  if (paramsObj) { for (var k in paramsObj) { if (paramsObj.hasOwnProperty(k)) c[k] = paramsObj[k]; } }
  c.encode_sign = calcSign(c);
  var body = JSON.stringify({"post-data": encryptInsav(JSON.stringify(c))});
  var resp = await Widget.http.post(API_DOMAIN+"/api/"+endpoint, body, { headers: REQUEST_HEADERS });
  if (!resp||!resp.data) throw new Error("空响应");
  var data = resp.data; if (typeof data==='string') data = JSON.parse(data);
  if (data&&data.data&&data.suffix) {
    var dec = decryptInsav(data.data, data.suffix);
    if (dec) { var j = JSON.parse(dec); if (j.code===1) return j; throw new Error(j.msg||"API错误"); }
  }
  throw new Error("响应格式异常");
}

// ==================== 搜索关键词提取（番号模式匹配）====================
function normalizeKeyword(text) {
  if (!text) return "";
  return String(text).replace(/[_\-\s]+/g, " ").trim();
}

// 从文本中提取番号（如 SONE-983, FC2-PPV-1234567 等）
function extractCode(text) {
  var s = String(text || "").toUpperCase().replace(/\./g, " ").replace(/\s+/g, " ").trim();
  if (!s) return "";

  var patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\bCARIB[- ]?\d{6,8}\b/,
    /\b1PONDO[- ]?\d{6,8}\b/,
    /\bHEYZO[- ]?\d{3,6}\b/,
    /\bT28[- ]?\d{6,8}\b/,
    /\b(?:SONE|S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS|ESD|GVG|REAL|LAF|SMD|MD|BAD|MOND|ARSO|MOCKY|FONE|GANA|MUKO|PAPA|RASH|TAMA|ZUKO|HEY|PACO)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/,
    /\b\d{6,8}\b/
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = s.match(patterns[i]);
    if (match && match[0]) {
      return match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-");
    }
  }
  return "";
}

// 递归收集 params 内所有字符串值
function collectStringValues(value, depth, out, visited) {
  if (!visited) visited = [];
  if (value === null || value === undefined) return;
  if (depth > 5) return;
  var type = typeof value;
  if (type === "string" || type === "number") {
    var text = String(value).trim();
    if (text) out.push(text);
    return;
  }
  if (type !== "object") return;
  if (visited.indexOf(value) >= 0) return;
  visited.push(value);
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) collectStringValues(value[i], depth + 1, out, visited);
    return;
  }
  for (var k in value) {
    if (value.hasOwnProperty(k)) collectStringValues(value[k], depth + 1, out, visited);
  }
}

function extractKeywordFromParams(params) {
  if (!params || typeof params !== 'object') return "";
  
  // 第一轮：从最可能含番号的字段提取
  var priorityCandidates = [
    params.code, params.videoId, params.number,
    params.fileName, params.filename, params.file_name,
    params.name, params.title, params.seriesName, params.originalTitle, params.originalName,
    params.episodeName, params.description, params.genreTitle,
    params.overview, params.link, params.url, params.videoUrl, params.playUrl, params.streamUrl,
    params.id, params.path, params.filePath, params.file_path,
    params.mediaPath, params.media_path, params.itemPath, params.item_path,
    params.localPath, params.local_path, params.originalFilename, params.originalFileName
  ];

  // 嵌套对象
  if (params.tmdbInfo) {
    priorityCandidates.push(params.tmdbInfo.title, params.tmdbInfo.name, params.tmdbInfo.originalTitle, params.tmdbInfo.originalName, params.tmdbInfo.overview);
  }
  if (params.info) {
    priorityCandidates.push(params.info.title, params.info.name, params.info.originalTitle, params.info.originalName, params.info.overview);
  }
  if (params.mediaSource) {
    priorityCandidates.push(params.mediaSource.name, params.mediaSource.fileName, params.mediaSource.filename, params.mediaSource.path, params.mediaSource.url, params.mediaSource.streamUrl);
  }
  if (Array.isArray(params.mediaSources)) {
    for (var i = 0; i < params.mediaSources.length; i++) {
      var s = params.mediaSources[i];
      if (s) priorityCandidates.push(s.name, s.fileName, s.filename, s.path, s.url, s.streamUrl);
    }
  }

  // 先从优先级字段提取番号
  for (var i = 0; i < priorityCandidates.length; i++) {
    var code = extractCode(priorityCandidates[i]);
    if (code) return code;
  }

  // 再从优先级字段提取普通关键词
  for (var i = 0; i < priorityCandidates.length; i++) {
    var kw = normalizeKeyword(priorityCandidates[i]);
    if (kw && kw.length >= 4) return kw;
  }

  // 兜底：递归扫描所有字符串
  var allStrings = [];
  collectStringValues(params, 0, allStrings);
  for (var i = 0; i < allStrings.length; i++) {
    var code = extractCode(allStrings[i]);
    if (code) return code;
  }
  for (var i = 0; i < allStrings.length; i++) {
    var kw = normalizeKeyword(allStrings[i]);
    if (kw && kw.length >= 4) return kw;
  }

  return "";
}

// ==================== loadResource ====================
async function loadResource(params) {
  try {
    // 记录完整 params 用于调试
    console.log("[insav_stream] ===== loadResource 被调用 =====");
    console.log("[insav_stream] params 类型:", typeof params);
    try { console.log("[insav_stream] params keys:", Object.keys(params).join(", ")); } catch(e) {}
    
    // 提取搜索关键词
    var keyword = extractKeywordFromParams(params);
    console.log("[insav_stream] 提取到的关键词:", keyword || "(空)");
    
    if (!keyword) {
      console.log("[insav_stream] 未提取到搜索关键词，跳过");
      return [];
    }

    // 获取 token
    await getToken();

    // 搜索视频（用 video/lists + keyword，比 video/search 更稳定）
    var searchResult = await apiPost("video/lists", { keyword: keyword, page: 1, limit: 10 });
    var list = searchResult.data && searchResult.data.data ? searchResult.data.data : [];
    
    // 精确匹配：只保留强相关结果
    var kwClean = keyword.toUpperCase().replace(/[\s_\-]+/g, "");
    var kwOriginal = keyword.toUpperCase().trim();
    
    var matched = [];
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var titleUpper = (v.title || "").toUpperCase();
      var mashClean = (v.mash || "").toUpperCase().replace(/[\s_\-]+/g, "");
      
      // 1. 番号精确匹配
      if (mashClean === kwClean) { matched.push(v); continue; }
      
      // 2. 标题包含完整关键词（保留连字符，避免 START 误匹配 STAR）
      //    "STAR-083" 在 "START-483" 中 → -1 ✗
      //    "STAR-083" 在 "[STAR-083] ..." 中 → 0 ✓
      if (titleUpper.indexOf(kwOriginal) >= 0) { matched.push(v); continue; }
      
      // 3. 无连字符版本也检查（部分番号可能不带连字符）
      if (kwClean.length >= 5 && titleUpper.replace(/[\s_\-]+/g, "").indexOf(kwClean) >= 0) {
        matched.push(v); continue;
      }
    }
    
    list = matched;
    if (list.length > 3) list = list.slice(0, 3);
    
    if (list.length === 0) {
      // 尝试用更短的词搜索
      var shortKw = keyword.split(/[\s\-_]+/)[0];
      if (shortKw && shortKw.length >= 4) {
        searchResult = await apiPost("video/lists", { keyword: shortKw, page: 1, limit: 10 });
        var fallbackList = searchResult.data && searchResult.data.data ? searchResult.data.data : [];
        // 对降级结果过滤：检查原始关键词（含连字符或不含）是否出现在标题/番号中
        var kwFull = keyword.toUpperCase().trim();
        var kwFullClean = kwFull.replace(/[\s_\-]+/g, "");
        var filtered = [];
        for (var fi = 0; fi < fallbackList.length; fi++) {
          var fv = fallbackList[fi];
          var ft = (fv.title || "").toUpperCase();
          var fm = (fv.mash || "").toUpperCase().replace(/[\s_\-]+/g, "");
          // 检查：原始关键词在标题中 或 清理后关键词匹配番号或标题
          if (ft.indexOf(kwFull) >= 0 || fm.indexOf(kwFullClean) >= 0 || ft.replace(/[\s_\-]+/g, "").indexOf(kwFullClean) >= 0) {
            filtered.push(fv);
          }
        }
        list = filtered;
        if (list.length > 3) list = list.slice(0, 3);
      }
    }
    
    if (!Array.isArray(list) || list.length === 0) {
      console.log("[insav_stream] 未找到匹配:", keyword);
      return [];
    }

    console.log("[insav_stream] 匹配到", list.length, "个结果");

    // 对所有匹配结果尝试获取播放地址
    var streams = [];
    for (var i = 0; i < Math.min(list.length, 3); i++) {
      var video = list[i];
      var vid = video.id;
      if (!vid) continue;

      try {
        // 获取播放地址
        var token = await getToken();
        if (!token) continue;
        
        var urlResult = await apiPost("video/getVideoUrl", {
          site: 4, device: 2,
          timestamp: new Date().getTime(),
          vid: Number(vid),
          token: token
        });

        var videoUrl = urlResult.data || "";
        if (typeof videoUrl === 'string' && videoUrl.length > 0) {
          // 流名称：[番号] 4K
          var code = video.mash || "";
          if (!code) code = extractCode(video.title || "");
          var streamName = code ? "[" + code + "] 4K" : "Insav 4K";
          
          streams.push({
            name: streamName,
            url: videoUrl,
            description: "番号：" + (code || "未知") + "\n来源：Insav 4K",
            headers: {
              "Referer": "https://4k.insav.tv/",
              "Origin": "https://4k.insav.tv",
              "User-Agent": REQUEST_HEADERS["User-Agent"]
            }
          });
        }
      } catch (e) {
        console.log("[insav_stream] 获取播放地址失败:", vid, e.message);
        continue;
      }
    }

    console.log("[insav_stream] 返回", streams.length, "个播放源");
    return streams;
  } catch (e) {
    console.error("[insav_stream] loadResource 失败:", e.message || e);
    return [];
  }
}
