// ==UserScript==
// @name        XXBUM
// @namespace   Violentmonkey Scripts
// @match       *
// @grant       none
// @version     1.0
// @author      -
// @description 2026-06-15 17:18:50
// ==/UserScript==

WidgetMetadata = {
  id: "xxbum",
  title: "XXBUM",
  icon: "https://xxbum.com/favicon.ico",
  version: "1.0",
  description: "XXBUM 视频模块",
  types: ["video"],
  cacheDuration: 300,
  detailCacheDuration: 60,
  modules: [
    {
      id: "latest",
      title: "最新视频",
      functionName: "loadLatest",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "popular",
      title: "热门推荐",
      functionName: "loadPopular",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "random",
      title: "随机推荐",
      functionName: "loadRandom",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "korea",
      title: "韩国",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "japan",
      title: "日本",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "west",
      title: "欧美",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "asia",
      title: "亚洲",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "onlyfans",
      title: "OnlyFans",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "javAmateur",
      title: "JAV业余",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "bj",
      title: "BJ主播",
      functionName: "loadCategory",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchXxbum",
      title: "搜索XXBUM",
      functionName: "searchVideos",
      cacheDuration: 300,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ],
  search: {
    title: "搜索XXBUM",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var API_BASE = "https://xxbum.com";

function getTitle(item) {
  if (item.translations && item.translations.en && item.translations.en.title) {
    return item.translations.en.title;
  }
  return item.title || "Untitled";
}

function formatDuration(seconds) {
  if (!seconds) return "";
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds % 60;
  if (h > 0) return h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function parseItem(item) {
  return {
    type: "url",
    link: item.id,
    title: getTitle(item),
    thumbnail: item.thumbnail_url || "",
    videoUrl: item.hls_url || "",
    duration: formatDuration(item.duration),
    rating: item.total_views ? item.total_views / 1000 + "k" : "",
    peoples: [],
    genreItems: item.category ? [{ id: item.category, title: item.category }] : []
  };
}

function parseDetailItem(item) {
  var result = {
    link: item.id,
    title: getTitle(item),
    thumbnail: item.thumbnail_url || "",
    videoUrl: item.hls_url || "",
    duration: formatDuration(item.duration),
    rating: item.total_views ? item.total_views / 1000 + "k" : "",
    peoples: [],
    genreItems: item.category ? [{ id: item.category, title: item.category }] : [],
    trailers: [],
    backdropPaths: [],
    relatedItems: []
  };

  // Use preview_url as trailer
  if (item.preview_url) {
    result.trailers.push({
      title: "预告片",
      videoUrl: item.preview_url,
      thumbnail: item.thumbnail_url || ""
    });
  }

  // Use thumbnail as backdrop
  if (item.thumbnail_url) {
    result.backdropPaths.push(item.thumbnail_url);
  }

  return result;
}

function handleListParams(params) {
  if (params.genreId) {
    return loadCategory({ category: params.genreId, page: 1 });
  }
  if (params.peopleId) {
    return { items: [] };
  }
  return null;
}

function fetchAPI(path) {
  return Widget.http.get(API_BASE + path, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
      "Accept": "application/json"
    }
  });
}

function loadLatest(params) {
  var filtered = handleListParams(params);
  if (filtered) return filtered;

  var page = params.page || 1;
  var resp = fetchAPI("/api/videos?page=" + page + "&sort=newest");
  var data = JSON.parse(resp.body);
  var items = data.items || [];
  return {
    items: items.map(parseItem),
    hasMore: items.length >= 20
  };
}

function loadPopular(params) {
  var filtered = handleListParams(params);
  if (filtered) return filtered;

  var page = params.page || 1;
  var resp = fetchAPI("/api/videos?page=" + page + "&sort=popular");
  var data = JSON.parse(resp.body);
  var items = data.items || [];
  return {
    items: items.map(parseItem),
    hasMore: items.length >= 20
  };
}

function loadRandom(params) {
  var filtered = handleListParams(params);
  if (filtered) return filtered;

  var page = params.page || 1;
  var resp = fetchAPI("/api/videos?page=" + page + "&sort=random");
  var data = JSON.parse(resp.body);
  var items = data.items || [];
  return {
    items: items.map(parseItem),
    hasMore: items.length >= 20
  };
}

function loadCategory(params) {
  var filtered = handleListParams(params);
  if (filtered) return filtered;

  var page = params.page || 1;
  // The module id matches the category slug
  var category = params.category || params.id || "";
  if (!category && params.title) {
    // Try to map from module title to category slug
    var titleMap = {
      "韩国": "korea",
      "日本": "japan",
      "欧美": "west",
      "亚洲": "east",
      "OnlyFans": "OnlyFans",
      "JAV业余": "javAmateur",
      "BJ主播": "bj"
    };
    category = titleMap[params.title] || "";
  }
  if (!category) return { items: [] };

  var resp = fetchAPI("/api/videos?page=" + page + "&category=" + encodeURIComponent(category));
  var data = JSON.parse(resp.body);
  var items = data.items || [];
  return {
    items: items.map(parseItem),
    hasMore: items.length >= 20
  };
}

function searchVideos(params) {
  var filtered = handleListParams(params);
  if (filtered) return filtered;

  var keyword = params.keyword || "";
  var page = params.page || 1;
  if (!keyword) return { items: [] };

  var resp = fetchAPI("/api/videos?page=" + page + "&search=" + encodeURIComponent(keyword));
  var data = JSON.parse(resp.body);
  var items = data.items || [];
  return {
    items: items.map(parseItem),
    hasMore: items.length >= 20
  };
}

function loadDetail(link) {
  var resp = fetchAPI("/api/videos/" + link);
  var item = JSON.parse(resp.body);
  var result = parseDetailItem(item);

  // Fetch related items from same category
  if (item.category) {
    try {
      var relatedResp = fetchAPI("/api/videos?category=" + encodeURIComponent(item.category) + "&sort=newest");
      var relatedData = JSON.parse(relatedResp.body);
      var related = relatedData.items || [];
      result.relatedItems = related
        .filter(function(r) { return r.id !== item.id; })
        .slice(0, 20)
        .map(function(r) {
          return {
            type: "url",
            link: r.id,
            title: getTitle(r),
            thumbnail: r.thumbnail_url || "",
            videoUrl: r.hls_url || ""
          };
        });
    } catch(e) {
      // related items are optional
    }
  }

  return result;
}
