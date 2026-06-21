// ============================================================
//  porntube - 视频列表、详情与搜索模块
//  源站: https://porntube.cool
//  API 采用 AES-256-CBC (OpenSSL Salted 格式) 加密，密码 "xxx"
// ============================================================

WidgetMetadata = {
  id: "forward.porntube",
  title: "PornTube",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "porntube.cool — 视频聚合，VIP 解锁播放",
  author: "EL",
  site: "https://porntube.cool",
  detailCacheDuration: 600,
  modules: [
    {
      id: "latestVideos",
      title: "最新",
      functionName: "loadLatestVideos",
      cacheDuration: 180,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseSearch",
      title: "搜索",
      functionName: "searchVideos",
      cacheDuration: 180,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseGeneral",
      title: "通用",
      functionName: "loadCategoryVideos",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "选择分类",
          type: "enumeration",
          value: "hot",
          enumOptions: [
            { title: "🔥 当前最热", value: "hot" },
            { title: "🆕 最近更新", value: "recent" },
            { title: "⭐ 站长推荐", value: "high" },
            { title: "💎 会员专享", value: "hd" },
            { title: "✨ 最近加精", value: "recent_hot" },
            { title: "⏱ 10分钟以上", value: "10mins" },
            { title: "⏱ 20分钟以上", value: "20mins" },
            { title: "💬 本月讨论", value: "month_discuss" },
            { title: "📌 本月收藏", value: "month_favs" },
            { title: "🏆 收藏最多", value: "favs" },
            { title: "🔥 本月最热", value: "month_hot" },
            { title: "🔥 上月最热", value: "last_month_hot" },
            { title: "🇯🇵 日本高清AV", value: "japan" },
            { title: "📊 今日热门", value: "day_hot" },
            { title: "📊 本周热门", value: "week_hot" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseStudio",
      title: "工作室",
      functionName: "loadCategoryVideos",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "选择工作室",
          type: "enumeration",
          value: "c0",
          enumOptions: [
            { title: "国产传媒", value: "c0" },
            { title: "麻豆视频", value: "c1" },
            { title: "91制片厂", value: "c2" },
            { title: "玩偶姐姐", value: "c3" },
            { title: "小鸟酱专题", value: "c4" },
            { title: "糖心Vlog", value: "c5" },
            { title: "天美传媒", value: "c6" },
            { title: "蜜桃传媒", value: "c7" },
            { title: "皇家华人", value: "c8" },
            { title: "星空传媒", value: "c9" },
            { title: "精东影业", value: "ca" },
            { title: "乐播传媒", value: "cb" },
            { title: "成人头条", value: "cc" },
            { title: "乌鸦传媒", value: "cd" },
            { title: "兔子先生", value: "ce" },
            { title: "麻豆映画", value: "cf" },
            { title: "开心鬼传媒", value: "cl" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseSpecial",
      title: "特色",
      functionName: "loadCategoryVideos",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "选择特色",
          type: "enumeration",
          value: "banana",
          enumOptions: [
            { title: "汝工作室", value: "banana" },
            { title: "台湾SWAG", value: "swag" },
            { title: "国产SM", value: "gcsm" },
            { title: "欧美重口", value: "pissvids" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
//  API 配置
// ============================================================
const API_DOMAINS = [
  "https://v2.cdn199.com",
  "https://v2.kekecdn.net",
  "https://v2.luchu.org",
  "https://v2.madou.ws",
  "https://v2.papapa.biz",
  "https://v2.tianmtv.com",
  "https://v2.xiaoshuo.info",
  "https://v2.xiaoshuo.la"
];

const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
  "Referer": "https://porntube.cool/",
  "Content-Type": "application/json"
};

// atob polyfill（某些运行时如 JavaScriptCore 无 atob）
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

// ============================================================
//  MD5 纯 JS 实现（用于 EvpKDF 密钥派生）
// ============================================================
function md5(s) {
  // 参数 s 为字符串，返回 16 字节 ArrayBuffer
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
  function wordToHex(lValue) {
    var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
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
  // Convert to bytes
  var result = new Uint8Array(16);
  var words = [a, b, c, d];
  for (var i = 0; i < 4; i++) {
    result[i*4]   = words[i] & 0xFF;
    result[i*4+1] = (words[i] >>> 8) & 0xFF;
    result[i*4+2] = (words[i] >>> 16) & 0xFF;
    result[i*4+3] = (words[i] >>> 24) & 0xFF;
  }
  return result;
}

// ============================================================
//  AES-256-CBC 解密（纯 JS）
// ============================================================
// CryptoJS 兼容的 EvpKDF（MD5 迭代密钥派生）
function evpKDF(password, salt, keySize, ivSize) {
  // 使用 MD5 迭代生成密钥材料
  var derived = new Uint8Array(0);
  var hash = null;
  var passBytes = new Uint8Array(password.split('').map(function(c) { return c.charCodeAt(0); }));
  var totalLen = keySize + ivSize;

  while (derived.length < totalLen) {
    var ctx = '';
    if (hash) {
      for (var i = 0; i < hash.length; i++) ctx += String.fromCharCode(hash[i]);
    }
    for (var i = 0; i < passBytes.length; i++) ctx += String.fromCharCode(passBytes[i]);
    for (var i = 0; i < salt.length; i++) ctx += String.fromCharCode(salt[i]);
    hash = md5(ctx);
    var newDerived = new Uint8Array(derived.length + hash.length);
    newDerived.set(derived);
    newDerived.set(hash, derived.length);
    derived = newDerived;
  }

  return {
    key: derived.slice(0, keySize),
    iv: derived.slice(keySize, keySize + ivSize)
  };
}

// AES S-box
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
  var Nk = 8; // 256-bit key
  var Nb = 4;
  var Nr = 14;
  var w = new Uint8Array(Nb * (Nr + 1) * 4);
  for (var i = 0; i < Nk; i++) {
    w[i*4] = key[i*4]; w[i*4+1] = key[i*4+1]; w[i*4+2] = key[i*4+2]; w[i*4+3] = key[i*4+3];
  }
  for (var i = Nk; i < Nb * (Nr + 1); i++) {
    var temp = new Uint8Array(4);
    temp[0] = w[(i-1)*4]; temp[1] = w[(i-1)*4+1]; temp[2] = w[(i-1)*4+2]; temp[3] = w[(i-1)*4+3];
    if (i % Nk === 0) {
      // RotWord
      var t = temp[0]; temp[0] = temp[1]; temp[1] = temp[2]; temp[2] = temp[3]; temp[3] = t;
      // SubWord
      temp[0] = Sbox[temp[0]]; temp[1] = Sbox[temp[1]]; temp[2] = Sbox[temp[2]]; temp[3] = Sbox[temp[3]];
      // XOR Rcon
      temp[0] ^= Rcon[i / Nk];
    } else if (i % Nk === 4) {
      // SubWord only
      temp[0] = Sbox[temp[0]]; temp[1] = Sbox[temp[1]]; temp[2] = Sbox[temp[2]]; temp[3] = Sbox[temp[3]];
    }
    w[i*4] = w[(i-Nk)*4] ^ temp[0];
    w[i*4+1] = w[(i-Nk)*4+1] ^ temp[1];
    w[i*4+2] = w[(i-Nk)*4+2] ^ temp[2];
    w[i*4+3] = w[(i-Nk)*4+3] ^ temp[3];
  }
  return w;
}

function addRoundKey(state, w, round) {
  var offset = round * 16;
  for (var i = 0; i < 16; i++) state[i] ^= w[offset + i];
}

function subBytes(state) {
  for (var i = 0; i < 16; i++) state[i] = Sbox[state[i]];
}

function shiftRows(state) {
  var tmp;
  // Row 1: shift left 1
  tmp = state[1]; state[1] = state[5]; state[5] = state[9]; state[9] = state[13]; state[13] = tmp;
  // Row 2: shift left 2
  tmp = state[2]; state[2] = state[10]; state[10] = tmp;
  tmp = state[6]; state[6] = state[14]; state[14] = tmp;
  // Row 3: shift left 3 (right 1)
  tmp = state[3]; state[3] = state[15]; state[15] = state[11]; state[11] = state[7]; state[7] = tmp;
}

function gfMult(a, b) {
  var result = 0;
  for (var i = 0; i < 8; i++) {
    if (b & 1) result ^= a;
    var hi = a & 0x80;
    a = (a << 1) & 0xFF;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return result;
}

function mixColumns(state) {
  for (var i = 0; i < 4; i++) {
    var col = i * 4;
    var s0 = state[col], s1 = state[col+1], s2 = state[col+2], s3 = state[col+3];
    state[col]   = gfMult(s0, 2) ^ gfMult(s1, 3) ^ gfMult(s2, 1) ^ gfMult(s3, 1);
    state[col+1] = gfMult(s0, 1) ^ gfMult(s1, 2) ^ gfMult(s2, 3) ^ gfMult(s3, 1);
    state[col+2] = gfMult(s0, 1) ^ gfMult(s1, 1) ^ gfMult(s2, 2) ^ gfMult(s3, 3);
    state[col+3] = gfMult(s0, 3) ^ gfMult(s1, 1) ^ gfMult(s2, 1) ^ gfMult(s3, 2);
  }
}

function invSubBytes(state) {
  var InvSbox = [];
  for (var i = 0; i < 256; i++) InvSbox[Sbox[i]] = i;
  for (var i = 0; i < 16; i++) state[i] = InvSbox[state[i]];
}

function invShiftRows(state) {
  var tmp;
  // Row 1: shift right 1
  tmp = state[13]; state[13] = state[9]; state[9] = state[5]; state[5] = state[1]; state[1] = tmp;
  // Row 2: shift right 2
  tmp = state[2]; state[2] = state[10]; state[10] = tmp;
  tmp = state[6]; state[6] = state[14]; state[14] = tmp;
  // Row 3: shift right 3 (left 1)
  tmp = state[7]; state[7] = state[11]; state[11] = state[15]; state[15] = state[3]; state[3] = tmp;
}

function invMixColumns(state) {
  for (var i = 0; i < 4; i++) {
    var col = i * 4;
    var s0 = state[col], s1 = state[col+1], s2 = state[col+2], s3 = state[col+3];
    state[col]   = gfMult(s0, 14) ^ gfMult(s1, 11) ^ gfMult(s2, 13) ^ gfMult(s3, 9);
    state[col+1] = gfMult(s0, 9) ^ gfMult(s1, 14) ^ gfMult(s2, 11) ^ gfMult(s3, 13);
    state[col+2] = gfMult(s0, 13) ^ gfMult(s1, 9) ^ gfMult(s2, 14) ^ gfMult(s3, 11);
    state[col+3] = gfMult(s0, 11) ^ gfMult(s1, 13) ^ gfMult(s2, 9) ^ gfMult(s3, 14);
  }
}

function aesDecryptBlock(block, w) {
  var state = new Uint8Array(block);
  var Nr = 14;
  addRoundKey(state, w, Nr);
  for (var round = Nr - 1; round > 0; round--) {
    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, w, round);
    invMixColumns(state);
  }
  invShiftRows(state);
  invSubBytes(state);
  addRoundKey(state, w, 0);
  return state;
}

function aesCbcDecrypt(ciphertext, keyBytes, iv) {
  var w = keyExpansion(keyBytes);
  var blockCount = ciphertext.length / 16;
  var plaintext = new Uint8Array(ciphertext.length);
  var prev = new Uint8Array(iv);

  for (var b = 0; b < blockCount; b++) {
    var block = ciphertext.slice(b * 16, (b + 1) * 16);
    var decrypted = aesDecryptBlock(block, w);
    for (var i = 0; i < 16; i++) {
      plaintext[b * 16 + i] = decrypted[i] ^ prev[i];
    }
    prev = block;
  }
  return plaintext;
}

// ============================================================
//  解密函数：OpenSSL Salted 格式 -> JSON
// ============================================================
const CRYPTO_KEY = "xxx";

// 纯 JS Base64 解码（替代 atob，ForwardWidget 不可用 atob）
function base64Decode(str) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var result = [];
  var padding = 0;
  // 移除空白
  str = String(str).replace(/[\r\n\s]/g, "");
  // 统计填充
  if (str.charAt(str.length - 1) === "=") padding++;
  if (str.charAt(str.length - 2) === "=") padding++;

  for (var i = 0; i < str.length; i += 4) {
    var c1 = chars.indexOf(str.charAt(i));
    var c2 = chars.indexOf(str.charAt(i + 1));
    var c3 = chars.indexOf(str.charAt(i + 2));
    var c4 = chars.indexOf(str.charAt(i + 3));
    if (c1 === -1 || c2 === -1) break;

    var triple = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
    result.push((triple >>> 16) & 255);
    if (c3 !== -1 && str.charAt(i + 2) !== "=") result.push((triple >>> 8) & 255);
    if (c4 !== -1 && str.charAt(i + 3) !== "=") result.push(triple & 255);
  }
  return new Uint8Array(result);
}

function decryptAPIResponse(encryptedBase64) {
  try {
    // Base64 解码（纯 JS，不依赖 atob）
    var buf = base64Decode(encryptedBase64);
    if (!buf || buf.length < 16) throw new Error("Base64 解码结果过短");

    // 检查 Salted__ header
    if (buf[0] !== 0x53 || buf[1] !== 0x61 || buf[2] !== 0x6c || buf[3] !== 0x74 ||
        buf[4] !== 0x65 || buf[5] !== 0x64 || buf[6] !== 0x5f || buf[7] !== 0x5f) {
      throw new Error("Not a salted OpenSSL format");
    }

    var salt = buf.slice(8, 16);
    var encrypted = buf.slice(16);

    // EvpKDF 密钥派生
    var derived = evpKDF(CRYPTO_KEY, salt, 32, 16);

    // AES-256-CBC 解密
    var plaintext = aesCbcDecrypt(encrypted, derived.key, derived.iv);

    // PKCS7 去填充
    var padLen = plaintext[plaintext.length - 1];
    if (padLen < 1 || padLen > 16) throw new Error("Invalid PKCS7 padding");

    // 移除填充
    var data = plaintext.slice(0, plaintext.length - padLen);

    // UTF-8 解码
    var result = '';
    for (var i = 0; i < data.length;) {
      var c = data[i++];
      if (c < 0x80) result += String.fromCharCode(c);
      else if (c < 0xE0) result += String.fromCharCode(((c & 0x1F) << 6) | (data[i++] & 0x3F));
      else if (c < 0xF0) result += String.fromCharCode(((c & 0x0F) << 12) | ((data[i++] & 0x3F) << 6) | (data[i++] & 0x3F));
      else { result += String.fromCharCode(((c & 0x07) << 18) | ((data[i++] & 0x3F) << 12) | ((data[i++] & 0x3F) << 6) | (data[i++] & 0x3F)); i++; }
    }
    return JSON.parse(result);
  } catch (e) {
    console.error("[porntube] 解密失败:", e.message || e);
    return null;
  }
}

// ============================================================
//  API 调用
// ============================================================
async function callAPI(path, bodyParams) {
  var lastErr = null;
  for (var di = 0; di < API_DOMAINS.length; di++) {
    var url = API_DOMAINS[di] + path;
    try {
      bodyParams = bodyParams || {};
      var body = typeof bodyParams === 'string' ? bodyParams : JSON.stringify(bodyParams);

      var response = await Widget.http.post(url, body, { headers: REQUEST_HEADERS });

      if (!response || !response.data) {
        console.error("[porntube] API 空响应:", url);
        continue;
      }

      var data = response.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) { console.error("[porntube] JSON 解析失败:", e.message); continue; }
      }

      if (data && data.r) {
        var decrypted = decryptAPIResponse(data.r);
        if (decrypted) return decrypted;
      }

      // 如果该域返回了数据但不是加密格式，直接返回
      if (data && !data.r) return data;

    } catch (e) {
      lastErr = e;
      console.error("[porntube] API 请求失败:", url, e.message || e);
      continue;
    }
  }
  if (lastErr) throw lastErr;
  throw new Error("所有 API 域均不可用");
}

// ============================================================
//  视频项解析
// ============================================================
var IMAGE_HEADERS = {
  "User-Agent": REQUEST_HEADERS["User-Agent"],
  "Referer": "https://porntube.cool/"
};

function parseVideoItem(v) {
  var coverUrl = '';
  // 注意：列表 API 返回 thumbNails，详情 API 返回 thumbnails
  var thumbs = v.thumbNails || v.thumbnails || [];
  if (thumbs.length > 0) {
    coverUrl = thumbs[0];
    if (!coverUrl.startsWith('http')) coverUrl = 'https://porntube.cool' + (coverUrl.startsWith('/') ? '' : '/') + coverUrl;
  }

  var desc = (v.user || '') + (v.views ? ' · ' + v.views + ' 次观看' : '') + (v.size ? ' · ' + v.size : '') + (v.vip ? ' [VIP]' : '');
  var title = v.title || '';

  return {
    id: v.id || v._id,
    type: "url",
    mediaType: "movie",
    title: title,
    description: desc,
    tagline: (v.views ? v.views + " 次观看" : "") + (v.size ? " · " + v.size : ""),
    coverUrl: coverUrl,
    headers: IMAGE_HEADERS,
    duration: v.duration || 0,
    durationText: v.durationStr || "",
    link: "detail:" + (v.id || v._id)
  };
}

// ============================================================
//  handleListParams — 统一处理 detail 页回传的 peopleId/genreId
//  若无相关参数则返回 null，继续正常执行
// ============================================================
function handleListParams(params) {
  if (params.peopleId || params.genreId) {
    console.log("[porntube] handleListParams:", params.peopleId ? 'peopleId=' + params.peopleId : '', params.genreId ? 'genreId=' + params.genreId : '');
    // 将 genreId/peopleId 转为关键词搜索
    var kw = params.genreId || params.peopleId || '';
    if (kw) {
      // 返回标记让调用方用关键词搜索
      return { _useKeyword: kw };
    }
  }
  return null;
}

// ============================================================
//  loadLatestVideos — 最新视频列表
// ============================================================
async function loadLatestVideos(params) {
  try {
    var hp = handleListParams(params);
    if (hp) {
      if (hp._useKeyword) return await searchVideos({ keyword: hp._useKeyword, page: params.page || 1 });
      return hp;
    }
    var page = Math.max(1, Number(params.page) || 1);
    var data = await callAPI("/sevenVideos", {});
    // API always returns page 1, append page param for pagination
    // The server may not respect page, but we try
    if (page > 1) {
      var pageData = await callAPI("/sevenVideos?page=" + page, {});
      if (pageData && Array.isArray(pageData)) data = pageData;
    }
    if (!data || !Array.isArray(data)) return [];
    return data.map(function(v) { return parseVideoItem(v); });
  } catch (error) {
    console.error("[porntube] loadLatestVideos 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
//  link 格式: "detail:{videoId}"
// ============================================================
async function loadDetail(link) {
  try {
    if (!link || !link.startsWith("detail:")) {
      // 如果是搜索关键词（非 detail: 前缀），转为搜索
      if (link && !link.startsWith("http")) {
        var results = await searchVideos({ keyword: link, page: 1 });
        return {
          id: link,
          type: "url",
          mediaType: "movie",
          title: "搜索结果",
          relatedItems: results,
          link: link
        };
      }
      return null;
    }

    var videoId = link.substring(7); // 去掉 "detail:"
    if (!videoId) return null;

    // 调用 /sevenVideos/{id} 获取详情（包含 m3u8s 播放地址）
    var data = await callAPI("/sevenVideos/" + videoId, {});

    // 如果单个视频返回的是数组，取第一个
    var video = Array.isArray(data) ? data[0] : data;
    if (!video) return null;

    // 构建详情
    var item = parseVideoItem(video);

    // 添加视频播放地址
    var videoUrl = '';
    if (video.m3u8s && video.m3u8s.length > 0) {
      videoUrl = video.m3u8s[0];
    } else if (video.m3u8) {
      videoUrl = video.m3u8;
    }

    if (videoUrl) {
      item.videoUrl = videoUrl;
      item.customHeaders = {
        "Referer": "https://porntube.cool/",
        "Origin": "https://porntube.cool",
        "User-Agent": REQUEST_HEADERS["User-Agent"]
      };
    }

    // 添加相关推荐
    try {
      var related = await callAPI("/relatedSevenVideos?v=" + (video.id || videoId), {});
      if (related && Array.isArray(related) && related.length > 0) {
        item.relatedItems = related
          .filter(function(v) { return (v.id || v._id) !== (video.id || videoId); })
          .map(function(v) { return parseVideoItem(v); });
      }
    } catch (e) {
      // 相关推荐可选，失败不阻塞
    }

    return item;
  } catch (error) {
    console.error("[porntube] loadDetail 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索视频
// ============================================================
async function searchVideos(params) {
  try {
    var hp = handleListParams(params);
    if (hp) {
      if (hp._useKeyword) params.keyword = hp._useKeyword;
      else return hp;
    }
    var keyword = (params.keyword || "").trim();
    if (!keyword) return [];

    var page = Math.max(1, Number(params.page) || 1);

    // 尝试调用 searchSevenVideos 接口
    try {
      var data = await callAPI("/searchSevenVideos", 'q=' + encodeURIComponent(keyword) + '&page=' + page);
      if (data && Array.isArray(data) && data.length > 0) {
        return data.map(function(v) { return parseVideoItem(v); });
      }
    } catch (e) {
      console.error("[porntube] searchSevenVideos 不可用，回退到列表过滤:", e.message);
    }

    // 回退：获取最新列表并按关键词过滤
    var listData = await callAPI("/sevenVideos", {});
    if (!listData || !Array.isArray(listData)) return [];

    var kw = keyword.toLowerCase();
    var filtered = listData.filter(function(v) {
      return (v.title && v.title.toLowerCase().indexOf(kw) !== -1) ||
             (v.title_en && v.title_en.toLowerCase().indexOf(kw) !== -1) ||
             (v.keywords_gem && v.keywords_gem.toLowerCase().indexOf(kw) !== -1) ||
             (v.user && v.user.toLowerCase().indexOf(kw) !== -1);
    });

    return filtered.map(function(v) { return parseVideoItem(v); });
  } catch (error) {
    console.error("[porntube] searchVideos 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadCategoryVideos — 按分类浏览视频
//  type 参数服务端过滤（hot/recent/high/hd/c0~c9 等）
// ============================================================
async function loadCategoryVideos(params) {
  try {
    var hp = handleListParams(params);
    if (hp) {
      if (hp._useKeyword) return await searchVideos({ keyword: hp._useKeyword, page: params.page || 1 });
      return hp;
    }
    var cat = (params.cat || "hot").trim();
    if (!cat) return [];
    var page = Math.max(1, Number(params.page) || 1);

    var data = await callAPI("/sevenVideos?page=" + page + "&type=" + encodeURIComponent(cat), {});
    if (!data || !Array.isArray(data)) return [];

    return data.map(function(v) { return parseVideoItem(v); });
  } catch (error) {
    console.error("[porntube] loadCategoryVideos 失败:", error.message || error);
    throw error;
  }
}
