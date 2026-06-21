WidgetMetadata = {
    id: "forward.koreanpornmovie",
    title: "韩国三级电影",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "KoreanPornMovie.com — 韩国成人电影在线观看，提供韩国三级片、韩国色情电影资源。",
    author: "GM",
    site: "https://koreanpornmovie.com",
    detailCacheDuration: 3600,
    modules: [
        // ========== 全站搜索 ==========
        {
            id: "searchKeyword",
            title: "搜索",
            functionName: "getSearchResults",
            cacheDuration: 180,
            params: [
                {
                    name: "search_query",
                    title: "搜索关键词",
                    type: "input",
                    description: "请输入要搜索的关键词",
                    value: "korean"
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    
                }
            ]
        },
        // ========== 最新视频 ==========
        {
            id: "latestVideos",
            title: "最新",
            functionName: "getLatestVideos",
            cacheDuration: 300,
            params: [
                {
                    name: "filter",
                    title: "排序",
                    type: "enumeration",
                    description: "排序方式",
                    value: "latest",
                    enumOptions: [
                        { title: "最新发布", value: "latest" },
                        { title: "最长影片", value: "longest" },
                        { title: "随机", value: "random" }
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    
                }
            ]
        },
        // ========== 韩国电影（主分类）==========
        {
            id: "categoryKorean",
            title: "韩国电影",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    
                }
            ]
        },
        // ========== 分类浏览 ==========
        {
            id: "categoryBrowse",
            title: "分类",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "分类",
                    type: "enumeration",
                    description: "视频分类",
                    value: "amateur",
                    enumOptions: [
                        { title: "素人", value: "amateur" },
                        { title: "宝贝", value: "babe" },
                        { title: "大屁股", value: "big-ass" },
                        { title: "大奶子", value: "big-tits" },
                        { title: "口交", value: "blowjob" },
                        { title: "黑发", value: "brunette" },
                        { title: "名人", value: "celebrity" },
                        { title: "内射", value: "creampie" },
                        { title: "射精", value: "cumshot" },
                        { title: "色情", value: "erotic" },
                        { title: "恋物癖", value: "fetish" },
                        { title: "重口味", value: "hardcore" },
                        { title: "自拍", value: "homemade" },
                        { title: "内衣", value: "lingerie" },
                        { title: "自慰", value: "masturbation" },
                        { title: "人妻", value: "milf" },
                        { title: "POV", value: "pov" },
                        { title: "真实", value: "reality" },
                        { title: "浪漫", value: "romantic" },
                        { title: "小奶子", value: "small-tits" },
                        { title: "单人女", value: "solo-female" },
                        { title: "少女", value: "teen" },
                        { title: "3P", value: "threesome" },
                        { title: "摄像头", value: "webcam" }
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                    description: "页码",
                    
                }
            ]
        }
    ],
    search: {
        title: "搜索",
        functionName: "getSearchResults",
        params: [
            { name: "keyword", title: "搜索关键词", type: "input", value: "korean" },
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

// 全局搜索导航回退模块 + 分类/演员导航模块
WidgetMetadata.modules.push({
    id: "searchGlobal", title: "搜索",
    functionName: "getSearchResults", cacheDuration: 180,
    params: [
        { name: "search_query", title: "搜索关键词", type: "input", value: "korean" },
        { name: "page", title: "页码", type: "page" }
    ]
});
WidgetMetadata.modules.push({
    id: "tagVideos", title: "标签",
    functionName: "getTagVideos", cacheDuration: 600,
    params: [ { name: "page", title: "页码", type: "page" } ]
});
WidgetMetadata.modules.push({
    id: "actorVideos", title: "演员",
    functionName: "getActorVideos", cacheDuration: 600,
    params: [ { name: "page", title: "页码", type: "page" } ]
});

const BASE_URL = "https://koreanpornmovie.com";
const CDN_BASE = "https://koreanporn.stream";

const REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5"
};
const IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": "https://koreanpornmovie.com/"
};

// ============================================================
//  辅助函数
// ============================================================

function stripHtmlText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
}

function safeText(text, fallback) {
    const value = stripHtmlText(text);
    return value || fallback || "";
}

function normalizeImageUrl(src) {
    if (!src) return "";
    src = src.trim();
    if (!src) return "";
    if (src.startsWith("//")) src = "https:" + src;
    // 去掉 WordPress 缩放后缀，取原图
    src = src.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp))/i, "");
    return src;
}

