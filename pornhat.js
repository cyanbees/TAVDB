// ============================================================
//  PornHat — 高清色情视频 Tube 站
//  源站: https://www.pornhat.com
//  HTML 静态渲染 + HLS 视频流
// ============================================================

WidgetMetadata = {
  id: "forward.pornhat",
  title: "PornHat",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "PornHat — 高清成人视频",
  author: "EL",
  site: "https://www.pornhat.com",
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
      id: "trending",
      title: "趋势热门",
      functionName: "loadTrending",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseTag",
      title: "标签浏览",
      functionName: "loadTag",
      cacheDuration: 300,
      params: [
        {
          name: "tag",
          title: "选择标签",
          type: "enumeration",
          value: "milf",
          enumOptions: [
            { title: "MILF", value: "milf" },
            { title: "Teen (18+)", value: "teen-18" },
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Big Tits", value: "big-tits" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Creampie", value: "creampie" },
            { title: "Cumshot", value: "cumshot" },
            { title: "Ebony", value: "ebony" },
            { title: "Facial", value: "facial" },
            { title: "Hardcore", value: "hardcore" },
            { title: "Homemade", value: "homemade" },
            { title: "Interracial", value: "interracial" },
            { title: "Latina", value: "latina" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Mature", value: "mature" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Squirt", value: "squirt" },
            { title: "Threesome", value: "threesome" },
            { title: "Big Ass", value: "big-ass" },
            { title: "Big Dick", value: "big-dick" },
            { title: "Bondage", value: "bondage" },
            { title: "BBC", value: "bbc" },
            { title: "Asian", value: "asian" },
            { title: "Small Tits", value: "small-tits" },
            { title: "Handjob", value: "handjob" },
            { title: "Masturbation", value: "masturbation" },
            { title: "Redhead", value: "redhead" },
            { title: "Group Sex", value: "group-sex" },
            { title: "Double Penetration", value: "double-penetration" },
            { title: "Gangbang", value: "gangbang" },
            { title: "Bukkake", value: "bukkake" },
            { title: "Babe", value: "babe" },
            { title: "Blonde", value: "blonde" },
            { title: "Brunette", value: "brunette" },
            { title: "Petite", value: "petite" },
            { title: "College", value: "college" },
            { title: "BBW", value: "bbw" },
            { title: "Hentai", value: "hentai" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseModel",
      title: "模特浏览",
      functionName: "loadModel",
      cacheDuration: 300,
      params: [
        {
          name: "model",
          title: "选择模特",
          type: "enumeration",
          value: "angela-white",
          enumOptions: [
            { title: "Angela White", value: "angela-white" },
            { title: "Abella Danger", value: "abella-danger" },
            { title: "Emily Willis", value: "emily-willis" },
            { title: "Dani Daniels", value: "dani-daniels" },
            { title: "Mia Khalifa", value: "mia-khalifa" },
            { title: "Valentina Nappi", value: "valentina-nappi" },
            { title: "Eliza Ibarra", value: "eliza-ibarra" },
            { title: "Brandi Love", value: "brandi-love" },
            { title: "Natasha Nice", value: "natasha-nice" },
            { title: "Alexis Fawx", value: "alexis-fawx" },
            { title: "Ava Addams", value: "ava-addams" },
            { title: "Cherie Deville", value: "cherie-deville" },
            { title: "Blake Blossom", value: "blake-blossom" },
            { title: "Lena Paul", value: "lena-paul" },
            { title: "Lana Rhoades", value: "lana-rhoades" },
            { title: "Reagan Foxx", value: "reagan-foxx" },
            { title: "Luna Star", value: "luna-star" },
            { title: "Ariella Ferrera", value: "ariella-ferrera" },
            { title: "Lauren Phillips", value: "lauren-phillips" },
            { title: "Bridgette B", value: "bridgette-b" },
            { title: "Gianna Dior", value: "gianna-dior" },
            { title: "Whitney Wright", value: "whitney-wright" },
            { title: "Kendra Lust", value: "kendra-lust" },
            { title: "Sophia Leone", value: "sophia-leone" },
            { title: "Violet Myers", value: "violet-myers" },
            { title: "Lexi Luna", value: "lexi-luna" },
            { title: "Kenzie Reeves", value: "kenzie-reeves" },
            { title: "Savannah Bond", value: "savannah-bond" },
            { title: "Alina Lopez", value: "alina-lopez" },
            { title: "Romi Rain", value: "romi-rain" },
            { title: "Adriana Chechik", value: "adriana-chechik" },
            { title: "Gia Derza", value: "gia-derza" },
            { title: "Jane Wilde", value: "jane-wilde" },
            { title: "Cory Chase", value: "cory-chase" },
            { title: "Nicole Aniston", value: "nicole-aniston" },
            { title: "Nicolette Shea", value: "nicolette-shea" },
            { title: "Elsa Jean", value: "elsa-jean" },
            { title: "Mia Malkova", value: "mia-malkova" },
            { title: "Chanel Preston", value: "chanel-preston" },
            { title: "Jasmine Jae", value: "jasmine-jae" },
            { title: "Cherry Kiss", value: "cherry-kiss" },
            { title: "Anissa Kate", value: "anissa-kate" },
            { title: "Julia Ann", value: "julia-ann" },
            { title: "Karma RX", value: "karma-rx" },
            { title: "Kenna James", value: "kenna-james" },
            { title: "Abigaiil Morris", value: "abigaiil-morris" },
            { title: "Gina Valentina", value: "gina-valentina" },
            { title: "Adria Rae", value: "adria-rae" },
            { title: "Abigail Mac", value: "abigail-mac" },
            { title: "Kira Noir", value: "kira-noir" },
            { title: "Bella Rolland", value: "bella-rolland" },
            { title: "Sheena Ryder", value: "sheena-ryder" },
            { title: "Phoenix Marie", value: "phoenix-marie" },
            { title: "Lela Star", value: "lela-star" },
            { title: "Sofia Lee", value: "sofia-lee" },
            { title: "Gabbie Carter", value: "gabbie-carter" },
            { title: "Alison Tyler", value: "alison-tyler" },
            { title: "Ella Knox", value: "ella-knox" },
            { title: "Riley Reid", value: "riley-reid" },
            { title: "Kyler Quinn", value: "kyler-quinn" },
            { title: "LaSirena69", value: "lasirena69" },
            { title: "Kali Roses", value: "kali-roses" },
            { title: "Richelle Ryan", value: "richelle-ryan" },
            { title: "Lulu Chu", value: "lulu-chu" },
            { title: "Payton Preslee", value: "payton-preslee" },
            { title: "Paige Owens", value: "paige-owens" },
            { title: "Ivy Lebelle", value: "ivy-lebelle" },
            { title: "Vanna Bardot", value: "vanna-bardot" },
            { title: "Angel Wicky", value: "angel-wicky" },
            { title: "Ryan Keely", value: "ryan-keely" },
            { title: "Bunny Colby", value: "bunny-colby" },
            { title: "Jenna Starr", value: "jenna-starr" },
            { title: "Coco Lovelock", value: "coco-lovelock" },
            { title: "Emma Hix", value: "emma-hix" },
            { title: "Karlee Grey", value: "karlee-grey" },
            { title: "Dee Williams", value: "dee-williams" },
            { title: "Lexi Lore", value: "lexi-lore" },
            { title: "Rachael Cavalli", value: "rachael-cavalli" },
            { title: "Stacy Cruz", value: "stacy-cruz" },
            { title: "Kendra Spade", value: "kendra-spade" },
            { title: "Jennifer White", value: "jennifer-white" },
            { title: "Kayley Gunner", value: "kayley-gunner" },
            { title: "AJ Applegate", value: "aj-applegate" },
            { title: "Sara Jay", value: "sara-jay" },
            { title: "Aubree Valentine", value: "aubree-valentine" },
            { title: "Jessa Rhodes", value: "jessa-rhodes" },
            { title: "Eva Elfie", value: "eva-elfie" },
            { title: "Britney Amber", value: "britney-amber" },
            { title: "Hazel Moore", value: "hazel-moore" },
            { title: "Aaliyah Hadid", value: "aaliyah-hadid" },
            { title: "Maddy May", value: "maddy-may" },
            { title: "Lacy Lennon", value: "lacy-lennon" },
            { title: "Katrina Jade", value: "katrina-jade" },
            { title: "Tiffany Tatum", value: "tiffany-tatum" },
            { title: "Cathy Heaven", value: "cathy-heaven" },
            { title: "Syren De Mer", value: "syren-de-mer" },
            { title: "Skylar Vox", value: "skylar-vox" },
            { title: "Eva Notty", value: "eva-notty" },
            { title: "Leana Lovings", value: "leana-lovings" },
            { title: "Ginebra Bellucci", value: "ginebra-bellucci" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "browseChannel",
      title: "频道浏览",
      functionName: "loadChannel",
      cacheDuration: 300,
      params: [
        {
          name: "channel",
          title: "选择频道",
          type: "enumeration",
          value: "brazzers",
          enumOptions: [
            { title: "Brazzers", value: "brazzers" },
            { title: "Naughty America", value: "naughty-america" },
            { title: "Reality Kings", value: "realitykings" },
            { title: "Bang Bros", value: "bangbros" },
            { title: "Nubiles Porn", value: "nubiles-porn" },
            { title: "Bang!", value: "bang" },
            { title: "Blacked.Com", value: "blacked-com" },
            { title: "Scoreland", value: "scoreland" },
            { title: "Adult Prime", value: "adult-prime" },
            { title: "Team Skeet", value: "teamskeet" },
            { title: "SexMex", value: "sexmex" },
            { title: "MYLF", value: "mylf" },
            { title: "Adult Time", value: "adulttime" },
            { title: "Family Strokes", value: "familystrokes" },
            { title: "Babes.Com", value: "babes-com" },
            { title: "Private", value: "private" },
            { title: "Czech AV", value: "czech-av" },
            { title: "Public Agent", value: "public-agent" },
            { title: "Porn CZ", value: "porn-cz" },
            { title: "Swappz", value: "swappz" },
            { title: "Dogfart Network", value: "dogfart-network" },
            { title: "Evil Angel", value: "evil-angel" },
            { title: "Sexy Hub", value: "sexyhub" },
            { title: "Dirty Flix", value: "dirty-flix" },
            { title: "Club Sweethearts", value: "clubseventeen" },
            { title: "Mofos", value: "mofos" },
            { title: "Dorcel Club", value: "dorcel-club" },
            { title: "Perfect Gonzo", value: "perfect-gonzo" },
            { title: "Backroom Casting Couch", value: "backroom-casting-couch" },
            { title: "18 VideoZ", value: "18-videoz" },
            { title: "Teen Mega World", value: "teenmegaworld" },
            { title: "Wankz", value: "wankz" },
            { title: "Mom Lover", value: "mom-lover" },
            { title: "Bang Bus", value: "bang-bus" },
            { title: "Inka Sex", value: "inka-sex" },
            { title: "Jav HD", value: "jav-hd" },
            { title: "Tug Pass", value: "tugpass" },
            { title: "All Pornsites Pass XXX", value: "all-pornsites-pass-xxx" },
            { title: "Cum4K", value: "cum4k" },
            { title: "Pervz", value: "pervz" },
            { title: "Devil's Film", value: "devil-s-film" },
            { title: "Pure Taboo", value: "pure-taboo" },
            { title: "ATK Girlfriends", value: "atk-girlfriends" },
            { title: "DDF Network", value: "ddf-network" },
            { title: "Mature NL", value: "mature-nl" },
            { title: "Karups", value: "karups" },
            { title: "Puba", value: "puba" },
            { title: "Hot Guys Fuck", value: "hot-guys-fuck" },
            { title: "Hot Wife XXX", value: "hot-wife-xxx" },
            { title: "AV 69", value: "av-69" },
            { title: "Japan HDV", value: "japan-hdv" },
            { title: "Cherry Pimps", value: "cherry-pimps" },
            { title: "1 pass", value: "1-pass" },
            { title: "My Pervy Family", value: "my-pervy-family" },
            { title: "Family XXX", value: "family-xxx" },
            { title: "African Casting", value: "african-casting" },
            { title: "AV Taxi", value: "av-taxi" },
            { title: "Spizoo", value: "spizoo" },
            { title: "ATK Hairy", value: "atk-hairy" },
            { title: "Analized", value: "analized" },
            { title: "Nubile Films", value: "nubile-films" },
            { title: "Girls Way", value: "girls-way" },
            { title: "Bellesa Films", value: "bellesa-films" },
            { title: "Digital Playground", value: "digitalplayground" },
            { title: "Puffy Network", value: "puffy-network" },
            { title: "Vixen", value: "vixen" },
            { title: "Passion HD", value: "passion-hd" },
            { title: "AsiaM", value: "asiam" },
            { title: "Fake Hub", value: "fakehub" },
            { title: "Smut Puppet", value: "smut-puppet" },
            { title: "Freeuse", value: "freeuse-fantasy" },
            { title: "Deeper", value: "deeper" },
            { title: "Asian Bondage", value: "asian-bondage" },
            { title: "Hot MILFs Fuck", value: "hot-milfs-fuck" },
            { title: "Box Of Porn", value: "box-of-porn" },
            { title: "Fake Taxi", value: "fake-taxi" },
            { title: "Porn Fidelity", value: "pornfidelity" },
            { title: "Blacked Raw", value: "blacked-raw" },
            { title: "Twistys", value: "twistys" },
            { title: "Tushy", value: "tushy" },
            { title: "Asian Footjob", value: "asian-footjob" },
            { title: "ATK Exotics", value: "atk-exotics" },
            { title: "Tonight's Girlfriend", value: "tonight-s-girlfriend" },
            { title: "Sex Art", value: "sexart" },
            { title: "Fit18", value: "fit18" },
            { title: "BB compilations", value: "bb-compilations" },
            { title: "Family Sinners", value: "family-sinners" },
            { title: "Daddy4k", value: "daddy4k" },
            { title: "African Sex Trip", value: "african-sex-trip" },
            { title: "Hard X", value: "hard-x" },
            { title: "Zero Tolerance", value: "zero-tolerance" },
            { title: "Black4k", value: "black4k" },
            { title: "Oldje", value: "oldje" },
            { title: "21 Sextury", value: "21-sextury" },
            { title: "Mile High Media", value: "mile-high-media" },
            { title: "Sweet Sinner", value: "sweet-sinner" },
            { title: "VIP 4K", value: "vip-4k" },
            { title: "Mommy's Girl", value: "mommy-s-girl" },
            { title: "WOW Girls", value: "wow-girls" },
            { title: "Fake Hostel", value: "fake-hostel" },
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchGlobal",
      title: "搜索视频",
      functionName: "searchVideos",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
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
//  常量
// ============================================================
const BASE_URL = "https://www.pornhat.com";
const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Referer": BASE_URL + "/"
};

// ============================================================
//  工具函数
// ============================================================

async function fetchPage(url) {
  const resp = await Widget.http.get(url, { headers: REQUEST_HEADERS });
  if (!resp || !resp.data) throw new Error("请求失败: " + url);
  return resp.data;
}

function decodeHtml(str) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/&#x27;/g, "'");
}

/**
 * 从 HTML 解析视频列表
 */
function parseVideoList(html) {
  const items = [];
  let pos = 0;

  while (true) {
    // 找下一个视频容器
    const start = html.indexOf('<div class="item thumb-bl thumb-bl-video', pos);
    if (start === -1) break;

    // 找到闭合位置：从 start 往后找第 4 个 </div>
    let closeCount = 0;
    let end = start;
    for (let i = start + 4; i < html.length; i++) {
      if (html.substring(i, i + 6) === '</div>') {
        closeCount++;
        if (closeCount === 4) { end = i + 6; break; }
        i += 5;
      }
    }
    if (end === start) break;

    const block = html.substring(start, end);
    pos = end;

    // 视频链接 + 标题
    const linkMatch = block.match(/href="(\/video\/[^"]+)"/);
    if (!linkMatch) continue;
    const link = linkMatch[1];

    const titleMatch = block.match(/title="([^"]*)"/);
    if (!titleMatch) continue;
    const title = decodeHtml(titleMatch[1].trim()).substring(0, 120);

    // 缩略图
    const thumbMatch = block.match(/data-original="([^"]+)"/);
    const thumb = thumbMatch ? thumbMatch[1] : "";

    // 视频 ID（从 SVG id 提取）
    const idMatch = block.match(/id="startButton_(\d+)"/);
    const videoId = idMatch ? idMatch[1] : "";

    // 时长
    const durMatch = block.match(/<span>(\d+:\d+)<\/span>/);
    const duration = durMatch ? durMatch[1] : "";

    // 观看数
    const viewsMatch = block.match(/fa-eye[\s\S]{0,50}?<span>([^<]+)<\/span>/);
    const viewsText = viewsMatch ? viewsMatch[1].trim() : "";

    // 频道
    const channelMatch = block.match(/\/sites\/([^"]+)"[^>]*>[\s\S]{0,30}?<span>([^<]+)<\/span>/);
    const channel = channelMatch ? channelMatch[2].trim() : "";

    // 模特
    const models = [];
    const modelRegex = /\/models\/([^"]+)"[^>]*>[\s\S]{0,30}?<span>([^<]+)<\/span>/g;
    let mm;
    while ((mm = modelRegex.exec(block)) !== null) {
      models.push({ id: mm[1], title: mm[2].trim() });
    }

    items.push({
      id: videoId || link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: thumb,
      posterPath: thumb,
      backdropPath: thumb,
      headers: { "Referer": BASE_URL + "/" },
      peoples: models.length > 0 ? models : undefined,
      durationText: duration
    });
  }
  return items;
}

// ============================================================
//  loadLatest / loadPopular / loadTrending
// ============================================================
async function loadLatest(params)   { return loadList("/", params); }
async function loadPopular(params)  { return loadList("/popular/", params); }
async function loadTrending(params) { return loadList("/trending/", params); }

async function loadList(path, params = {}) {
  try {
    if (params.genreId) return loadTag({ tag: params.genreId });
    if (params.peopleId) return loadModel({ model: params.peopleId });

    const page = Math.max(1, Number(params.page) || 1);
    const url = page > 1 ? BASE_URL + path + page + "/" : BASE_URL + path;
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[PornHat loadList] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadTag — 标签浏览
// ============================================================
async function loadTag(params = {}) {
  try {
    if (params.genreId) params.tag = params.genreId;
    if (params.peopleId) return loadModel({ model: params.peopleId });

    const tag = (params.tag || "milf").trim();
    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE_URL + "/tags/" + encodeURIComponent(tag) + "/" + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[PornHat loadTag] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadModel — 模特浏览
// ============================================================
async function loadModel(params = {}) {
  try {
    if (params.genreId) return loadTag({ tag: params.genreId });
    if (params.peopleId) return loadModel({ model: params.peopleId });

    const model = (params.model || "angela-white").trim();
    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE_URL + "/models/" + encodeURIComponent(model) + "/" + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[PornHat loadModel] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadChannel — 频道浏览
// ============================================================
async function loadChannel(params = {}) {
  try {
    if (params.genreId) return loadTag({ tag: params.genreId });
    if (params.peopleId) return loadModel({ model: params.peopleId });

    const channel = (params.channel || "brazzers").trim();
    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE_URL + "/sites/" + encodeURIComponent(channel) + "/" + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[PornHat loadChannel] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  searchVideos — 搜索
// ============================================================
async function searchVideos(params = {}) {
  try {
    if (params.peopleId) {
      return loadModel({ model: params.peopleId });
    }

    const keyword = (params.keyword || params.search_query || "").trim();
    if (!keyword) throw new Error("请输入搜索关键词");

    const page = Math.max(1, Number(params.page) || 1);
    const url = BASE_URL + "/search/" + encodeURIComponent(keyword) + "/" + (page > 1 ? page + "/" : "");
    const html = await fetchPage(url);
    return parseVideoList(html);
  } catch (error) {
    console.error("[PornHat searchVideos] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
//  loadDetail — 视频详情
// ============================================================
async function loadDetail(link) {
  if (!link) throw new Error("无效的视频链接");

  try {
    const url = link.startsWith("http") ? link : BASE_URL + link;
    const html = await fetchPage(url);

    // 从 JSON-LD 提取标题和缩略图
    let title = "未知标题";
    let thumb = "";
    let author = "";
    let uploadDate = "";
    let videoId = "";

    const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        const data = JSON.parse(ldMatch[1]);
        let vd = null;
        if (Array.isArray(data)) {
          for (const d of data) { if (d["@type"] === "VideoObject") { vd = d; break; } }
        } else if (data["@type"] === "VideoObject") { vd = data; }
        if (vd) {
          if (vd.name) title = vd.name.substring(0, 120);
          const tu = vd.thumbnailUrl;
          thumb = Array.isArray(tu) ? (tu[0] || "") : (typeof tu === "string" ? tu : "");
          if (vd.author) author = typeof vd.author === "string" ? vd.author : (vd.author.name || "");
          if (vd.uploadDate) uploadDate = vd.uploadDate;
          const embedUrl = vd.embedUrl || "";
          const idMatch2 = embedUrl.match(/\/(\d+)$/);
          if (idMatch2) videoId = idMatch2[1];
        }
      } catch (e) { /* JSON-LD parse error */ }
    }

    // 视频地址（从 <source> 标签取最高画质）
    let videoUrl = "";
    const sources = [];
    const srcRegex = /<source[^>]*src="([^"]+)"[^>]*type="video\/mp4"/g;
    let sm;
    while ((sm = srcRegex.exec(html)) !== null) {
      const src = sm[1];
      // 判断画质：_720p -> 720, _360p -> 360, 无后缀 -> 原始（最高）
      let quality = 0;
      if (src.indexOf("_720p") !== -1) quality = 720;
      else if (src.indexOf("_360p") !== -1) quality = 360;
      else quality = 1080; // 无标记的原始画质最高
      sources.push({ url: src, quality: quality });
    }
    // 选最高画质
    if (sources.length > 0) {
      sources.sort(function(a, b) { return b.quality - a.quality; });
      videoUrl = sources[0].url;
    }

    // 剧照（从 video poster 取高清图）
    const posterMatch = html.match(/<video[^>]*poster="([^"]+)"/);
    const hdThumb = posterMatch ? posterMatch[1] : thumb;
    const backdropPaths = hdThumb ? [hdThumb] : [];

    // 分类（从页面找 tag 链接）
    const genreItems = [];
    const tagRegex = /<a[^>]*href="\/tags\/([^"]+)"[^>]*>[\s\S]{0,60}?([^<>{]{2,30})(?:<\/span>)?<\/a>/g;
    let tg;
    while ((tg = tagRegex.exec(html)) !== null) {
      const slug = tg[1].replace(/\/$/, "");
      const name = tg[2].trim().replace(/<[^>]*>/g, "");
      if (name.length >= 2 && name.length <= 30 && name !== "Tags") {
        genreItems.push({ id: slug, title: name });
      }
      if (genreItems.length >= 10) break;
    }

    // 演员（从页面找 model 链接）+ 上传者
    const peoples = [];
    const modelRegex = /<a[^>]*href="\/models\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let md;
    while ((md = modelRegex.exec(html)) !== null) {
      const name = md[2].trim();
      if (name.length <= 30) {
        peoples.push({ id: md[1].replace(/\/$/, ""), title: name });
      }
    }
    if (author && !peoples.some(function(p) { return p.title.toLowerCase() === author.toLowerCase(); })) {
      peoples.push({ id: author.toLowerCase().replace(/\s+/g, "-"), title: author });
    }

    // 预告片
    const trailers = videoUrl ? [{ url: videoUrl, coverUrl: hdThumb || thumb }] : [];

    // 相关推荐（从详情页提取其他视频项，排除当前视频）
    const allItems = parseVideoList(html);
    const relatedItems = allItems
      .filter(function(r) { return r.link !== link; })
      .slice(0, 10);

    return {
      id: link,
      type: "url",
      mediaType: "movie",
      title: title,
      link: link,
      coverUrl: hdThumb || thumb,
      posterPath: hdThumb || thumb,
      backdropPath: hdThumb || thumb,
      videoUrl: videoUrl,
      headers: { "Referer": BASE_URL + "/" },
      genreItems: genreItems.length > 0 ? genreItems : undefined,
      peoples: peoples.length > 0 ? peoples : undefined,
      backdropPaths: backdropPaths,
      trailers: trailers,
      relatedItems: relatedItems.length > 0 ? relatedItems : undefined
    };
  } catch (error) {
    console.error("[PornHat loadDetail] 失败:", error.message || error);
    throw error;
  }
}
