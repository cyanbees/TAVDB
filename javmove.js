WidgetMetadata = {
    id: "gm.javmove",
    title: "JAVMove",
    version: "1.0.1",
    requiredVersion: "0.0.1",
    description: "JAVMove.com — 日本成人影片在线观看，提供最新AV影片资源。",
    author: "GM",
    site: "https://javmove.com",
    detailCacheDuration: 1800,
    modules: [
        // ========== 首页推荐 ==========
        {
            id: "home",
            title: "首页推荐",
            functionName: "getHomeVideos",
            cacheDuration: 300,
            params: [
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 最新发布 ==========
        {
            id: "newRelease",
            title: "最新发布",
            functionName: "getNewReleaseVideos",
            cacheDuration: 300,
            params: [
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 分类浏览 ==========
        {
            id: "genres",
            title: "类型浏览",
            functionName: "getGenreVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "genre",
                    title: "影片类型",
                    type: "enumeration",
                    description: "选择影片类型",
                    value: "creampie",
                    enumOptions: [
                        { title: "内射 (Creampie)", value: "creampie" },
                        { title: "大奶 (Big Tits)", value: "big-tits" },
                        { title: "OL", value: "ol" },
                        { title: "口交 (Blow)", value: "blow" },
                        { title: "人妻 (Married Woman)", value: "married-woman" },
                        { title: "女教师 (Female Teacher)", value: "female-teacher" },
                        { title: "3P/4P", value: "3p-4p" },
                        { title: "乱伦 (Incest)", value: "incest" },
                        { title: "强奸 (Rape)", value: "rape" },
                        { title: "制服 (School Girls)", value: "school-girls" },
                        { title: "自慰 (Masturbation)", value: "masturbation" },
                        { title: "黑人 (Black)", value: "black" },
                        { title: "熟女 (Mature Woman)", value: "mature-woman" },
                        { title: "颜射 (Facials)", value: "facials" },
                        { title: "潮吹 (Squirting)", value: "squirting" },
                        { title: "POV", value: "pov" },
                        { title: "丝袜 (Pantyhose)", value: "pantyhose" },
                        { title: "姐姐 (Older Sister)", value: "older-sister" },
                        { title: "美少女 (Beautiful Girl)", value: "beautiful-girl" },
                        { title: "出轨 (Cuckold)", value: "cuckold" },
                        { title: "首次亮相 (Debut)", value: "debut-production" },
                        { title: "单人女 (Solowork)", value: "solowork" },
                        { title: "束缚 (Restraint)", value: "restraint" },
                        { title: "女大学生 (College Student)", value: "female-college-student" }
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
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

// 全局搜索导航回退模块（与 search 共用 functionName）
WidgetMetadata.modules.push({
    id: "searchGlobal",
    title: "搜索",
    functionName: "getSearchResults",
    cacheDuration: 180,
    params: [
        { name: "keyword", title: "搜索关键词", type: "input", value: "SSNI" },
        { name: "page", title: "页码", type: "page" }
    ]
});

const BASE_URL = "https://javmove.com";
const REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
};
const IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": "https://javmove.com/"
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
    return src;
}

// ============================================================
//  fetchPage — 获取页面 HTML
// ============================================================
async function fetchPage(url, extraHeaders) {
    const headers = Object.assign({}, REQUEST_HEADERS, extraHeaders || {});
    const response = await Widget.http.get(url, { headers: headers });
    if (!response || !response.data) {
        throw new Error("页面加载失败: " + url);
    }
    return response.data;
}

// ============================================================
//  parseVideoList — 解析视频列表
//  文章块: <article class="...bg-gray-700...">
// ============================================================
function parseVideoList(html) {
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set();

    // 匹配所有视频卡片文章
    $("article.bg-gray-700, article[class*='bg-gray-700']").each(function () {
        const $el = $(this);

        // 提取链接
        const $link = $el.find("a[href*='/movie/']").first();
        if (!$link.length) return;
        let href = $link.attr("href") || "";
        if (!href) return;
        if (href.startsWith("/")) href = BASE_URL + href;
        if (seen.has(href)) return;
        seen.add(href);

        // 提取封面图（lazyload data-srcset）
        let coverUrl = "";
        const $img = $el.find("img[data-srcset]").first();
        if ($img.length) {
            coverUrl = normalizeImageUrl($img.attr("data-srcset") || "");
        }
        if (!coverUrl) {
            const $img2 = $el.find("img").first();
            coverUrl = normalizeImageUrl($img2.attr("src") || "");
        }

        // 提取标题（h2 on homepage, h3 on related sections）
        let title = "";
        const $titleEl = $el.find("h2, h3").first();
        if ($titleEl.length) {
            title = safeText($titleEl.attr("title") || $titleEl.text());
        }

        // 解码 HTML 实体
        title = title
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'");

        // 提取 slug 作为 ID
        const slugMatch = href.match(/\/movie\/([A-Za-z0-9]+)\//);
        const id = slugMatch ? slugMatch[1] : href;

        items.push({
            id: id,
            type: "url",
            mediaType: "movie",
            title: title || "Untitled",
            coverUrl: coverUrl,
            link: href,
            headers: IMAGE_HEADERS
        });
    });

    return items;
}

// ============================================================
//  模块函数
// ============================================================

// 首页推荐
async function getHomeVideos(params) {
    if (params.genreId) return getGenreVideos({ ...params, genre: params.genreId });
    if (params.peopleId) {
        const q = params.peopleId.replace(/^star:/, "").trim();
        if (q) return getSearchResults({ ...params, keyword: q });
    }
    const page = Math.max(1, Number(params.page) || 1);
    const url = page > 1
        ? BASE_URL + "/?page=" + page
        : BASE_URL + "/";
    const html = await fetchPage(url);
    return parseVideoList(html);
}

// 最新发布
async function getNewReleaseVideos(params) {
    if (params.genreId) return getGenreVideos({ ...params, genre: params.genreId });
    if (params.peopleId) {
        const q = params.peopleId.replace(/^star:/, "").trim();
        if (q) return getSearchResults({ ...params, keyword: q });
    }
    const page = Math.max(1, Number(params.page) || 1);
    const url = page > 1
        ? BASE_URL + "/release?page=" + page
        : BASE_URL + "/release";
    const html = await fetchPage(url);
    return parseVideoList(html);
}

// 搜索
async function getSearchResults(params) {
    if (params.genreId) return getGenreVideos({ ...params, genre: params.genreId });
    if (params.peopleId) {
        const peopleQuery = params.peopleId.replace(/^star:/, "").trim();
        if (peopleQuery) {
            const html = await fetchPage(BASE_URL + "/search?q=" + encodeURIComponent(peopleQuery));
            return parseVideoList(html);
        }
    }
    const query = (params.keyword || params.search_query || "").trim();
    if (!query) return [];
    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE_URL + "/search?q=" + encodeURIComponent(query);
    const html = await fetchPage(url);
    return parseVideoList(html);
}

// 类型浏览
async function getGenreVideos(params) {
    const genre = params.genreId || params.genre || "creampie";
    const page = Math.max(1, Number(params.page) || 1);
    const genreSlugMap = {
        "creampie": "GVWkCw",
        "big-tits": "BJiygps",
        "ol": "BBofqrM",
        "blow": "CHihjPU",
        "married-woman": "BcEqYww",
        "female-teacher": "GnEHzWA",
        "3p-4p": "BxHaNJc",
        "incest": "ttzyfU",
        "rape": "IoPveJE",
        "school-girls": "CMwMXEY",
        "masturbation": "zHowlU",
        "black": "IDYbTAQ",
        "mature-woman": "DFiQTPU",
        "facials": "HyKxxsQ",
        "squirting": "HShdVAg",
        "pov": "BZXvyLU",
        "pantyhose": "EOIleGo",
        "older-sister": "BUKLrxc",
        "beautiful-girl": "Ljbfjc",
        "cuckold": "DSqPmNM",
        "debut-production": "IgVddgQ",
        "solowork": "QxHGjE",
        "restraint": "DvnGozU",
        "female-college-student": "FENaXdk"
    };
    const genreId = genreSlugMap[genre] || "";
    if (!genreId) return [];
    const url = BASE_URL + "/genres/" + genreId + "/" + genre;
    const html = await fetchPage(url);
    return parseVideoList(html);
}

// ============================================================
//  loadDetail — 加载详情页并获取视频播放地址
// ============================================================
async function loadDetail(link) {
    // 1. 获取详情页 HTML
    const html = await fetchPage(link, { "Referer": link });

    const $ = Widget.html.load(html);

    // 2. 提取 data-id token
    const $video = $("#video-player");
    const token = $video.attr("data-id") || "";
    if (!token) {
        throw new Error("无法获取视频播放令牌 (data-id)");
    }

    // 3. 调用 /watch?token= 获取实际视频 URL
    const watchUrl = BASE_URL + "/watch?token=" + encodeURIComponent(token);
    let videoUrl = "";
    try {
        const watchResp = await Widget.http.get(watchUrl, {
            headers: Object.assign({}, REQUEST_HEADERS, { "Referer": link })
        });
        videoUrl = (watchResp.data || "").trim();
    } catch (e) {
        throw new Error("获取视频播放地址失败: " + (e.message || "未知错误"));
    }

    if (!videoUrl) {
        throw new Error("获取的视频播放地址为空");
    }

    // 4. 提取元数据
    // 标题
    let title = "";
    const $h1 = $("h1").first();
    if ($h1.length) {
        title = safeText($h1.text()).replace(/\s*\|\s*JAVMove\s*$/i, "").trim();
    }

    // 封面图
    let posterPath = "";
    const $coverImg = $("img[data-srcset]").first();
    if ($coverImg.length) {
        posterPath = normalizeImageUrl($coverImg.attr("data-srcset") || "");
    }
    if (!posterPath) {
        const $ogImg = $('meta[property="og:image"]');
        posterPath = normalizeImageUrl($ogImg.attr("content") || "");
    }

    // 影片代码
    let code = "";
    const $code = $("span.bg-gray-700.text-gray-200.px-3.py-1.rounded-full").first();
    if ($code.length) {
        code = safeText($code.text());
    }

    // 发布日期
    let releaseDate = "";
    $("li").each(function () {
        const text = safeText($(this).text());
        const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch && !releaseDate) {
            releaseDate = dateMatch[1];
        }
    });

    // 演员
    const peoples = [];
    $('a[href*="/stars/"]').each(function () {
        const $a = $(this);
        const name = safeText($a.text());
        const href = $a.attr("href") || "";
        const slugMatch = href.match(/\/stars\/([A-Za-z0-9]+)\//);
        const peopleId = slugMatch ? "star:" + slugMatch[1] : href;
        if (name && peopleId) {
            peoples.push({ id: peopleId, title: name });
        }
    });

    // 类型标签 (genres) — 取 URL 最后一段的英文名作 ID（对应 genreSlugMap 的 key）
    const genreItems = [];
    $('a[href*="/genres/"]').each(function () {
        const $a = $(this);
        const name = safeText($a.text());
        const href = $a.attr("href") || "";
        const parts = href.split("/").filter(Boolean);
        const genreName = parts.pop() || "";
        if (name && genreName) {
            genreItems.push({ id: genreName, title: name });
        }
    });

    // 描述信息
    let description = "";
    if (code) description += "Code: " + code;
    if (releaseDate) description += (description ? " | " : "") + "Release: " + releaseDate;
    if (peoples.length > 0) {
        description += (description ? " | " : "") + "Actors: " + peoples.map(p => p.title).join(", ");
    }

    // 相关视频
    let relatedItems;
    try {
        relatedItems = extractRelatedFromDetail(html, link);
    } catch (e) {
        // 相关视频提取失败不影响播放
    }

    return {
        id: code || link,
        type: "url",
        mediaType: "movie",
        videoUrl: videoUrl,
        headers: IMAGE_HEADERS,
        customHeaders: {
            "Referer": link,
            "User-Agent": REQUEST_HEADERS["User-Agent"]
        },
        title: title || "视频播放",
        description: description || undefined,
        genreItems: genreItems.length > 0 ? genreItems : undefined,
        peoples: peoples.length > 0 ? peoples : undefined,
        releaseDate: releaseDate || undefined,
        coverUrl: posterPath,
        backdropPath: posterPath,
        posterPath: posterPath,
        relatedItems: relatedItems,
        link: link
    };
}

// ============================================================
//  extractRelatedFromDetail — 提取相关推荐视频
// ============================================================
function extractRelatedFromDetail(html, currentLink) {
    const $ = Widget.html.load(html);
    const items = [];
    const seen = new Set([currentLink]);

    // 在 Next Movies 区域查找
    $("#nextMovie article.bg-gray-700, #nextMovie article[class*='bg-gray-700']").each(function () {
        if (items.length >= 12) return false;

        const $el = $(this);
        const $link = $el.find("a[href*='/movie/']").first();
        if (!$link.length) return;
        let href = $link.attr("href") || "";
        if (href.startsWith("/")) href = BASE_URL + href;
        if (seen.has(href)) return;
        seen.add(href);

        let coverUrl = "";
        const $img = $el.find("img[data-srcset]").first();
        if ($img.length) {
            coverUrl = normalizeImageUrl($img.attr("data-srcset") || "");
        }

        let title = "";
        const $titleEl = $el.find("h2, h3").first();
        if ($titleEl.length) {
            title = safeText($titleEl.attr("title") || $titleEl.text());
        }

        title = title
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        const slugMatch = href.match(/\/movie\/([A-Za-z0-9]+)\//);
        const id = slugMatch ? slugMatch[1] : href;

        items.push({
            id: id,
            type: "url",
            mediaType: "movie",
            title: title || "Untitled",
            coverUrl: coverUrl,
            link: href,
            headers: IMAGE_HEADERS
        });
    });

    return items.length > 0 ? items : undefined;
}
