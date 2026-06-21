WidgetMetadata = {
    id: "gm.kanav",
    title: "KanAV",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "KanAV — 免费高清中文AV在线看",
    author: "GM",
    site: "https://kanav.ad",
    detailCacheDuration: 0,
    modules: [
        {
            id: "cat1", title: "中文字幕", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "1" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat2", title: "日韩有码", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "2" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat3", title: "日韩无码", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "3" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat4", title: "国产AV", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                { name: "typeId", title: "typeId", type: "constant", value: "4" },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat22", title: "流出自拍", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                {
                    name: "typeId", title: "子分类", type: "enumeration", value: "22",
                    enumOptions: [
                        { title: "全部", value: "22" },
                        { title: "自拍泄密", value: "30" },
                        { title: "探花约炮", value: "31" },
                        { title: "主播录制", value: "32" }
                    ]
                },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "cat20", title: "动漫番剧", functionName: "getCategoryVideos", cacheDuration: 600,
            params: [
                {
                    name: "typeId", title: "子分类", type: "enumeration", value: "20",
                    enumOptions: [
                        { title: "全部", value: "20" },
                        { title: "里番", value: "25" },
                        { title: "泡面番", value: "26" },
                        { title: "Motion Anime", value: "27" },
                        { title: "3D动画", value: "28" },
                        { title: "同人作品", value: "29" }
                    ]
                },
                {
                    name: "sort", title: "排序", type: "enumeration", value: "time_add",
                    enumOptions: [
                        { title: "最新发布", value: "time_add" },
                        { title: "最多观看", value: "hits" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ],
    search: {
        title: "搜索",
        functionName: "getSearchResults",
        params: [
            { name: "keyword", title: "搜索关键词", type: "input", value: "SSNI" },
            {
                name: "sort", title: "排序", type: "enumeration", value: "time_add",
                enumOptions: [
                    { title: "最新发布", value: "time_add" },
                    { title: "最多观看", value: "hits" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

// 全局搜索专用模块（与 search 共用 functionName），
// 确保从详情页点演员/分类能导航回来传参
// 详见 project skill: search-global-nav-fix
WidgetMetadata.modules.push({
    id: "searchGlobal",
    title: "搜索",
    functionName: "getSearchResults",
    cacheDuration: 180,
    params: [
        { name: "keyword", title: "搜索关键词", type: "input", value: "SSNI" },
        {
            name: "sort", title: "排序", type: "enumeration", value: "time_add",
            enumOptions: [
                { title: "最新发布", value: "time_add" },
                { title: "最多观看", value: "hits" }
            ]
        },
        { name: "page", title: "页码", type: "page" }
    ]
});

var BASE_URL = "https://kanav.ad";

var REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5"
};
var IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": "https://kanav.ad/"
};

function safeText(text) { return (text || "").replace(/\s+/g, " ").trim(); }
function normalizeImageUrl(src) { if (!src) return ""; src = src.trim(); if (src.startsWith("//")) src = "https:" + src; return src; }

async function fetchPage(url) {
    var resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
    if (!resp || !resp.data) throw new Error("页面加载失败");
    return resp.data;
}

function parseVideoList(html) {
    var $ = Widget.html.load(html), items = [], seen = {};
    $(".video-item").each(function () {
        var $el = $(this), $link = $el.find("a[href*='/vod/play/']").first();
        if (!$link.length) return;
        var href = $link.attr("href") || "";
        if (!href) return;
        if (href.startsWith("/")) href = BASE_URL + href;
        if (seen[href]) return;
        seen[href] = true;
        var $img = $el.find("img").first();
        var coverUrl = normalizeImageUrl($img.attr("data-original") || $img.attr("src") || "");
        var title = safeText($img.attr("alt") || "");
        if (!title) { var t = $el.find(".entry-title a").first(); title = safeText(t.attr("title") || t.text()); }
        var $dur = $el.find(".model-view").first(), durText = $dur.length ? safeText($dur.text()) : "";
        var idMatch = href.match(/\/id\/(\d+)\//), id = idMatch ? idMatch[1] : href;
        items.push({ id: id, type: "url", mediaType: "movie", title: title || "Untitled", coverUrl: coverUrl, durationText: durText, link: href, headers: IMAGE_HEADERS });
    });
    return items;
}

async function getSearchResults(params) {
    var query = (params.peopleId ? params.peopleId.replace(/^actor:/, "").trim() : "") || (params.genreId || params.keyword || params.search_query || "").trim();
    if (!query) return [];
    var sort = params.sort || "time_add";
    var page = Math.max(1, Number(params.page) || 1);
    var url = BASE_URL + "/index.php/vod/search.html?wd=" + encodeURIComponent(query) + "&by=" + sort;
    if (page > 1) url += "&page=" + page;
    return parseVideoList(await fetchPage(url));
}
async function getCategoryVideos(params) {
    var page = Math.max(1, Number(params.page) || 1);
    var sort = params.sort || "time_add";

    // 从详情页点演员进来 → 走搜索
    var peopleQuery = params.peopleId || "";
    if (peopleQuery) {
        peopleQuery = peopleQuery.replace(/^actor:/, "").trim();
        if (peopleQuery) {
            var url = BASE_URL + "/index.php/vod/search.html?wd=" + encodeURIComponent(peopleQuery) + "&by=" + sort;
            if (page > 1) url += "&page=" + page;
            return parseVideoList(await fetchPage(url));
        }
    }

    var typeId = params.genreId || params.typeId || "1";
    var url;
    if (sort === "hits") {
        url = BASE_URL + "/index.php/vod/show/by/hits/id/" + typeId + ".html";
    } else {
        url = BASE_URL + "/index.php/vod/type/id/" + typeId + ".html";
    }
    if (page > 1) url += "?page=" + page;
    return parseVideoList(await fetchPage(url));
}
// ========== base64 解码（兼容无 atob 环境） ==========
function _atob(str) {
    if (typeof atob === "function") return atob(str);
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    for (var i = 0; i < str.length; i += 4) {
        var enc1 = chars.indexOf(str.charAt(i));
        var enc2 = chars.indexOf(str.charAt(i + 1));
        var enc3 = chars.indexOf(str.charAt(i + 2));
        var enc4 = chars.indexOf(str.charAt(i + 3));
        var chr1 = (enc1 << 2) | (enc2 >> 4);
        var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        var chr3 = ((enc3 & 3) << 6) | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 !== 64) output += String.fromCharCode(chr2);
        if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
}

// ========== loadDetail - 核心逻辑 ==========
async function loadDetail(link) {
    if (!link) return null;

    // 抓详情页 HTML
    var html = await fetchPage(link);

    // 检查 Cloudflare 拦截
    if (html.indexOf("cf_chl_opt") >= 0 || html.indexOf("Just a moment") >= 0) {
        console.log("[KanAV] loadDetail: Cloudflare blocked");
        return null;
    }

    // 找 player_aaaa JSON
    var idx = html.indexOf("var player_aaaa");
    if (idx < 0) {
        console.log("[KanAV] loadDetail: player_aaaa not found, html length=" + html.length);
        return null;
    }

    var jsonStart = html.indexOf("{", idx);
    var depth = 0, jsonEnd = -1;
    for (var i = jsonStart; i < html.length; i++) {
        if (html[i] === "{") depth++;
        else if (html[i] === "}") { depth--; if (depth === 0) { jsonEnd = i + 1; break; } }
    }
    if (jsonEnd < 0) {
        console.log("[KanAV] loadDetail: failed to extract JSON");
        return null;
    }

    var config;
    try {
        config = JSON.parse(html.substring(jsonStart, jsonEnd));
    } catch (e) {
        console.log("[KanAV] loadDetail: JSON parse error: " + e.message);
        return null;
    }

    var encrypted = config.url || "";
    if (!encrypted) {
        console.log("[KanAV] loadDetail: no encrypted URL");
        return null;
    }

    // 解密 encrypt=2: base64 + URLEncode
    var decoded, videoUrl;
    try {
        decoded = _atob(encrypted);
    } catch (e) {
        console.log("[KanAV] loadDetail: base64 error: " + e.message);
        return null;
    }
    try {
        videoUrl = decodeURIComponent(decoded);
    } catch (e) {
        console.log("[KanAV] loadDetail: URI decode error: " + e.message);
        videoUrl = decoded;
    }
    if (!videoUrl || videoUrl.length < 10) {
        console.log("[KanAV] loadDetail: invalid videoUrl: " + videoUrl);
        return null;
    }

    // ====== 提取元数据 ======
    var $ = Widget.html.load(html), title = "";
    var $h1 = $("h1").first();
    if ($h1.length) title = safeText($h1.text());

    // 封面图
    var posterPath = "";
    var $cover = $("img.countext-img").first();
    if ($cover.length) posterPath = normalizeImageUrl($cover.attr("src") || "");

    // 上映日期 — 从 .video-countext-categories 中 "上映日期：YYYY-MM-DD" 提取
    var releaseDate = "";
    $(".video-countext-categories a").each(function () {
        var text = safeText($(this).text());
        var m = text.match(/(\d{4}-\d{2}-\d{2})/);
        if (m) releaseDate = m[1];
    });

    // 分类/标签（genreItems） — 优先取 .video-countext-categories 的分类（数字ID可导航），
    // 兜底取 .hr-tags 区域的标签名（搜索关键词）
    var genreItems = [];
    var hasNumericId = false;
    // 优先从 .video-countext-categories 提取数字分类ID
    $(".video-countext-categories a[href*='/vod/type/id/']").each(function () {
        var $a = $(this);
        var name = safeText($a.text());
        var href = $a.attr("href") || "";
        var m = href.match(/\/id\/(\d+)/);
        var id = m ? m[1] : "";
        if (name && id) {
            genreItems.push({ id: id, title: name });
            hasNumericId = true;
        }
    });
    // 如果没有数字分类ID，才从 .hr-tags 取标签名
    if (!hasNumericId) {
        $(".video-countext-tags").each(function () {
            var $container = $(this);
            var isTags = false;
            $container.children("div.hr-style").each(function () {
                var cls = $(this).attr("class") || "";
                if (cls.indexOf("hr-tags") >= 0) isTags = true;
            });
            if (isTags) {
                $container.find("a[href*='/vod/search.html?wd=']").each(function () {
                    var $a = $(this);
                    var name = safeText($a.text());
                    if (name) genreItems.push({ id: name, title: name });
                });
            }
        });
    }

    // 演员（peoples） — .video-countext-tags 中含有 .hr-actor 的容器内链接
    var peoples = [];
    $(".video-countext-tags").each(function () {
        var $container = $(this);
        var isActor = false;
        $container.children("div.hr-style").each(function () {
            var cls = $(this).attr("class") || "";
            if (cls.indexOf("hr-actor") >= 0) isActor = true;
        });
        if (isActor) {
            $container.find("a[href*='/vod/search.html?wd=']").each(function () {
                var $a = $(this);
                var name = safeText($a.text());
                if (name) peoples.push({ id: "actor:" + name, title: name });
            });
        }
    });

    // 相似作品（relatedItems） — "猜你喜欢" 区域的 .video-item
    var relatedItems = [];
    try {
        var $postList = $(".post-list").first();
        if ($postList.length) {
            relatedItems = parseVideoList($.html($postList));
        }
    } catch (e) {
        console.log("[KanAV] loadDetail: relatedItems error: " + e.message);
    }

    return {
        id: config.id || link,
        type: "url",
        mediaType: "movie",
        videoUrl: videoUrl,
        title: title || "视频播放",
        coverUrl: posterPath,
        backdropPath: posterPath,
        posterPath: posterPath,
        releaseDate: releaseDate,
        genreItems: genreItems.length > 0 ? genreItems : undefined,
        peoples: peoples.length > 0 ? peoples : undefined,
        relatedItems: relatedItems.length > 0 ? relatedItems : undefined,
        headers: IMAGE_HEADERS,
        customHeaders: { "Referer": "https://kanav.ad/", "User-Agent": REQUEST_HEADERS["User-Agent"] },
        link: link
    };
}
