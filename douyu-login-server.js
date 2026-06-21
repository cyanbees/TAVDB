#!/usr/bin/env node
/**
 * 斗鱼扫码登录代理服务器
 * 使用方式: node douyu-login-server.js
 * 然后浏览器打开 http://localhost:3000
 * 
 * 解决 CORS 问题：浏览器->本机服务器->斗鱼API
 */

var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = 3000;
var HTML_FILE = path.join(__dirname, 'douyu-login.html');

// ---- 代理请求：转发到 passport.douyu.com ----
function proxyRequest(reqBody, callback) {
  var postData = reqBody || 'client_id=1&isMultiAccount=false';

  var options = {
    hostname: 'passport.douyu.com',
    port: 443,
    path: '/scan/generateCode',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://passport.douyu.com/index/login?from=https://www.douyu.com/',
      'Accept': 'application/json, text/plain, */*',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': 'dy_did=' + generateDid() + '; acf_did=' + generateDid()
    }
  };

  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      var headers = res.headers;
      var setCookie = headers['set-cookie'] || [];
      callback(null, {
        status: res.statusCode,
        body: data,
        cookies: setCookie
      });
    });
  });

  req.on('error', function(e) {
    callback(e);
  });

  req.write(postData);
  req.end();
}

// ---- 轮询扫码状态 ----
function pollScan(code, callback) {
  var ts = new Date().getTime();
  console.log('[poll] checking code=' + code.substring(0, 8) + '... at t=' + ts);
  var options = {
    hostname: 'passport.douyu.com',
    port: 443,
    path: '/japi/scan/auth?time=' + ts + '&code=' + encodeURIComponent(code),
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://passport.douyu.com/index/login?from=https://www.douyu.com/',
      'Accept': 'application/json, text/plain, */*',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      var setCookie = res.headers['set-cookie'] || [];
      callback(null, {
        status: res.statusCode,
        body: data,
        cookies: setCookie
      });
    });
  });

  req.on('error', function(e) {
    callback(e);
  });
  req.end();
}

function generateDid() {
  var hex = '0123456789abcdef';
  var did = '';
  for (var i = 0; i < 32; i++) did += hex[Math.floor(Math.random() * 16)];
  return did;
}

// ---- 跟进认证 URL，收集重定向过程中设置的 Cookie ----
function followRedirect(urlStr) {
  return new Promise(function(resolve) {
    var cookies = [];
    try {
      var u = new URL(urlStr);
      var proto = u.protocol === 'https:' ? https : http;
      var opts = {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://passport.douyu.com/index/login?from=https://www.douyu.com/'
        }
      };
      var req = proto.request(opts, function(res) {
        var sc = res.headers['set-cookie'] || [];
        sc.forEach(function(c) {
          var val = c.split(';')[0].trim();
          if (cookies.indexOf(val) < 0) cookies.push(val);
        });
        // 收集响应数据（JSONP 回调中可能包含 auth token）
        var body = '';
        res.on('data', function(chunk) { body += chunk; });
        res.on('end', function() {
          console.log('[followRedirect] status=' + res.statusCode + ' url=' + u.href.substring(0,80));
          console.log('[followRedirect] set-cookie:', JSON.stringify(res.headers['set-cookie']));
          console.log('[followRedirect] body preview:', body.substring(0,200));
          // 尝试从 body 提取 auth 字段（JSON/JSONP/URL-encoded）
          if (body) {
            // 移除 JSONP 包装后解析 JSON
            var cleanBody = body.replace(/^[a-zA-Z_0-9]+\(/, '').replace(/\);?\s*$/, '');
            var jsonData = null;
            try { jsonData = JSON.parse(cleanBody); } catch(e) {
              try { jsonData = JSON.parse(body); } catch(e2) {}
            }
            if (jsonData && typeof jsonData === 'object') {
              var authFields = ['acf_auth', 'acf_ltkid', 'acf_uid', 'acf_nickname', 'token', 'auth', 'ltkid', 'uid'];
              for (var fi = 0; fi < authFields.length; fi++) {
                var f = authFields[fi];
                if (jsonData[f]) {
                  var cv = f + '=' + jsonData[f];
                  if (cookies.indexOf(cv) < 0) cookies.push(cv);
                }
              }
            }
          }
          // 跟随重定向
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            var redirectUrl = res.headers.location;
            if (redirectUrl.indexOf('http') !== 0) {
              redirectUrl = u.protocol + '//' + u.host + redirectUrl;
            }
            followRedirect(redirectUrl).then(function(inner) {
              inner.forEach(function(c) { if (cookies.indexOf(c) < 0) cookies.push(c); });
              resolve(cookies);
            });
          } else {
            resolve(cookies);
          }
        });
      });
      req.on('error', function() { resolve(cookies); });
      req.setTimeout(8000, function() { req.destroy(); resolve(cookies); });
      req.end();
    } catch(e) {
      resolve(cookies);
    }
  });
}

