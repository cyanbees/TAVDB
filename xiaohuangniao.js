WidgetMetadata = {
    id: "forward.xiaohuangniao",
    title: "小黄鸟",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "xiaohuangniao.me — 黄推视频聚合、中文 Twitter 成人内容搜索和高速下载。",
    author: "GM",
    site: "https://xiaohuangniao.me",
    detailCacheDuration: 600,
    modules: [
        // ========== 热门推文 ==========
        {
            id: "hotTweets",
            title: "热门",
            functionName: "getHotTweets",
            cacheDuration: 180,
            params: [
                {
                    name: "sort_by",
                    title: "排序",
                    type: "enumeration",
                    value: "trending",
                    enumOptions: [
                        { title: "综合", value: "trending" },
                        { title: "最新", value: "latest" },
                        { title: "最多观看", value: "views" },
                        { title: "最热", value: "hot" },
                        { title: "精选", value: "popular" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        
        // ========== 分类浏览 ==========
        {
            id: "browseCategories",
            title: "分类",
            functionName: "getCategoryVideos",
            cacheDuration: 600,
            params: [
                {
                    name: "category",
                    title: "选择分类",
                    type: "enumeration",
                    value: "萝莉",
                    enumOptions: [
                        { title: "萝莉", value: "萝莉" },
                        { title: "巨乳", value: "巨乳" },
                        { title: "人妻", value: "人妻" },
                        { title: "熟女", value: "熟女" },
                        { title: "少妇", value: "少妇" },
                        { title: "御姐", value: "御姐" },
                        { title: "女高", value: "女高" },
                        { title: "女大", value: "女大" },
                        { title: "学生", value: "学生" },
                        { title: "初中", value: "初中" },
                        { title: "少萝", value: "少萝" },
                        { title: "妈妈", value: "妈妈" },
                        { title: "老师", value: "老师" },
                        { title: "空姐", value: "空姐" },
                        { title: "网红", value: "网红" },
                        { title: "福利姬", value: "福利姬" },
                        { title: "探花", value: "探花" },
                        { title: "吃瓜", value: "吃瓜" },
                        { title: "抖推", value: "抖推" },
                        { title: "抖音", value: "抖音" },
                        { title: "抖音风", value: "抖音风" },
                        { title: "动漫", value: "动漫" },
                        { title: "福利", value: "福利" },
                        { title: "口交", value: "口交" },
                        { title: "肛交", value: "肛交" },
                        { title: "后入", value: "后入" },
                        { title: "内射", value: "内射" },
                        { title: "喷水", value: "喷水" },
                        { title: "自慰", value: "自慰" },
                        { title: "女同", value: "女同" },
                        { title: "双飞", value: "双飞" },
                        { title: "双马尾", value: "双马尾" },
                        { title: "3P", value: "3P" },
                        { title: "强奸", value: "强奸" },
                        { title: "乱伦", value: "乱伦" },
                        { title: "人妖", value: "人妖" },
                        { title: "伪娘", value: "伪娘" },
                        { title: "女喘", value: "女喘" },
                        { title: "女性向", value: "女性向" },
                        { title: "女王", value: "女王" },
                        { title: "母狗", value: "母狗" },
                        { title: "淫妻", value: "淫妻" },
                        { title: "淫语", value: "淫语" },
                        { title: "媚黑", value: "媚黑" },
                        { title: "绿帽", value: "绿帽" },
                        { title: "出轨", value: "出轨" },
                        { title: "夫妻", value: "夫妻" },
                        { title: "情侣", value: "情侣" },
                        { title: "勾引", value: "勾引" },
                        { title: "单男", value: "单男" },
                        { title: "反差", value: "反差" },
                        { title: "变装", value: "变装" },
                        { title: "丝袜", value: "丝袜" },
                        { title: "白丝", value: "白丝" },
                        { title: "白袜", value: "白袜" },
                        { title: "白虎", value: "白虎" },
                        { title: "大奶", value: "大奶" },
                        { title: "屁眼", value: "屁眼" },
                        { title: "极品", value: "极品" },
                        { title: "抽搐", value: "抽搐" },
                        { title: "寸止", value: "寸止" },
                        { title: "打桩", value: "打桩" },
                        { title: "打屁股", value: "打屁股" },
                        { title: "扩张", value: "扩张" },
                        { title: "四爱", value: "四爱" },
                        { title: "对白", value: "对白" },
                        { title: "偷拍", value: "偷拍" },
                        { title: "户外", value: "户外" },
                        { title: "宿舍", value: "宿舍" },
                        { title: "健身", value: "健身" },
                        { title: "体育生", value: "体育生" },
                        { title: "兔崽", value: "兔崽" },
                        { title: "困困狗", value: "困困狗" },
                        { title: "小小绘", value: "小小绘" },
                        { title: "江南第一深情", value: "江南第一深情" },
                        { title: "我的枪好长", value: "我的枪好长" },
                        { title: "合集", value: "合集" },
                        { title: "吃瓜", value: "吃瓜" },
                        { title: "福利下载", value: "福利下载" },
                        { title: "黄推", value: "黄推" },
                        { title: "网红私拍", value: "网红私拍" },
                        { title: "黄推吃瓜", value: "黄推吃瓜" },
                        { title: "搜索推文", value: "搜索推文" },
                        { title: "返回首页", value: "返回首页" },
                        { title: "关于我们", value: "关于我们" },
                        { title: "快速链接", value: "快速链接" },
                        { title: "内容分类", value: "内容分类" },
                        { title: "热门内容", value: "热门内容" },
                        { title: "下载视频", value: "下载视频" },
                        { title: "保存原片", value: "保存原片" },
                        { title: "浏览下载", value: "浏览下载" },
                        { title: "实时内容", value: "实时内容" },
                        { title: "高清视频", value: "高清视频" },
                        { title: "批量图片", value: "批量图片" },
                        { title: "动图保存", value: "动图保存" },
                        { title: "一键保存", value: "一键保存" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            id: "tiktokVideos",
            title: "抖推",
            functionName: "getTiktokVideos",
            cacheDuration: 300,
            params: [
                { name: "page", title: "页码", type: "page" }
            ]
        },
        // ========== 搜索（自由输入 + 热搜点选）==========
        {
            id: "searchMain",
            title: "搜索",
            functionName: "getSearchResults",
            cacheDuration: 180,
            params: [
                {
                    name: "keyword",
                    title: "关键词",
                    type: "input",
                    value: ""
                },
                {
                    name: "trending",
                    title: "热搜",
                    type: "enumeration",
                    value: "",
                    enumOptions: [
                        { title: "— 选择热搜词 —", value: "" },
                        { title: "萝莉", value: "萝莉" },
                        { title: "顶胯", value: "顶胯" },
                        { title: "强奸", value: "强奸" },
                        { title: "福利姬", value: "福利姬" },
                        { title: "cos", value: "cos" },
                        { title: "裸舞", value: "裸舞" },
                        { title: "露出", value: "露出" },
                        { title: "喷水", value: "喷水" },
                        { title: "抖音风", value: "抖音风" },
                        { title: "自慰", value: "自慰" },
                        { title: "绿帽", value: "绿帽" },
                        { title: "江南第一深情", value: "江南第一深情" },
                        { title: "户外", value: "户外" },
                        { title: "兔崽", value: "兔崽" },
                        { title: "后入", value: "后入" },
                        { title: "肛交", value: "肛交" },
                        { title: "韩国", value: "韩国" },
                        { title: "美女", value: "美女" },
                        { title: "扩张", value: "扩张" },
                        { title: "沐沐老师", value: "沐沐老师" },
                        { title: "3P", value: "3P" },
                        { title: "内射", value: "内射" },
                        { title: "调教", value: "调教" },
                        { title: "巨乳", value: "巨乳" },
                        { title: "人妻", value: "人妻" },
                        { title: "熟女", value: "熟女" },
                        { title: "少女", value: "少女" },
                        { title: "素人", value: "素人" },
                        { title: "学生", value: "学生" },
                        { title: "女优", value: "女优" },
                        { title: "SM", value: "SM" },
                        { title: "捆绑", value: "捆绑" },
                        { title: "颜射", value: "颜射" },
                        { title: "潮吹", value: "潮吹" },
                        { title: "口交", value: "口交" },
                        { title: "中出", value: "中出" },
                        { title: "无码", value: "无码" },
                        { title: "有码", value: "有码" },
                        { title: "日本", value: "日本" },
                        { title: "国产", value: "国产" },
                        { title: "欧美", value: "欧美" },
                        { title: "自拍", value: "自拍" },
                        { title: "偷拍", value: "偷拍" },
                        { title: "母子", value: "母子" },
                        { title: "乱伦", value: "乱伦" },
                        { title: "母狗", value: "母狗" },
                        { title: "足交", value: "足交" },
                        { title: "乳交", value: "乳交" },
                        { title: "双插", value: "双插" },
                        { title: "群交", value: "群交" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
    ],
    search: {
        title: "搜索",
        functionName: "getSearchResults",
        params: [
            { name: "keyword", title: "搜索关键词", type: "input", value: "萝莉" },
            { name: "page", title: "页码", type: "page" }
        ]
    }
};

const BASE_URL = "https://xiaohuangniao.me";
const API_URL = BASE_URL + "/api";

const REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
    "Referer": BASE_URL + "/"
};
const IMAGE_HEADERS = {
    "User-Agent": REQUEST_HEADERS["User-Agent"],
    "Referer": "https://x.com/"
};

// ============================================================
//  fetchAPI — 调用内部 JSON API
// ============================================================
async function fetchAPI(path, params) {
    let url = API_URL + path;
    if (params) {
        const qs = Object.entries(params)
            .filter(([k, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(String(v)))
            .join("&");
        if (qs) url += "?" + qs;
    }

    const response = await Widget.http.get(url, { headers: REQUEST_HEADERS });
    if (!response || !response.data) {
        throw new Error("API 请求失败");
    }

    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    if (!data.success) {
        throw new Error("API 返回错误");
    }
    return data.data;
}

// ============================================================
//  parseTweets — 将 API 推文数据转为 Forward VideoItem 列表
//  只保留视频推文（mediaUrls 中有 type=video 的项）
//  注意：link 直接用视频 URL，因为该站没有详情页
// ============================================================
function parseTweets(tweets) {
    const items = [];

    for (const tweet of tweets) {
        // 过滤：只保留有视频媒体的推文
        const videoMeta = (tweet.mediaUrls || []).find(m => m.type === "video" && m.url);
        if (!videoMeta) continue;

        const videoUrl = videoMeta.url;
        if (!videoUrl) continue;

        // 标题（取推文文本的第一行，去标签）
        const title = (tweet.text || "")
            .split("\n")[0]
            .replace(/#\S+/g, "")
            .replace(/https?:\/\/\S+/g, "")
            .replace(/@\S+/g, "")
            .trim() || "未命名视频";

        // 封面图——从 extendedEntities 取
        let coverUrl = "";
        const entities = tweet.extendedEntities || {};
        const mediaArr = entities.media || [];
        if (mediaArr.length > 0) {
            coverUrl = mediaArr[0].media_url_https || mediaArr[0].media_url || "";
        }

        // 描述——推文文本 + 作者信息
        const author = tweet.author || {};
        const authorName = author.name || "";
        const userName = author.userName ? "@" + author.userName : "";
        const description = [authorName, userName].filter(Boolean).join(" ");

        // 时长
        let durationText = "";
        const durMs = videoMeta.duration || 0;
        if (durMs > 0) {
            const totalSec = Math.floor(durMs / 1000);
            const mins = Math.floor(totalSec / 60);
            const secs = totalSec % 60;
            durationText = mins + ":" + (secs < 10 ? "0" : "") + secs;
        }

        // 浏览量
        const views = tweet.viewCount || 0;

        items.push({
            id: tweet.id || tweet.tweetId,
            type: "url",
            mediaType: "movie",
            title: title,
            description: description,
            tagline: views > 0 ? views + " 次观看" : "",
            coverUrl: coverUrl,
            durationText: durationText,
            link: videoUrl,
            headers: IMAGE_HEADERS
        });
    }

    return items;
}

// ============================================================
//  loadDetail — 获取视频播放地址
//  link 是视频 URL 本身（该站无详情页）
// ============================================================
async function loadDetail(link) {
    if (!link) throw new Error("无效的视频链接");

    // 如果是搜索关键词或用户查询，调用 loadList 返回搜索结果
    if (!link.startsWith("http")) {
        const results = await getSearchResults({ keyword: link, page: 1 });
        if (results.length > 0) {
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

    if (!link || !link.startsWith("http")) {
        throw new Error("无效的视频链接");
    }

    return {
        id: link,
        type: "url",
        mediaType: "movie",
        videoUrl: link,
        headers: IMAGE_HEADERS,
        customHeaders: {
            "Referer": "https://x.com/",
            "User-Agent": REQUEST_HEADERS["User-Agent"]
        }
    };
}

// 分类浏览
async function getCategoryVideos(params) {
    const category = (params.category || "萝莉").trim();
    if (!category) return [];
    const page = Math.max(1, Number(params.page) || 1);
    const data = await fetchAPI("/tweet", {
        page: page,
        limit: 16,
        category: category
    });
    const tweets = data.tweets || [];
    return parseTweets(tweets);
}

// 抖推短视频
async function getTiktokVideos(params) {
    const page = Math.max(1, Number(params.page) || 1);
    const data = await fetchAPI("/tweet", {
        page: page,
        limit: 16,
        category: "tiktok"
    });
    const tweets = data.tweets || [];
    return parseTweets(tweets);
}

// ============================================================
//  getHotTweets — 热门推文
//  API: /api/tweet?page=N&limit=16&minViewCount=10000&minDuration=60000
// ============================================================
async function getHotTweets(params) {
    const page = Math.max(1, Number(params.page) || 1);
    const sortBy = params.sort_by || "trending";
    const queryParams = {
        page: page,
        limit: 16,
        minViewCount: 1000,
        minDuration: 30000,
        sort: sortBy
    };
    const data = await fetchAPI("/tweet", queryParams);

    const tweets = data.tweets || [];
    return parseTweets(tweets);
}

// ============================================================
//  getSearchResults — 搜索推文
//  API: /api/search/tweets?q=keyword&page=N&limit=16
// ============================================================
async function getSearchResults(params) {
    const query = (params.trending || params.keyword || params.search_query || "").trim();
    if (!query) return [];

    const page = Math.max(1, Number(params.page) || 1);
    const data = await fetchAPI("/search/tweets", {
        q: query,
        page: page,
        limit: 16
    });

    const tweets = data.tweets || [];
    return parseTweets(tweets);
}