function normalizeWatchUrl(href) {
    if (!href) return "";
    href = href.trim();
    if (!href) return "";
    if (href.startsWith("/")) href = BASE_URL + href;
    if (!/^https?:\/\//.test(href)) return "";
    // 去掉尾部斜杠和分页参数
    href = href.replace(/\/+$/, "").replace(/\?.*$/, "");
    return href;
}

// ============================================================
//  fetchPage — 获取页面 HTML
// ============================================================
async function fetchPage(url, headers) {
    const response = await Widget.http.get(url, { headers: headers || REQUEST_HEADERS });
    if (!response || !response.data) {
        throw new Error("页面加载失败");
    }
    return response.data;
}

// ============================================================
//  parseVideoList — 解析视频列表（WordPress retrotube 主题）
//  选择器：article.loop-video.thumb-block
// ============================================================
function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set();

    $("article.loop-video.thumb-block").each(function () {
        const $el = $(this);

        const postId = $el.attr("data-post-id") || "";
        const $link = $el.find("a").first();
        const link = normalizeWatchUrl($link.attr("href") || "");
        if (!link || seen.has(link)) return;
        seen.add(link);

        // 标题
        const title = safeText($el.find(".entry-header span").first().text())
            || safeText($link.attr("title") || "");

        // 封面图
        let coverUrl = $el.attr("data-main-thumb") || "";
        if (!coverUrl) {
            const $img = $el.find("img.video-main-thumb").first();
            coverUrl = $img.attr("src") || "";
        }
        coverUrl = normalizeImageUrl(coverUrl);

        // 时长（格式：01:05:42）
        let durationText = "";
        const $dur = $el.find(".duration").first();
        if ($dur.length) {
            durationText = $dur.text().replace(/<[^>]+>/g, "").trim();
            // 去掉可能的前导图标文本
            durationText = durationText.replace(/^[^\d:]*/, "").trim();
        }

        // 预告片 URL
        const trailerUrl = $el.attr("data-trailer") || undefined;

        items.push({
            id: postId || link,
            type: "url",
            mediaType: "movie",
            title: title || "未命名视频",
            coverUrl: coverUrl,
            previewUrl: trailerUrl,
            durationText: durationText,
            link: link,
            headers: IMAGE_HEADERS
        });
    });

    return items;
}