// ---- HTTP 服务器 ----
var server = http.createServer(function(req, res) {
  var parsed = url.parse(req.url, true);
  var pathname = parsed.pathname;

  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ---- API: 生成二维码 ----
  if (pathname === '/api/generate') {
    proxyRequest(null, function(err, result) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 1, msg: '代理请求失败: ' + err.message }));
        return;
      }
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(result.body);
    });
    return;
  }

  // ---- API: 轮询扫码状态 ----
  if (pathname === '/api/poll') {
    var code = parsed.query.code || '';
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 1, msg: '缺少 code 参数' }));
      return;
    }
    pollScan(code, function(err, result) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 1, msg: '轮询失败: ' + err.message }));
        return;
      }
      // 先解析响应 body
      var respBody;
      try { respBody = JSON.parse(result.body); } catch(e) { respBody = null; }

      // 提取 Set-Cookie 中的关键字段
      var cookies = [];
      if (result.cookies && result.cookies.length) {
        for (var i = 0; i < result.cookies.length; i++) {
          var val = result.cookies[i].split(';')[0].trim();
          if (cookies.indexOf(val) < 0) cookies.push(val);
        }
      }
      // 如果 Set-Cookie 没提取到，从响应 body 提取
      if (!cookies.length && respBody && respBody.data) {
        var d = respBody.data;
        var parts = [];
        if (d.acf_auth) parts.push('acf_auth=' + d.acf_auth);
        if (d.acf_ltkid) parts.push('acf_ltkid=' + d.acf_ltkid);
        if (d.acf_uid) parts.push('acf_uid=' + d.acf_uid);
        if (d.token) parts.push('acf_auth=' + d.token);
        if (d.auth) parts.push('acf_auth=' + d.auth);
        cookies = parts;
      }
      if (respBody && respBody.error === 0) {
        console.log('[poll] ✅ LOGIN SUCCESS! data.url:', respBody.data ? (respBody.data.url || '').substring(0,80) : 'none');
        // 跟进认证 URL 获取真实 cookie（acf_auth 等在该 URL 的重定向中设置）
        (function() {
          // 如果还没有 acf_auth，跟进认证 URL
          var hasAuth = cookies.some(function(c) { return c.indexOf('acf_auth=') === 0; });
          if (respBody.data && respBody.data.url && !hasAuth) {
            var authUrl = respBody.data.url;
            console.log('[poll] following auth URL to extract cookies...');
            followRedirect(authUrl).then(function(authCookies) {
              if (authCookies.length) {
                cookies = authCookies;
                console.log('[poll] extracted cookies from auth URL:', cookies);
              }
              console.log('[poll] final cookies:', cookies);
              respond();
            });
          } else {
            console.log('[poll] final cookies:', cookies);
            respond();
          }
        })();
        return;
      } else if (respBody && respBody.error === 1) {
        console.log('[poll] 📱 scanned, waiting for confirmation');
      }

      // 统一的响应发送
      function respond() {
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: respBody ? respBody.error : -1,
          msg: respBody ? respBody.msg : '',
          cookies: cookies,
          raw: result.body
        }));
      }
      respond();
    });
    return;
  }

  // ---- 静态文件: douyu-login.html ----
  fs.readFile(HTML_FILE, 'utf8', function(err, content) {
    if (err) {
      res.writeHead(404);
      res.end('douyu-login.html not found. Make sure it exists in the same directory.');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
});

server.listen(PORT, function() {
  console.log('==================================');
  console.log('  斗鱼扫码登录服务器已启动');
  console.log('  浏览器打开: http://localhost:' + PORT);
  console.log('==================================');
});