// ============================================================
//  loadDetail — 获取视频播放地址和元数据
//  Forward 约定：列表项 type="url" 时自动调用
//  MP4 来源：meta[itemprop="contentURL"]
// ============================================================
async function loadDetail(link) {
    if (!link) throw new Error("无效的视频链接");

    const html = await fetchPage(link);

    // 提取视频 URL（主要来源）
    const $ = Widget.html.load(html);

    // 方法1：meta[itemprop="contentURL"]
    let videoUrl = $('meta[itemprop="contentURL"]').attr("content") || "";

    // 方法2：从 iframe 的 q 参数 base64 解码提取（兜底）
    if (!videoUrl) {
        const iframeMatch = html.match(/player-x\.php\?q=([^"&\s]+)/);
        if (iframeMatch) {
            try {
                const decoded = atob(iframeMatch[1]);
                const srcMatch = decodeURIComponent(decoded).match(/<source\s+src="([^"]+)"/);
                if (srcMatch) videoUrl = srcMatch[1];
            } catch (e) {
                // base64 解码失败，忽略
            }
        }
    }

    if (!videoUrl) {
        throw new Error("无法获取视频播放链接");
    }

    // 确保 videoUrl 是完整 URL
    if (videoUrl.startsWith("/")) {
        videoUrl = CDN_BASE + videoUrl;
    }

    // 提取元数据（try-catch 保护）
    let meta = {};
    try {
        meta = extractMetadataFromDetail(html);
    } catch (e) {
        // 元数据提取失败不影响播放
    }

    // 提取相关视频
    let relatedItems;
    try {
        relatedItems = extractRelatedFromDetail(html, link);
    } catch (e) {
        // 相关视频提取失败不影响播放
    }

    return {
        id: meta.postId || link,
        type: "url",
        mediaType: "movie",
        videoUrl: videoUrl,
        headers: IMAGE_HEADERS,
        customHeaders: {
            "Referer": link,
            "User-Agent": REQUEST_HEADERS["User-Agent"]
        },
        title: meta.title,
        description: meta.description,
        genreItems: meta.genreItems,
        peoples: meta.peoples,
        releaseDate: meta.releaseDate,
        coverUrl: meta.posterPath,
        posterPath: meta.posterPath,
        backdropPath: meta.backdropPath,
        duration: meta.duration,
        durationText: meta.durationText,
        relatedItems: relatedItems,
        trailers: meta.previewUrl ? [{ coverUrl: meta.posterPath, url: meta.previewUrl }] : undefined,
        link: link
    };
}

// ============================================================
//  extractMetadataFromDetail — 从详情页提取元数据
//  主要来源：Schema.org meta[itemprop] + DOM 元素
// ============================================================
function extractMetadataFromDetail(html) {
    const $ = Widget.html.load(html);

    // 标题
    const title = safeText(
        $('meta[itemprop="name"]').attr("content") ||
        $("h1.entry-title").first().text()
    );

    // 描述
    const description = safeText(
        $('meta[itemprop="description"]').attr("content") ||
        $(".video-description .desc").first().text()
    );

    // 时长（ISO 8601: P0DT1H5M42S → 秒数+文本）
    let duration = 0;
    let durationText = "";
    const durIso = $('meta[itemprop="duration"]').attr("content") || "";
    if (durIso) {
        const parsed = parseISODuration(durIso);
        duration = parsed.seconds;
        durationText = parsed.text;
    }

    // 封面图
    const posterPath = normalizeImageUrl(
        $('meta[itemprop="thumbnailUrl"]').attr("content") || ""
    ) || undefined;

    // 背景图（用 og:image 或 thumbnail 的大图）
    let backdropPath = normalizeImageUrl(
        $('meta[property="og:image"]').attr("content") || ""
    );
    if (!backdropPath) backdropPath = posterPath;
    backdropPath = backdropPath || undefined;

    // 发布日期
    let releaseDate = "";
    const uploadDate = $('meta[itemprop="uploadDate"]').attr("content") || "";
    if (uploadDate) {
        const dateMatch = uploadDate.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) releaseDate = dateMatch[1];
    }
    if (!releaseDate) {
        const $date = $("#video-date").first();
        if ($date.length) {
            const dateText = $date.text().trim();
            const match = dateText.match(/(\d{4}-\d{2}-\d{2})/);
            if (match) releaseDate = match[1];
        }
    }

    // 分类和标签（合并为 genreItems）
    const genreItems = [];
    $('.tags-list a[href*="/category/"]').each(function () {
        const name = safeText($(this).text());
        const href = $(this).attr("href") || "";
        const slug = href.split("/category/")[1] || "";
        const id = slug.replace(/\/+$/, "");
        if (name && id) genreItems.push({ id: id, title: name });
    });
    $('.tags-list a[href*="/tag/"]').each(function () {
        const name = safeText($(this).text());
        const href = $(this).attr("href") || "";
        const slug = href.split("/tag/")[1] || "";
        const id = slug.replace(/\/+$/, "");
        if (name && id) genreItems.push({ id: id, title: name });
    });

    // 演员（peoples）
    const peoples = [];
    let team;
    $("#video-actors a").each(function () {
        const $a = $(this);
        const name = safeText($a.text());
        const href = $a.attr("href") || "";
        const slug = href.split("/actor/")[1] || "";
        const peopleId = "actor:" + slug.replace(/\/+$/, "");
        if (name && slug) {
            peoples.push({ id: peopleId, title: name });
            if (!team) team = { id: peopleId, title: name };
        }
    });

    // 作者（如无演员则用 meta author）
    if (peoples.length === 0) {
        const author = safeText($('meta[itemprop="author"]').attr("content") || "");
        if (author) {
            team = { id: "author:" + author, title: author };
        }
    }

    // 预告片 URL
    let previewUrl;
    const trailerMatch = html.match(/"trailer"\s*:\s*"([^"]+)"/);
    if (trailerMatch) {
        previewUrl = trailerMatch[1];
    }

    // Post ID
    let postId = "";
    const article = $("article[id^='post-']").first();
    if (article.length) {
        const idAttr = article.attr("id") || "";
        postId = idAttr.replace("post-", "");
    }

    return {
        postId: postId,
        title: title || "视频播放",
        description: description || undefined,
        genreItems: genreItems.length > 0 ? genreItems : undefined,
        team: team || undefined,
        peoples: peoples.length > 0 ? peoples : undefined,
        releaseDate: releaseDate || undefined,
        posterPath: posterPath,
        backdropPath: backdropPath,
        duration: duration || undefined,
        durationText: durationText || undefined,
        previewUrl: previewUrl
    };
}

// ============================================================
//  parseISODuration — ISO 8601 时长 → 秒数 + HH:MM:SS
//  例如 "P0DT1H5M42S" → { seconds: 3942, text: "1:05:42" }
// ============================================================
function parseISODuration(iso) {
    const match = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return { seconds: 0, text: "" };

    const days = parseInt(match[1] || "0");
    const hours = parseInt(match[2] || "0");
    const minutes = parseInt(match[3] || "0");
    const seconds = parseInt(match[4] || "0");

    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;

    // 生成 HH:MM:SS 或 MM:SS
    let text;
    if (hours > 0 || days > 0) {
        const h = days * 24 + hours;
        text = h + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    } else {
        text = minutes + ":" + String(seconds).padStart(2, "0");
    }

    return { seconds: totalSeconds, text: text };
}

// ============================================================
//  extractRelatedFromDetail — 提取相关推荐视频
//  选择器：.under-video-block article.loop-video
// ============================================================
function extractRelatedFromDetail(html, currentLink) {
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set([currentLink]);

    $(".under-video-block article.loop-video.thumb-block").each(function () {
        if (items.length >= 12) return false;

        const $el = $(this);
        const $link = $el.find("a").first();
        const link = normalizeWatchUrl($link.attr("href") || "");
        if (!link || seen.has(link)) return;
        seen.add(link);

        const title = safeText($el.find(".entry-header span").first().text())
            || safeText($link.attr("title") || "");
        if (!title) return;

        let coverUrl = $el.attr("data-main-thumb") || "";
        if (!coverUrl) {
            const $img = $el.find("img").first();
            coverUrl = $img.attr("src") || "";
        }
        coverUrl = normalizeImageUrl(coverUrl);

        let durationText = "";
        const $dur = $el.find(".duration").first();
        if ($dur.length) {
            durationText = $dur.text().replace(/<[^>]+>/g, "").trim();
            durationText = durationText.replace(/^[^\d:]*/, "").trim();
        }

        items.push({
            id: link,
            type: "url",
            mediaType: "movie",
            title: title,
            coverUrl: coverUrl,
            durationText: durationText,
            link: link,
            headers: IMAGE_HEADERS
        });
    });

    return items.length > 0 ? items : undefined;
}

// ============================================================
//  getLatestVideos — 最新视频
//  URL: /?filter=latest 或 /?filter=longest 或 /?filter=random
// ============================================================
async function getLatestVideos(params) {
    if (params.genreId) return getTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return getActorVideos(params);
    const filter = (params.filter || "latest").trim();
    const page = Math.max(1, Number(params.page) || 1);

    let url = BASE_URL;
    const sep = filter !== "latest" ? "?filter=" + filter : "";
    if (page > 1) {
        url += "/page/" + page + "/";
        if (sep) url += sep;
    } else if (sep) {
        url += sep;
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getSearchResults — 搜索
//  URL: /?s={query}
// ============================================================
async function getSearchResults(params) {
    if (params.genreId) return getTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return getActorVideos(params);
    const query = encodeURIComponent((params.search_query || params.keyword || "").trim());
    if (!query) return [];

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL + "/?s=" + query;
    if (page > 1) {
        url += "&paged=" + page;
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getCategoryVideos — 分类浏览
//  URL: /category/{category}/  (默认 korean)
// ============================================================
async function getCategoryVideos(params) {
    if (params.genreId) return getTagVideos({ ...params, tag: params.genreId });
    if (params.peopleId) return getActorVideos(params);
    const category = (params.category || "korean").trim();
    const page = Math.max(1, Number(params.page) || 1);

    let url = BASE_URL + "/category/" + category + "/";
    if (page > 1) {
        url += "page/" + page + "/";
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getTagVideos — 标签浏览（通过 genreItems 回传调用）
//  URL: /tag/{tag}/
// ============================================================
async function getTagVideos(params) {
    const tagId = (params.genreId || params.tag || "").trim();
    if (!tagId) throw new Error("缺少标签 ID");

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL + "/tag/" + tagId + "/";
    if (page > 1) {
        url += "page/" + page + "/";
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  getActorVideos — 演员作品（通过 peoples 回传调用）
//  URL: /actor/{slug}/
// ============================================================
async function getActorVideos(params) {
    let actorId = (params.peopleId || "").trim();
    if (!actorId) throw new Error("缺少演员 ID");

    // 去掉 "actor:" 前缀
    if (actorId.startsWith("actor:")) {
        actorId = actorId.substring(6);
    }

    const page = Math.max(1, Number(params.page) || 1);
    let url = BASE_URL + "/actor/" + actorId + "/";
    if (page > 1) {
        url += "page/" + page + "/";
    }

    const html = await fetchPage(url);
    return parseVideoList(html);
}
