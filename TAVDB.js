/**
 * JavDB 榜单
 * 提供 JavDB Top250、热播榜、分类榜的榜单浏览和影片详情展示
 * 需要提供 JavDB 账号密码（设置→全局参数）
 *
 * 使用 MD5 签名算法，Token 自动续期
 *
 * globalParams:
 * username: JavDB 账号
 * password: JavDB 密码
 *
 * search: keyword + page
 * loadTop250: ranking_type + type_value/year_value + page
 * loadPlayback: period + page
 * loadCensored: period + page
 * loadUncensored: period + page
 * loadFC2: period + page
 * loadActors: page
 * loadDetail: link
 */
WidgetMetadata = {
  id: "TAVDB",
  title: "TAVDB 榜单",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "JavDB 榜单 + 115 网盘播放/离线。浏览 JavDB 榜单和影片详情，在详情页点击播放时自动匹配 115 网盘文件提供 HLS 播放源；匹配不到时自动从 JavDB 获取磁力链接提交 115 离线下载。需要提供 JavDB 账号密码和 115 Cookie（设置→全局参数）",
  author: "EL",
  site: "https://jdforrepam.com",
  detailCacheDuration: 60,
  globalParams: [
    { name: "username", title: "JavDB 账号", type: "input", value: "", description: "JavDB 登录账号" },
    { name: "password", title: "JavDB 密码", type: "input", value: "", description: "JavDB 登录密码" },
    { name: "cookie", title: "115 Cookie", type: "input", value: "", placeholder: "填入 115.com 登录后的完整 Cookie" }
  ],
  modules: [
    {
      id: "loadTop250",
      title: "Top250",
      functionName: "loadTop250",
      cacheDuration: 3600,
      params: [
        {
          name: "ranking_type",
          title: "榜单类型",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "综合", value: "all" },
            { title: "按分类", value: "video_type" },
            { title: "按年份", value: "year" }
          ]
        },
        {
          name: "type_value",
          title: "分类",
          type: "enumeration",
          value: "0",
          belongTo: { paramName: "ranking_type", value: ["video_type"] },
          enumOptions: [
            { title: "有码", value: "0" },
            { title: "无码", value: "1" },
            { title: "FC2", value: "3" }
          ]
        },
        {
          name: "year_value",
          title: "年份",
          type: "input",
          value: "",
          placeholders: [{ title: "输入年份，如 2024", value: "2024" }],
          belongTo: { paramName: "ranking_type", value: ["year"] }
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadPlayback",
      title: "热播榜",
      functionName: "loadPlayback",
      cacheDuration: 3600,
      params: [
        {
          name: "period",
          title: "周期",
          type: "enumeration",
          value: "daily",
          enumOptions: [
            { title: "日榜", value: "daily" },
            { title: "周榜", value: "weekly" },
            { title: "月榜", value: "monthly" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadCensored",
      title: "有码榜",
      functionName: "loadCensored",
      cacheDuration: 3600,
      params: [
        {
          name: "period",
          title: "周期",
          type: "enumeration",
          value: "daily",
          enumOptions: [
            { title: "日榜", value: "daily" },
            { title: "周榜", value: "weekly" },
            { title: "月榜", value: "monthly" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadUncensored",
      title: "无码榜",
      functionName: "loadUncensored",
      cacheDuration: 3600,
      params: [
        {
          name: "period",
          title: "周期",
          type: "enumeration",
          value: "daily",
          enumOptions: [
            { title: "日榜", value: "daily" },
            { title: "周榜", value: "weekly" },
            { title: "月榜", value: "monthly" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadFC2",
      title: "FC2 榜",
      functionName: "loadFC2",
      cacheDuration: 3600,
      params: [
        {
          name: "period",
          title: "周期",
          type: "enumeration",
          value: "daily",
          enumOptions: [
            { title: "日榜", value: "daily" },
            { title: "周榜", value: "weekly" },
            { title: "月榜", value: "monthly" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadActors",
      title: "JAVDB女优榜单",
      functionName: "loadActors",
      cacheDuration: 3600,
      params: [
        {
          name: "actress",
          title: "女优",
          type: "enumeration",
          value: "83V",
          enumOptions: [{"title":"桃園憐奈","value":"83V"},{"title":"水卜樱","value":"0edE"},{"title":"本庄鈴","value":"BzpA"},{"title":"美園和花","value":"qA0N"},{"title":"風間由美","value":"82m3"},{"title":"美咲佳奈","value":"8Nqa"},{"title":"西宮夢","value":"7BX1"},{"title":"友田真希","value":"Ab9n"},{"title":"河北彩花","value":"EvkJ"},{"title":"夢乃愛華","value":"AbBK"},{"title":"大槻響","value":"BKMM"},{"title":"七澤美亞","value":"NPD3"},{"title":"桃乃木香奈","value":"0dKX"},{"title":"波多野結衣","value":"R2Vg"},{"title":"明裏紲","value":"M4Q7"},{"title":"奧田咲","value":"wVVz"},{"title":"夏目彩春","value":"kek6"},{"title":"JULIA","value":"1KBW"},{"title":"神宮寺奈緒","value":"ZzNm"},{"title":"伊藤舞雪","value":"YgJx"},{"title":"櫻空桃","value":"bvWB"},{"title":"鈴村愛裏","value":"nRKm"},{"title":"紗倉真菜","value":"J9dd"},{"title":"河合明日菜","value":"69A0"},{"title":"森澤佳奈","value":"A0Qy"},{"title":"涼森玲夢","value":"KxPb"},{"title":"吉根柚莉愛","value":"0Bw3"},{"title":"竹内有紀","value":"pZae"},{"title":"八木奈々","value":"gEkm"},{"title":"東條夏","value":"A6zy"},{"title":"木下凜凜子","value":"Wb1B"},{"title":"木下日葵","value":"MW44"},{"title":"小野六花","value":"zvK7"},{"title":"石原希望","value":"QO2M"},{"title":"森日向子","value":"bkxd"},{"title":"葵伊吹","value":"JbER"},{"title":"七森莉莉","value":"Ewa2"},{"title":"月野香澄","value":"znyb"},{"title":"八掛海","value":"p33Qb"},{"title":"白峰美羽","value":"W1wee"},{"title":"楓可憐","value":"p3kMZ"},{"title":"北野未奈","value":"ZXy46"},{"title":"MINAMO","value":"k4O90"},{"title":"新井莉麻","value":"E2vOx"},{"title":"楓芙愛","value":"0RkDa"},{"title":"石川澪","value":"QV0p9"},{"title":"宍戸里帆","value":"meyzd"},{"title":"宮下玲奈","value":"YnZ1K"},{"title":"由良かな","value":"k43we"},{"title":"藤環奈","value":"p3DYE"},{"title":"安達夕莉","value":"O21k8"},{"title":"九野ひなの","value":"g0W2Z"},{"title":"葉山さゆり","value":"1B0AA"},{"title":"清原美優","value":"O2qxB"},{"title":"羽月乃蒼","value":"J2z7B"},{"title":"明日葉みつは","value":"658kM"},{"title":"黒島玲衣","value":"XWGG5"},{"title":"九井蘇娜歐","value":"352Ow"},{"title":"村上悠華","value":"xvPx8"},{"title":"逢沢みゆ","value":"zK98J"},{"title":"長浜みつり","value":"zK9pQ"},{"title":"金松季歩","value":"RdZe8"},{"title":"北岡果林","value":"J2q7B"},{"title":"白上咲花","value":"bAv5g"},{"title":"田野憂","value":"8VOMx"},{"title":"小野坂ゆいか","value":"9Dx0R"},{"title":"日向由奈","value":"p39RE"},{"title":"彩月七緒","value":"RdEb4"},{"title":"依本しおり","value":"xv6BV"},{"title":"糸井瑠花","value":"eK5gr"},{"title":"巴ひかり","value":"W1PvB"},{"title":"愛才りあ","value":"RdEyz"},{"title":"瀬戸環奈","value":"neRNX"},{"title":"花守夏歩","value":"D2EdJ"},{"title":"新妻ゆうか","value":"QVEBJ"},{"title":"柏木ふみか","value":"qDYDe"},{"title":"木村愛心","value":"yrRx0"},{"title":"紫堂るい","value":"bA2yd"},{"title":"守屋よしの","value":"Mm1qA"},{"title":"純白彩永","value":"65PEn"},{"title":"幸村泉希","value":"k47Az"},{"title":"福田ゆあ","value":"nen2w"},{"title":"井上もも","value":"0R1n3"},{"title":"鈴木希","value":"8VGE5"},{"title":"早坂奏音","value":"VwnPz"},{"title":"博多彩葉","value":"zKgPW"},{"title":"小松空","value":"k4MbY"},{"title":"白石透羽","value":"zKgQ5"},{"title":"森下茉莉","value":"QVy9n"},{"title":"園梨音","value":"eKbnd"}]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "release",
          enumOptions: [
            { title: "发布日期", value: "release" },
            { title: "评分", value: "score" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadDMMRanking",
      title: "DMM女优月榜",
      functionName: "loadDMMRanking",
      cacheDuration: 3600,
      params: [
        {
          name: "actress",
          title: "女优",
          type: "enumeration",
          value: "zK98J",
          enumOptions: [
            {title:"1 逢沢みゆ",value:"zK98J"},{title:"2 瀬戸環奈",value:"neRNX"},{title:"3 波多野結衣",value:"R2Vg"},{title:"4 河北彩花",value:"EvkJ"},{title:"5 彩月七緒",value:"RdEb4"},{title:"6 石川澪",value:"QV0p9"},{title:"7 北岡果林",value:"J2q7B"},{title:"8 幸村泉希",value:"k47Az"},{title:"9 博多彩葉",value:"zKgPW"},{title:"10 小野坂ゆいか",value:"9Dx0R"},{title:"11 水卜さくら",value:"0edE"},{title:"12 桃乃木かな",value:"0dKX"},{title:"13 涼森れむ",value:"KxPb"},{title:"14 鷲尾めい",value:"xpbA"},{title:"15 紫堂るい",value:"bA2yd"},{title:"16 森沢かな",value:"A0Qy"},{title:"17 宍戸里帆",value:"meyzd"},{title:"18 羽月乃蒼",value:"J2z7B"},{title:"19 JULIA",value:"1KBW"},{title:"20 鈴村あいり",value:"nRKm"},{title:"21 浅野こころ",value:"me7mM"},{title:"22 愛花未滿",value:"YnwDp"},{title:"23 早坂奏音",value:"VwnPz"},{title:"24 井上もも",value:"0R1n3"},{title:"25 糸井瑠花",value:"eK5gr"},{title:"26 小那海あや",value:"Mm1YA"},{title:"27 神宮寺ナオ",value:"ZzNm"},{title:"28 伊藤舞雪",value:"YgJx"},{title:"29 花守夏歩",value:"D2EdJ"},{title:"30 宮下玲奈",value:"YnZ1K"},{title:"31 美園和花",value:"qA0N"},{title:"32 木村愛心",value:"yrRx0"},{title:"33 白上咲花",value:"bAv5g"},{title:"34 楪カレン",value:"p3kMZ"},{title:"35 月野かすみ",value:"znyb"},{title:"36 依本しおり",value:"xv6BV"},{title:"37 田野憂",value:"8VOMx"},{title:"38 小日向みゆう",value:"O2qxB"},{title:"39 葉山さゆり",value:"1B0AA"},{title:"40 新井リマ",value:"E2vOx"},{title:"41 北野未奈",value:"ZXy46"},{title:"42 吉根ゆりあ",value:"0Bw3"},{title:"43 明日葉みつは",value:"658kM"},{title:"44 長浜みつり",value:"zK9pQ"},{title:"45 黒島玲衣",value:"XWGG5"},{title:"46 小野六花",value:"zvK7"},{title:"47 園梨音",value:"eKbnd"},{title:"48 木下凛々子",value:"Wb1B"},{title:"49 楓ふうあ",value:"0RkDa"},{title:"50 七沢みあ",value:"NPD3"},{title:"51 夢乃あいか",value:"AbBK"},{title:"52 木下ひまり",value:"MW44"},{title:"53 明里つむぎ",value:"M4Q7"},{title:"54 八掛うみ",value:"p33Qb"},{title:"55 愛才りあ",value:"RdEyz"},{title:"56 巴ひかり",value:"W1PvB"},{title:"57 miru",value:"vd5z"},{title:"58 葵いぶき",value:"JbER"},{title:"59 柏木ふみか",value:"qDYDe"},{title:"60 七ツ森りり",value:"Ewa2"},{title:"61 大槻ひびき",value:"BKMM"},{title:"62 東條なつ",value:"A6zy"},{title:"63 桃園怜奈",value:"83V"},{title:"64 白石透羽",value:"zKgQ5"},{title:"65 金松季歩",value:"RdZe8"},{title:"66 村上悠華",value:"xvPx8"},{title:"67 安達夕莉",value:"O21k8"},{title:"68 森日向子",value:"bkxd"},{title:"69 本庄鈴",value:"BzpA"},{title:"70 夏目彩春",value:"kek6"},{title:"71 藤かんな",value:"p3DYE"},{title:"72 奥田咲",value:"wVVz"},{title:"73 九野ひなの",value:"g0W2Z"},{title:"74 友田真希",value:"Ab9n"},{title:"75 新妻ゆうか",value:"QVEBJ"},{title:"76 九井スナオ",value:"352Ow"},{title:"77 竹内有紀",value:"pZae"},{title:"78 石原希望",value:"QO2M"},{title:"79 風間ゆみ",value:"82m3"},{title:"80 鈴木希",value:"8VGE5"},{title:"81 天月あず",value:"90Rp"},{title:"82 白峰ミウ",value:"W1wee"},{title:"83 由良かな",value:"k43we"},{title:"84 八木奈々",value:"gEkm"},{title:"85 美咲かんな",value:"8Nqa"},{title:"86 福田ゆあ",value:"nen2w"},{title:"87 凪ひかる",value:"1G09"},{title:"88 紗倉まな",value:"J9dd"},{title:"89 天馬ゆい",value:"k4rwN"},{title:"90 純白彩永",value:"65PEn"},{title:"91 日向由奈",value:"p39RE"},{title:"92 西宮ゆめ",value:"7BX1"},{title:"93 MINAMO",value:"k4O90"},{title:"94 桜空もも",value:"bvWB"},{title:"95 小松空",value:"k4MbY"},{title:"96 河合あすな",value:"69A0"},{title:"97 北条麻妃",value:"wZxm"},{title:"98 守屋よしの",value:"Mm1qA"},{title:"99 莉々はるか",value:"vNKW"},{title:"100 森下茉莉",value:"QVy9n"}
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "release",
          enumOptions: [
            { title: "发布日期", value: "release" },
            { title: "评分", value: "score" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadDMMMonthly",
      title: "FANZA月度榜单",
      functionName: "loadDMMMonthlyRanking",
      cacheDuration: 86400,
      params: [
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadMiddleFinger",
      title: "中指通每月推荐",
      functionName: "loadMiddleFingerRecommend",
      cacheDuration: 86400,
      params: [
        {
          name: "month",
          title: "月份",
          type: "enumeration",
          value: "2026-05",
          enumOptions: [
            { title: "2025年6月", value: "2025-06" },
            { title: "2025年7月", value: "2025-07" },
            { title: "2025年8月", value: "2025-08" },
            { title: "2025年9月", value: "2025-09" },
            { title: "2025年10月", value: "2025-10" },
            { title: "2025年11月", value: "2025-11" },
            { title: "2025年12月", value: "2025-12" },
            { title: "2026年1月", value: "2026-01" },
            { title: "2026年2月", value: "2026-02" },
            { title: "2026年3月", value: "2026-03" },
            { title: "2026年4月", value: "2026-04" },
            { title: "2026年5月", value: "2026-05" }
          ]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "默认排序", value: "" },
            { title: "2025年6月", value: "2025-06" },
            { title: "2025年7月", value: "2025-07" },
            { title: "2025年8月", value: "2025-08" },
            { title: "2025年9月", value: "2025-09" },
            { title: "2025年10月", value: "2025-10" },
            { title: "2025年11月", value: "2025-11" },
            { title: "2025年12月", value: "2025-12" },
            { title: "2026年1月", value: "2026-01" },
            { title: "2026年2月", value: "2026-02" },
            { title: "2026年3月", value: "2026-03" },
            { title: "2026年4月", value: "2026-04" },
            { title: "2026年5月", value: "2026-05" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadMaker",
      title: "厂牌",
      functionName: "loadMaker",
      cacheDuration: 3600,
      params: [
        {
          name: "maker",
          title: "厂牌",
          type: "enumeration",
          value: "7R",
          enumOptions: [{"title":"S1 NO.1 STYLE","value":"7R"},{"title":"SOD Create","value":"q6"},{"title":"MOODYZ","value":"zKW"},{"title":"FALENO","value":"Y46"},{"title":"PRESTIGE,プレステージ","value":"6M"},{"title":"ABC/妄想族","value":"DYK"},{"title":"ナチュラルハイ","value":"gZ"},{"title":"ワープエンタテインメント","value":"e1"},{"title":"変態紳士倶楽部","value":"ARy"},{"title":"JET映像","value":"zbJ"},{"title":"ROOKIE","value":"JAA"},{"title":"Hunter","value":"2Vm"},{"title":"Jackson","value":"GP2q"},{"title":"セレブの友","value":"deB"},{"title":"LEO","value":"zW"},{"title":"山と空","value":"AEO"},{"title":"ミル","value":"4dR"},{"title":"犬/妄想族","value":"mw5"},{"title":"DAHLIA","value":"5458"},{"title":"ケイ・エム・プロデュース","value":"8V9"},{"title":"プレステージプレミアム(PRESTIGE PREMIUM)","value":"Qap"},{"title":"桃太郎映像出版","value":"pk"},{"title":"アイエナジー","value":"W7"},{"title":"LUNATICS","value":"557"},{"title":"シロウトTV","value":"Jnxd"},{"title":"DANDY","value":"1EW"},{"title":"ダスッ！","value":"ZyP"},{"title":"溜池ゴロー","value":"Ww7"},{"title":"本中","value":"89V"},{"title":"ディープス","value":"D8"},{"title":"バビロン/妄想族","value":"Qvyq"},{"title":"美","value":"aeX"},{"title":"E-BODY","value":"bgA"},{"title":"ラグジュTV","value":"mbW5"},{"title":"S-Cute","value":"gBA"},{"title":"IDEA POCKET","value":"ZXX"},{"title":"OPPAI","value":"p3k"},{"title":"VENUS","value":"OXz"},{"title":"AVS","value":"363"},{"title":"マックスエー","value":"96p"},{"title":"クリスタル映像","value":"KQ"},{"title":"アリスJAPAN","value":"J2x"},{"title":"Fitch","value":"Aby"},{"title":"Glory Quest","value":"W17"},{"title":"kira★kira","value":"Rkg"},{"title":"kawaii","value":"rmZ"},{"title":"MARRION","value":"647"},{"title":"Attackers","value":"Ywz"},{"title":"Digital Ark","value":"RGD"},{"title":"エムズビデオグループ","value":"dZ0"},{"title":"マドンナ(Madonna)","value":"35e"},{"title":"ROYAL","value":"kBvm"},{"title":"h.m.p","value":"xZg"},{"title":"プレミアム","value":"8Xd"},{"title":"ワンズファクトリー","value":"333"},{"title":"オフサイドトラップ","value":"DPDp"},{"title":"グラッツコーポレーション","value":"d49"},{"title":"ビビアン","value":"J0R"},{"title":"Air control","value":"32D"},{"title":"FAIR&WAY","value":"8BEK"},{"title":"MARLOMEDIA","value":"xeRV"}]
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          value: "release",
          enumOptions: [
            { title: "发布日期", value: "release" },
            { title: "评分", value: "score" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchActress",
      title: "搜索女优",
      functionName: "searchActress",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "女优名称", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchMaker",
      title: "搜索厂牌",
      functionName: "searchMaker",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "厂牌名称", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "searchList",
      title: "搜索片单",
      functionName: "searchList",
      cacheDuration: 3600,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "115 网盘 + Jable + MissAV",
      description: "匹配 115 网盘文件 + jable.tv 提供 HLS 播放源；115 无匹配时自动离线",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 10,
      requiresWebView: false,
      params: [
        {
          name: "auto_offline",
          title: "自动离线下载",
          type: "enumeration",
          value: "true",
          enumOptions: [
            { title: "开启", value: "true" },
            { title: "关闭", value: "false" }
          ]
        }
      ]
    },
  ],
  search: {
    title: "搜索影片",
    functionName: "searchJavDB",
    params: [
      { name: "keyword", title: "番号/标题", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ============================================================
// MD5 (RFC 1321) — 已验证: md5("hello") = 5d41402abc4b2a76b9719d911017c592
// API 测试: POST + JSON body → HTTP 200 正常响应
// ============================================================
function md5(s) {
  function md5cycle(h, x) {
    var a = h[0], b = h[1], c = h[2], d = h[3];
    a = ff(a, b, c, d, x[0], 7, -680876936); d = ff(d, a, b, c, x[1], 12, -389564586); c = ff(c, d, a, b, x[2], 17, 606105819); b = ff(b, c, d, a, x[3], 22, -1044525330);
    a = ff(a, b, c, d, x[4], 7, -176418897); d = ff(d, a, b, c, x[5], 12, 1200080426); c = ff(c, d, a, b, x[6], 17, -1473231341); b = ff(b, c, d, a, x[7], 22, -45705983);
    a = ff(a, b, c, d, x[8], 7, 1770035416); d = ff(d, a, b, c, x[9], 12, -1958414417); c = ff(c, d, a, b, x[10], 17, -42063); b = ff(b, c, d, a, x[11], 22, -1990404162);
    a = ff(a, b, c, d, x[12], 7, 1804603682); d = ff(d, a, b, c, x[13], 12, -40341101); c = ff(c, d, a, b, x[14], 17, -1502002290); b = ff(b, c, d, a, x[15], 22, 1236535329);
    a = gg(a, b, c, d, x[1], 5, -165796510); d = gg(d, a, b, c, x[6], 9, -1069501632); c = gg(c, d, a, b, x[11], 14, 643717713); b = gg(b, c, d, a, x[0], 20, -373897302);
    a = gg(a, b, c, d, x[5], 5, -701558691); d = gg(d, a, b, c, x[10], 9, 38016083); c = gg(c, d, a, b, x[15], 14, -660478335); b = gg(b, c, d, a, x[4], 20, -405537848);
    a = gg(a, b, c, d, x[9], 5, 568446438); d = gg(d, a, b, c, x[14], 9, -1019803690); c = gg(c, d, a, b, x[3], 14, -187363961); b = gg(b, c, d, a, x[8], 20, 1163531501);
    a = gg(a, b, c, d, x[13], 5, -1444681467); d = gg(d, a, b, c, x[2], 9, -51403784); c = gg(c, d, a, b, x[7], 14, 1735328473); b = gg(b, c, d, a, x[12], 20, -1926607734);
    a = hh(a, b, c, d, x[5], 4, -378558); d = hh(d, a, b, c, x[8], 11, -2022574463); c = hh(c, d, a, b, x[11], 16, 1839030562); b = hh(b, c, d, a, x[14], 23, -35309556);
    a = hh(a, b, c, d, x[1], 4, -1530992060); d = hh(d, a, b, c, x[4], 11, 1272893353); c = hh(c, d, a, b, x[7], 16, -155497632); b = hh(b, c, d, a, x[10], 23, -1094730640);
    a = hh(a, b, c, d, x[13], 4, 681279174); d = hh(d, a, b, c, x[0], 11, -358537222); c = hh(c, d, a, b, x[3], 16, -722521979); b = hh(b, c, d, a, x[6], 23, 76029189);
    a = hh(a, b, c, d, x[9], 4, -640364487); d = hh(d, a, b, c, x[12], 11, -421815835); c = hh(c, d, a, b, x[15], 16, 530742520); b = hh(b, c, d, a, x[2], 23, -995338651);
    a = ii(a, b, c, d, x[0], 6, -198630844); d = ii(d, a, b, c, x[7], 10, 1126891415); c = ii(c, d, a, b, x[14], 15, -1416354905); b = ii(b, c, d, a, x[5], 21, -57434055);
    a = ii(a, b, c, d, x[12], 6, 1700485571); d = ii(d, a, b, c, x[3], 10, -1894986606); c = ii(c, d, a, b, x[10], 15, -1051523); b = ii(b, c, d, a, x[1], 21, -2054922799);
    a = ii(a, b, c, d, x[8], 6, 1873313359); d = ii(d, a, b, c, x[15], 10, -30611744); c = ii(c, d, a, b, x[6], 15, -1560198380); b = ii(b, c, d, a, x[13], 21, 1309151649);
    a = ii(a, b, c, d, x[4], 6, -145523070); d = ii(d, a, b, c, x[11], 10, -1120210379); c = ii(c, d, a, b, x[2], 15, 718787259); b = ii(b, c, d, a, x[9], 21, -343485551);
    h[0] = safe_add(a, h[0]); h[1] = safe_add(b, h[1]); h[2] = safe_add(c, h[2]); h[3] = safe_add(d, h[3]);
  }
  function cmn(q, a, b, x, s, t) { return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function rol(n, b) { return (n << b) | (n >>> (32 - b)); }
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function str2binl(str) {
    var bin = [];
    for (var i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return bin;
  }
  function binl2hex(binarray) {
    var hex = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      hex += "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) +
             "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15);
    }
    return hex;
  }
  var x = str2binl(s);
  var lenBits = s.length * 8;
  x[lenBits >> 5] |= 0x80 << ((lenBits) % 32);
  while (((x.length * 32) % 512) !== 448) { x.push(0); }
  x.push(lenBits & 0xFFFFFFFF);
  x.push(Math.floor(lenBits / 0x100000000) & 0xFFFFFFFF);
  var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
  for (var i = 0; i < x.length; i += 16) {
    md5cycle(h, x.slice(i, i + 16));
  }
  return binl2hex(h);
}

// ============================================================
// 常量 & 工具
// ============================================================

var BASE_URL = "https://jdforrepam.com/api";
var SIGN_KEY = "71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa";
var LIMIT = 30;

function generateSignature() {
  var ts = Math.floor(Date.now() / 1000);
  return ts + ".lpw6vgqzsp." + md5(String(ts) + SIGN_KEY);
}

function makeHeaders(token) {
  var h = {
    "jdSignature": generateSignature(),
    "User-Agent": "Dart/3.5 (dart:io)"
  };
  if (token) {
    h["Authorization"] = "Bearer " + token;
  }
  return h;
}

function replaceCDN(data) {
  if (typeof data === "string") {
    if (data.indexOf("tp-iu.cmastd.com") !== -1) {
      data = data.replace("https://tp-iu.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com");
    }
    if (data.indexOf("tp.cmastd.com") !== -1) {
      data = data.replace("https://tp.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com");
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(replaceCDN);
  }
  if (data && typeof data === "object") {
    var result = {};
    for (var k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        result[k] = replaceCDN(data[k]);
      }
    }
    return result;
  }
  return data;
}

function getText(value) {
  return String(value || "").trim();
}

function normalizeJavdbImageUrl(url) {
  return replaceCDN(String(url || "").trim());
}

function normalizeJavdbImageCandidates(candidates) {
  var normalized = [];
  for (var i = 0; i < (candidates || []).length; i++) {
    var url = normalizeJavdbImageUrl(candidates[i]);
    if (url) normalized.push(url);
  }
  return normalized;
}

var STANDARD_CODE_ALLOWLIST = /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|ABF|ABP|JUFE|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|MIRD|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS|CJOD|EBWH|JYMA|MDHR|DVAJ|ACHJ)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/;
var STANDARD_CODE_GENERIC = /\b[A-Z0-9]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/;

var DMM_CONTENT_PREFIX_MAP = {
  WSA: "2",
  FSDSS: "1",
  FCDSS: "1",
  FNS: "1",
  FTHTD: "1",
  FALENO: "1",
  FGAN: "1",
  FSNF: "1",
  FLAV: "1",
  NAAC: "h_706",
  NHDTC: "1",
  KUSE: "1",
  MBDD: "301",
  SDNM: "1",
  STARS: "1",
  STAR: "1",
  START: "1",
  SODS: "1",
  REBD: "h_346",
  REBDB: "h_346",
  GSHRB: "h_346",
  MOGI: "1",
  FTAV: "1"
};
var DMM_DIRECT_PREFIXES = new Set(["SNIS", "SNOS", "SONE", "SSIS", "SSNI", "STARS", "START", "SODS", "FSDSS", "FCDSS", "FNS", "FTHTD", "FSNF", "FLAV", "NHDTC", "KUSE", "MOGI", "FTAV", "WSA", "MIDV", "MIDA", "MIDE", "MIDD", "DASS", "HIKA", "MKMP", "MADM", "IPZZ", "IPZ", "IPX", "NGOD", "SDNM", "AVSA", "MNGS", "WAAA", "OFES", "OFJE", "OAE", "SIVR", "HSODA", "JUFE", "MUKA", "MIMK", "HMN", "ROYD", "SDHS", "JUR", "CAWD", "REBD", "ADN", "ATID", "JUL", "JUMS", "JUQ", "LULU", "MEYD", "MIAA", "MIAB", "MIRD", "PRED", "URE", "YUJ", "CJOD", "EBWH", "JYMA", "MDHR", "DVAJ", "ACHJ"]);
var DMM_DIRECT_BLOCKED_CODES = new Set(["START-227", "IPZZ-899"]);
var JAVP_TRAILER_CACHE = {};
var JAVP_TRAILER_PROMISE_CACHE = {};
var JAVP_FETCH_TIMEOUT_MS = 1800;
var DMM_CONTENT_ID_OVERRIDES = {};

var MGSTAGE_COVER_RULES = {
  ABF: { maker: "prestige" },
  ABW: { maker: "prestige" },
  ABP: { maker: "prestige" },
  CHN: { maker: "prestige" },
  PPT: { maker: "prestige" }
};

var MGSTAGE_PREFIXES = new Set(["ABF", "ABW", "ABP", "CHN", "PPT"]);

function normalizeDmmPrefix(prefix) {
  var p = String(prefix || "").toUpperCase();
  if (p === "REBDB") return "REBD";
  return p;
}

function extractStandardCode(text) {
  var s = getText(text).toUpperCase();
  if (!s) return "";
  if (/\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/.test(s)) return "";

  var match = s.match(STANDARD_CODE_ALLOWLIST) || s.match(STANDARD_CODE_GENERIC);
  if (!match || !match[0]) return "";

  var raw = match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
  var parts = raw.match(/^([A-Z0-9]+)-?(\d{2,8})([A-Z]?)$/);
  if (!parts) return raw;

  return parts[1].toUpperCase() + "-" + String(parseInt(parts[2], 10)) + (parts[3] || "");
}

function parseStandardCodeParts(value) {
  var code = extractStandardCode(value);
  if (!code) return null;

  var normalized = code.toUpperCase().replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-");
  var match = normalized.match(/^([A-Z0-9]+)-?(\d{2,8})([A-Z]?)$/);
  if (!match) return null;

  var prefix = match[1].toUpperCase();
  var number = String(parseInt(match[2], 10));
  var suffix = match[3] || "";
  return {
    prefix: prefix,
    prefixLower: prefix.toLowerCase(),
    number: number,
    number3: number.padStart(3, "0"),
    number5: number.padStart(5, "0"),
    suffix: suffix,
    code: prefix + "-" + number + suffix,
    plainCode: prefix.toLowerCase() + number.padStart(5, "0") + suffix.toLowerCase()
  };
}

function isDirectDmmSeries(parts) {
  if (!parts) return false;
  if (DMM_DIRECT_BLOCKED_CODES.has(parts.prefix + "-" + parts.number)) return false;
  return DMM_DIRECT_PREFIXES.has(normalizeDmmPrefix(parts.prefix));
}

function buildDmmContentIdFromParts(parts) {
  if (!parts) return "";

  var code = parts.code ? String(parts.code).toUpperCase() : "";
  if (code && DMM_CONTENT_ID_OVERRIDES[code]) {
    return DMM_CONTENT_ID_OVERRIDES[code];
  }

  var prefix = normalizeDmmPrefix(parts.prefix);
  var numericPrefix = DMM_CONTENT_PREFIX_MAP[prefix] || "";
  if (!numericPrefix && /^SD[A-Z]{2,3}$/.test(prefix)) {
    numericPrefix = "1";
  }
  return numericPrefix + prefix.toLowerCase() + parts.number5 + String(parts.suffix || "").toLowerCase();
}

function buildDmmCoverCandidatesFromContentId(contentId) {
  if (!contentId) return { posterCandidates: [], backdropCandidates: [] };

  return {
    posterCandidates: [
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + contentId + "/" + contentId + "ps.jpg",
      "https://pics.dmm.co.jp/digital/video/" + contentId + "/" + contentId + "ps.jpg"
    ],
    backdropCandidates: [
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/" + contentId + "/" + contentId + "pl.jpg",
      "https://pics.dmm.co.jp/digital/video/" + contentId + "/" + contentId + "pl.jpg"
    ]
  };
}

function buildDmmCoverCandidatesFromParts(parts) {
  if (!parts) return { posterCandidates: [], backdropCandidates: [] };
  return buildDmmCoverCandidatesFromContentId(buildDmmContentIdFromParts(parts));
}

function buildMgstageCoverCandidatesFromParts(parts, rule) {
  if (!parts || !rule || !rule.maker) return { posterCandidates: [], backdropCandidates: [] };

  var prefixLower = parts.prefixLower;
  var number = parts.number3;
  if (!prefixLower || !number) return { posterCandidates: [], backdropCandidates: [] };

  var dvdDash = prefixLower + "-" + number;
  var base = "https://image.mgstage.com/images/" + rule.maker + "/" + prefixLower + "/" + number;
  return {
    posterCandidates: [
      base + "/pf_e_" + dvdDash + ".jpg",
      base + "/pf_o1_" + dvdDash + ".jpg"
    ],
    backdropCandidates: [
      base + "/pb_e_" + dvdDash + ".jpg"
    ]
  };
}

async function buildImageCandidatesFromValue(value) {
  var rawValue = getText(value).toUpperCase();
  if (rawValue.indexOf("XXX-AV") !== -1) {
    return { strategy: "blocked", posterCandidates: [], backdropCandidates: [], sampleCandidates: [] };
  }

  var parts = parseStandardCodeParts(rawValue);
  if (!parts) return { strategy: "javdb", posterCandidates: [], backdropCandidates: [], sampleCandidates: [] };

  if (isDirectDmmSeries(parts)) {
    var directCandidates = buildDmmCoverCandidatesFromParts(parts);
    directCandidates.strategy = "direct-dmm";
    return directCandidates;
  }

  if (MGSTAGE_PREFIXES.has(parts.prefix)) {
    var rule = MGSTAGE_COVER_RULES[parts.prefix] || { maker: "prestige" };
    var mgstageCandidates = buildMgstageCoverCandidatesFromParts(parts, rule);
    mgstageCandidates.strategy = "mgstage";
    return mgstageCandidates;
  }

  return { strategy: "javdb", posterCandidates: [], backdropCandidates: [], sampleCandidates: [] };
}

function chooseFirstCandidate(candidates, fallback) {
  for (var i = 0; i < candidates.length; i++) {
    if (candidates[i]) return candidates[i];
  }
  return fallback || "";
}

function pickFirstAvailableImageUrl(candidates, fallback) {
  return chooseFirstCandidate(candidates, fallback);
}

async function fetchJavpTrailerUrl(code) {
  var query = String(code || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!query || query.length < 3) return "";
  if (JAVP_TRAILER_CACHE[query] !== undefined) return JAVP_TRAILER_CACHE[query];

  if (!JAVP_TRAILER_PROMISE_CACHE[query]) {
    JAVP_TRAILER_PROMISE_CACHE[query] = Widget.http.get("https://javp.cc.cd/trailers/" + encodeURIComponent(query), {
      headers: { "User-Agent": "Dart/3.5 (dart:io)", "Accept": "application/json,text/plain,*/*", "Referer": "https://javp.cc/" },
      timeout: JAVP_FETCH_TIMEOUT_MS
    }).then(function(res) {
      var data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      var url = String(data && data.trailer || "").trim();
      JAVP_TRAILER_CACHE[query] = url;
      return url;
    }).catch(function() {
      JAVP_TRAILER_CACHE[query] = "";
      return "";
    });
  }

  return JAVP_TRAILER_PROMISE_CACHE[query];
}

function extractMovies(respData) {
  if (!respData) return [];
  if (respData.data && respData.data.movies) return respData.data.movies;
  if (respData.movies) return respData.movies;
  return [];
}

// ============================================================
// 登录 & Token 管理
// ============================================================

var CRED_USER_KEY = "javdb_cred_user";
var CRED_PASS_KEY = "javdb_cred_pass";
var TOKEN_KEY = "javdb_token";
var TOKEN_EXPIRES_KEY = "javdb_token_expires";

async function saveCredentials(username, password) {
  if (username) await Widget.storage.set(CRED_USER_KEY, username);
  if (password) await Widget.storage.set(CRED_PASS_KEY, password);
}

async function getCredentials() {
  var user = await Widget.storage.get(CRED_USER_KEY);
  var pass = await Widget.storage.get(CRED_PASS_KEY);
  return { username: user, password: pass };
}

async function doLogin(username, password) {
  var ts = Math.floor(Date.now() / 1000);
  var sig = ts + ".lpw6vgqzsp." + md5(String(ts) + SIGN_KEY);

  var loginBody = {
    username: username,
    password: password,
    device_uuid: "04b9534d-5118-53de-9f87-2ddded77111e",
    device_name: "MagnetBoard",
    device_model: "Server",
    platform: "ios",
    system_version: "17.4",
    app_version: "official",
    app_version_number: "1.9.29",
    app_channel: "official"
  };

  try {
    var response = await Widget.http.post(BASE_URL + "/v1/sessions", loginBody, {
      headers: {
        "jdSignature": sig,
        "User-Agent": "Dart/3.5 (dart:io)",
        "Content-Type": "application/json"
      }
    });

    if (!response || !response.data) {
      throw new Error("服务器无响应");
    }

    var d = response.data;
    if (d.success === 1 && d.data && d.data.token) {
      var token = d.data.token;
      await Widget.storage.set(TOKEN_KEY, token);
      await Widget.storage.set(TOKEN_EXPIRES_KEY, String(Math.floor(Date.now() / 1000) + 7 * 24 * 3600));
      return token;
    }

    throw new Error(d.message || "登录失败，请检查账号密码");
  } catch (e) {
    if (e.message && e.message.indexOf("400") !== -1) {
      throw new Error("JavDB 登录 400 错误：签名或参数格式不对");
    }
    throw new Error("JavDB 登录失败: " + (e.message || "未知错误"));
  }
}

async function ensureLoggedIn(username, password) {
  // 如果 params 未传入凭证，尝试从 storage 读取已保存的
  if (!username || !password) {
    var creds = await getCredentials();
    username = creds.username;
    password = creds.password;
    if (!username || !password) {
      throw new Error("请先设置 JavDB 账号密码（设置→全局参数）");
    }
  }

  await saveCredentials(username, password);

  var token = await Widget.storage.get(TOKEN_KEY);
  var expires = await Widget.storage.get(TOKEN_EXPIRES_KEY);
  if (token && expires) {
    var now = Math.floor(Date.now() / 1000);
    if (now < Number(expires)) {
      return token;
    }
  }

  return doLogin(username, password);
}

// ============================================================
// API 请求
// ============================================================

async function apiGet(endpoint, queryParams, username, password) {
  var token = await ensureLoggedIn(username, password);

  var response = await Widget.http.get(BASE_URL + endpoint, {
    headers: makeHeaders(token),
    params: queryParams
  });

  if (!response || !response.data) {
    throw new Error(endpoint + " 返回空响应");
  }

  var raw = response.data;
  // 任何 success===0 都尝试重登录一次（带防重复标记）
  var retried = false;
  while (raw && raw.success === 0 && !retried) {
    var httpStatus = response.statusCode || 0;
    var msg = raw.message || "";
    console.warn("[apiGet] " + endpoint + " 返回 success=0, message:", msg, "HTTP:", httpStatus, "将尝试重新登录");
    retried = true;
    try {
      token = await doLogin(username, password);
      console.warn("[apiGet] 重新登录成功，重试请求:", endpoint);
    } catch (e) {
      console.warn("[apiGet] 重新登录失败:", e && e.message || e);
      // 登录失败时仍然尝试重试（用旧 token），但记录日志
      break;
    }
    response = await Widget.http.get(BASE_URL + endpoint, {
      headers: makeHeaders(token),
      params: queryParams
    });
    if (!response || !response.data) {
      throw new Error("重试后仍然失败: " + endpoint);
    }
    raw = response.data;
  }
  if (raw && raw.success === 0) {
    console.warn("[apiGet] 重试后仍然返回 success=0, endpoint:", endpoint, "message:", raw.message || "", "data:", JSON.stringify(raw).slice(0, 500));
  }

  return replaceCDN(raw);
}

// ============================================================
// 磁力获取
// ============================================================

/**
 * 获取一部影片的磁力链接列表
 * @param {string} movieId - JavDB 影片 ID（如 "78vkJ"）
 * @param {object} [creds] - 可选的凭证对象 { username, password }，不传则从 storage 读取
 * @returns {Array<{ name, hash, size, hd, cnsub, files_count, created_at, magnet }>}
 *   按 ①HD ②大小(KB)降序排列，每条包含完整 magnet:?xt=urn:btih:{hash} 链接
 */
async function fetchMovieMagnets(movieId, creds) {
  if (!movieId) return [];
  try {
    if (!creds || !creds.username) {
      creds = await getCredentials();
    }
    var raw = await apiGet("/v1/movies/" + encodeURIComponent(movieId) + "/magnets", {}, creds.username, creds.password);
    if (!raw || raw.success !== 1) return [];

    var magnets = (raw.data && raw.data.magnets) || [];
    // 为每条磁力补上 magnet 链接
    for (var i = 0; i < magnets.length; i++) {
      var m = magnets[i];
      m.magnet = "magnet:?xt=urn:btih:" + (m.hash || "");
    }
    // 排序：HD 优先 → 中文字幕优先 → 按 size(KB) 降序
    magnets.sort(function (a, b) {
      if (a.hd !== b.hd) return a.hd ? -1 : 1;
      if (a.cnsub !== b.cnsub) return a.cnsub ? -1 : 1;
      return (b.size || 0) - (a.size || 0);
    });
    return magnets;
  } catch (e) {
    console.error("[fetchMovieMagnets] 失败:", movieId, e && e.message || e);
    return [];
  }
}

// ============================================================
// Movie → VideoItem
// ============================================================

async function movieToItem(m) {
  var number = m.number || "";
  var title = (number ? number + " " : "") + (m.title || number);
  var releaseDate = m.release_date || "";
  var desc = number;
  if (releaseDate) desc += (desc ? " | " : "") + releaseDate;
  if (m.duration) desc += " | " + m.duration + "分钟";

  var fallbackCover = normalizeJavdbImageUrl(m.cover_url || m.thumb_url || m.cover || m.poster || "");
  var coverCandidates = await buildImageCandidatesFromValue(number || title);
  coverCandidates.posterCandidates = normalizeJavdbImageCandidates(coverCandidates.posterCandidates || []);
  coverCandidates.backdropCandidates = normalizeJavdbImageCandidates(coverCandidates.backdropCandidates || []);
  var posterPath = fallbackCover;
  var backdropPath = fallbackCover;

  if (coverCandidates.strategy === "mgstage") {
    posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, fallbackCover);
    backdropPath = chooseFirstCandidate(coverCandidates.backdropCandidates, fallbackCover);
  } else if (coverCandidates.strategy === "direct-dmm") {
    posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, fallbackCover);
    backdropPath = chooseFirstCandidate(coverCandidates.backdropCandidates, fallbackCover);
  } else if (coverCandidates.posterCandidates && coverCandidates.posterCandidates.length > 0) {
    posterPath = await pickFirstAvailableImageUrl(coverCandidates.posterCandidates, fallbackCover);
    backdropPath = await pickFirstAvailableImageUrl(coverCandidates.backdropCandidates || [], fallbackCover);
  }

  return {
    id: String(m.id || number || title),
    type: "url",
    title: title,
    posterPath: posterPath,
    backdropPath: backdropPath,
    link: "detail:" + (m.id || number) + (number ? ":" + number : ""),
    description: desc,
    mediaType: "movie",
    releaseDate: releaseDate,
    rating: Number(m.score || m.rating || 0),
    duration: m.duration || 0,
    durationText: m.duration ? m.duration + "分钟" : ""
  };
}

async function moviesToItems(movies) {
  if (!movies || movies.length === 0) return [];
  var items = [];
  for (var i = 0; i < movies.length; i++) {
    items.push(await movieToItem(movies[i]));
  }
  return items;
}

async function handleListParams(params) {
  if (params.peopleId) {
    var data = await apiGet("/v1/movies/tags", {
      filter_by: "0:a:" + params.peopleId,
      sort_by: "release",
      order_by: "desc",
      page: Number(params.page || 1),
      limit: LIMIT
    }, params.username, params.password);
    return await moviesToItems(extractMovies(data));
  }
  if (params.genreId) {
    var data = await apiGet("/v2/search", {
      q: params.genreId,
      type: "video",
      page: Number(params.page || 1),
      limit: LIMIT
    }, params.username, params.password);
    return await moviesToItems(extractMovies(data));
  }
}

// ============================================================
// Top250
// ============================================================

async function loadTop250(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var rankingType = params.ranking_type || "all";
  var typeValue = "";
  if (rankingType === "video_type") {
    typeValue = params.type_value || "0";
  } else if (rankingType === "year") {
    typeValue = (params.year_value || "").trim();
    if (!typeValue) {
      return [{ id: "tip", type: "text", title: "请输入年份后再试", description: "在「榜单类型」中选择按年份后，在「年份」输入框中输入年份（如 2024）" }];
    }
  }
  var page = Number(params.page || 1);

  var queryParams = {
    type: rankingType,
    page: page,
    limit: LIMIT,
    start_rank: 1,
    ignore_watched: false
  };

  // 非空时才附加 type_value，避免 ForwardWidget HTTP 层对空字符串参数序列化异常
  if (typeValue) {
    queryParams.type_value = typeValue;
  }

  if (rankingType === "year") {
    console.log("[Top250/year] params:", JSON.stringify(queryParams), "year_value:", params.year_value);
  }

  var data = await apiGet("/v1/movies/top", queryParams, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[Top250] 返回空数据 rankingType:", rankingType, "params:", JSON.stringify(queryParams), "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// 热播榜
// ============================================================

async function loadPlayback(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var period = params.period || "daily";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/rankings/playback", {
    period: period,
    filter_by: "high_score",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[loadPlayback] 返回空数据, period:", period, "page:", page, "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// 有码榜
// ============================================================

async function loadCensored(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var period = params.period || "daily";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/rankings", {
    type: "0",
    period: period,
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[loadCensored] 返回空数据, period:", period, "page:", page, "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// 无码榜
// ============================================================

async function loadUncensored(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var period = params.period || "daily";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/rankings", {
    type: "1",
    period: period,
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[loadUncensored] 返回空数据, period:", period, "page:", page, "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// FC2 榜
// ============================================================

async function loadFC2(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var period = params.period || "daily";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/rankings", {
    type: "3",
    period: period,
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[loadFC2] 返回空数据, period:", period, "page:", page, "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// 中指通每月推荐（内置月度番号列表）
// ============================================================

var MIDDLE_FINGER_DATA = {
  "2025-06": [
    { id: "JUR-354", javdbId: "Ww3pkp", actress: "惠理" },
    { id: "SONE-720", javdbId: "deROGe", actress: "濑户环奈" },
    { id: "MIDA-208", javdbId: "WwVKDp", actress: "中村美羽" },
    { id: "IPZZ-598", javdbId: "BzKMW4", actress: "樱空桃" },
    { id: "SONE-769", javdbId: "82qPRa", actress: "兒玉七海" },
    { id: "MIDA-180", javdbId: "pkx0xe", actress: "小野六花" },
    { id: "MIDA-139", javdbId: "AqE3EM", actress: "百田光希" },
    { id: "MIMK-216", javdbId: "96qpqX", actress: "乙爱丽丝" },
    { id: "SDHS-059", javdbId: "Xe4NnG", actress: "神木丽" },
    { id: "SONE-708", javdbId: "e84P2E", actress: "村上悠华" },
    { id: "SONE-751", javdbId: "qAPWne", actress: "田野忧" },
    { id: "MIDA-200", javdbId: "r3Y4YN", actress: "宫下玲奈" },
    { id: "MIAB-488", javdbId: "96eKe8", actress: "木下日葵" },
    { id: "SONE-776", javdbId: "Rk2WER", actress: "南羽琉" },
    { id: "SONE-563", javdbId: "4Ddxap", title: "S120周年大共演" },
    { id: "SONE-787", javdbId: "2mqXEp", actress: "木村爱心" },
    { id: "DASS-705", javdbId: "xAgOGO", actress: "沙月文奈" },
    { id: "DASS-650", javdbId: "pkqe09", actress: "橘玛丽" },
    { id: "SONE-729", javdbId: "wKkMy1", actress: "神乐桃香" },
    { id: "IPZZ-586", javdbId: "RkG3X4", title: "BEAUTY VENUS THE HARLEM" },
    { id: "PRED-779", javdbId: "degQOQ", actress: "明里紬" },
    { id: "WAAA-511", javdbId: "YwrO3p", actress: "山岸逢花,美谷朱里" }
  ],
  "2025-07": [
    { id: "SONE-566", javdbId: "2mq66Z" },
    { id: "SONE-758", javdbId: "YwrOPe", actress: "瀨戶環奈" },
    { id: "JUR-380", javdbId: "YwrkZd", actress: "惠理" },
    { id: "MDON-077", javdbId: "Xe4DOP" },
    { id: "MIDA-241", javdbId: "AqK7Oe", actress: "宮下玲奈" },
    { id: "START-368", javdbId: "V4NDxq", actress: "唯井真尋,小倉由菜" },
    { id: "DASS-695", javdbId: "2mqx5P", actress: "NIA" },
    { id: "SONE-786", javdbId: "1A437A", actress: "田野憂" },
    { id: "MIDA-235", javdbId: "96qm2X", actress: "UNPAI" },
    { id: "START-355", javdbId: "P92kJN", actress: "本庄鈴" },
    { id: "SONE-807", javdbId: "96qmZ6", actress: "篠真有" },
    { id: "MIDA-234", javdbId: "WwVNmq", actress: "新有菜" },
    { id: "DASS-662", javdbId: "OXW0YO", actress: "橘瑪莉" },
    { id: "OFES-015", javdbId: "0edKXJ", actress: "設樂系日" },
    { id: "DEAB-001", javdbId: "P92AYJ", actress: "葉月美音,塚田詩織" },
    { id: "EYAN-203", javdbId: "kKy8AN", actress: "宮本留衣" },
    { id: "MIDA-198", javdbId: "ZNdw9V", actress: "七澤美亞" },
    { id: "SONE-790", javdbId: "DRVG82", actress: "金松季步" },
    { id: "SONE-793", javdbId: "kKy87e", actress: "明日葉三葉" },
    { id: "PRED-772", javdbId: "82q4nx", actress: "山岸綺花" },
    { id: "OFES-025", javdbId: "kKyvWN", actress: "櫻空桃,長濱蜜璃,役野滿里奈" },
    { id: "SONE-753", javdbId: "AqKB8n", actress: "乃坂日和" },
    { id: "OFES-005", javdbId: "Bzg3w9", actress: "木村玲衣" },
    { id: "SONE-814", javdbId: "ve01rb", actress: "夢乃愛華" },
    { id: "PRED-785", javdbId: "kKy2nV", actress: "明里紬" },
    { id: "IPZZ-599", javdbId: "gyqndG" },
    { id: "MIMK-217", javdbId: "7yq7OP", actress: "佐山愛" },
    { id: "SONE-852", javdbId: "xAg1rV", actress: "七森莉莉" },
    { id: "OFES-001", javdbId: "ZNd6m8", actress: "安位薰" },
    { id: "MIDA-240", javdbId: "82qAg3", actress: "水卜櫻" },
    { id: "ABF-243", javdbId: "bKwbNg", actress: "鈴村愛里" }
  ],
  "2025-08": [
    { id: "SONE-811", javdbId: "ZNdEbV", actress: "瀨戶環奈" },
    { id: "MIRD-259", javdbId: "82qKZ5", actress: "みなと羽琉,Himari" },
    { id: "START-398", javdbId: "XeYGWP", actress: "神木麗" },
    { id: "PRED-792", javdbId: "Ebq2md", actress: "楪カレン" },
    { id: "SONE-855", javdbId: "824qk5", actress: "浅野こころ" },
    { id: "FTAV-013", javdbId: "qAdgwP" },
    { id: "ABF-253", javdbId: "QNWBOK", actress: "鈴村あいり" },
    { id: "SONE-870", javdbId: "kKydWm", actress: "紫堂るい" },
    { id: "MIDA-258", javdbId: "4DdQxv", actress: "百田光稀" },
    { id: "JUR-444", javdbId: "wKkr9b", actress: "神宮寺ナオ" },
    { id: "PKYS-016", javdbId: "Rk2w6n", actress: "伊東める" },
    { id: "MKMP-659", javdbId: "ve0g8O", actress: "乙アリス" },
    { id: "HMN-717", javdbId: "5n4BKz", actress: "七瀬アリス" },
    { id: "START-353", javdbId: "P92Dw9", actress: "青空ひかり" },
    { id: "MIMK-245", javdbId: "4D85gJ", actress: "胡桃さくら" },
    { id: "JUR-390", javdbId: "V4NKRD", actress: "新妻ゆうか" },
    { id: "SONE-851", javdbId: "YwZGgD", actress: "鷲尾めい" },
    { id: "START-375", javdbId: "nKqMbw", actress: "恋渕ももな" },
    { id: "ABF-255", javdbId: "yx4P5W", actress: "涼森れむ" },
    { id: "SONE-853", javdbId: "964qA5", actress: "河北彩花" }
  ],
  "2025-09": [
    { id: "MIMK-233", javdbId: "QNJRq4" },
    { id: "SONE-846", javdbId: "Mb4ZdR" },
    { id: "MKMP-668", javdbId: "mOyR7r" },
    { id: "SDJS-334", javdbId: "V428eq" },
    { id: "HAWA-358", javdbId: "mOJRzd" },
    { id: "FJIN-098", javdbId: "8244rV" },
    { id: "MIDA-317", javdbId: "nKq7ka" },
    { id: "SONE-871", javdbId: "pkO5Xw" },
    { id: "MIDA-277", javdbId: "XeYN5a" },
    { id: "IPZZ-654", javdbId: "Kk6NJA" },
    { id: "DASS-709", javdbId: "964wNX" },
    { id: "SONE-889", javdbId: "RkJRV7" },
    { id: "MNGS-013", javdbId: "mOyBRd" },
    { id: "START-411", javdbId: "J0VbO8" },
    { id: "DASS-729", javdbId: "0e6w07" },
    { id: "DLDSS-289", javdbId: "82Ve1d" },
    { id: "JUR-479", javdbId: "wK5XGb" },
    { id: "SONE-905", javdbId: "wK5J7D" },
    { id: "PRED-799", javdbId: "e82Mdp" },
    { id: "MIDA-324", javdbId: "a8qQ93" },
    { id: "WSA-002", javdbId: "NQqJW4" },
    { id: "MIAB-539", javdbId: "mOyPOR" },
    { id: "SONE-891", javdbId: "YwZNkp" },
    { id: "SXLF-002", javdbId: "ZNp6pP" },
    { id: "MOON-047", javdbId: "kK3gv4" },
    { id: "SONE-860", javdbId: "DRWq83" },
    { id: "IPZZ-694", javdbId: "xAb03E" },
    { id: "PRED-804", javdbId: "ZNpXDV" }
  ],
  "2025-10": [
    { id: "SONE-912", javdbId: "5n40z8", actress: "瀬戸環奈" },
    { id: "MIMK-249", javdbId: "NQqJMZ", actress: "吉根ゆりあ" },
    { id: "PRED-809", javdbId: "OX8WMD", actress: "楪カレン" },
    { id: "HMN-755", javdbId: "BzWvDr" },
    { id: "IPZZ-671", javdbId: "2mGapZ", actress: "西宮ゆめ" },
    { id: "SONE-978", javdbId: "kKQz2m", actress: "みなみ羽琉" },
    { id: "JUR-557", javdbId: "QNzgMG", actress: "城ヶ崎百瀬" },
    { id: "START-406", javdbId: "J01W6B", actress: "MINAMO" },
    { id: "SONE-977", javdbId: "QNzVgq", actress: "南沢海香,小日向みゆう" },
    { id: "SONE-964", javdbId: "Rk4dbm", actress: "篠真有" },
    { id: "IPZZ-734", javdbId: "V42w1D", actress: "ひなの花音" },
    { id: "SONE-919", javdbId: "r3DQ1Z", actress: "夢乃あいか,奥田咲" },
    { id: "SIVR-440", javdbId: "r3eyrD", actress: "夢乃あいか,奥田咲" },
    { id: "MIDA-359", javdbId: "e82RwN", actress: "五条恋" },
    { id: "MIDA-344", javdbId: "EbqweQ", actress: "輝星きら" },
    { id: "SONE-920", javdbId: "pk43mE", actress: "miru" },
    { id: "MIMK-253", javdbId: "96YqG6", actress: "斎藤あみり" },
    { id: "CJOD-489", javdbId: "gyeb9Z", actress: "紗愛さん" },
    { id: "SORA-613", javdbId: "V4PqmA", actress: "Melody Marks" },
    { id: "SONE-937", javdbId: "82eVy5", actress: "紫堂るい" },
    { id: "SONE-969", javdbId: "Aq9z0e", actress: "渡部ほ" },
    { id: "MDON-083", javdbId: "7yGN4B", actress: "篠原いよ" },
    { id: "MDON-084", javdbId: "e8Ey2p", actress: "めぐり" },
    { id: "SONE-970", javdbId: "V4215W", actress: "鷲尾めい" },
    { id: "MIDA-346", javdbId: "6d4Zbn", actress: "百田光稀" },
    { id: "MIRD-264", javdbId: "7y4pXb", actress: "葵いぶき,石原希望,未歩なな,古川ほのか" },
    { id: "MIAB-385", javdbId: "qAQ2aN", actress: "辻井ほのか" },
    { id: "MIDA-366", javdbId: "Ywxrgp", actress: "七沢みあ" },
    { id: "JUR-494", javdbId: "pk4Xgq", actress: "七海ティナ" },
    { id: "MIDA-368", javdbId: "1Aa40d", actress: "宮下玲奈" },
    { id: "START-424", javdbId: "KkgGKb", actress: "青空ひかり" },
    { id: "ABF-280", javdbId: "verMmY", actress: "八掛うみ" }
  ],
  "2025-11": [
    { id: "IPZZ-698", javdbId: "0eJQ6k" },
    { id: "IPVR-317", javdbId: "J0dz0W" },
    { id: "SNOS-001", javdbId: "DRNmxJ" },
    { id: "MIDA-290", javdbId: "P9PAVX" },
    { id: "PRED-819", javdbId: "qAn196" },
    { id: "IPZZ-708", javdbId: "pk4AOk" },
    { id: "START-463", javdbId: "2m0gpp" },
    { id: "MIDA-348", javdbId: "nKWGqm" },
    { id: "IPZZ-899", javdbId: "NGxx" },
    { id: "MIDA-389", javdbId: "J01W7q" },
    { id: "DASS-800", javdbId: "3nEqGz" },
    { id: "MIDA-383", javdbId: "z4eYBE" },
    { id: "START-443", javdbId: "kKeY4z" },
    { id: "JERA-026", javdbId: "GZzrzb" },
    { id: "AKDL-332", javdbId: "kKyNkJ" },
    { id: "MIDA-356", javdbId: "OX8kVO" },
    { id: "SONE-968", javdbId: "qAnmJ6" },
    { id: "MIDA-400", javdbId: "xAr1yV" },
    { id: "MIAB-565", javdbId: "2mGY2Z" },
    { id: "SNOS-025", javdbId: "7yGgq1" },
    { id: "START-453", javdbId: "ZNvqXJ" },
    { id: "MIAB-554", javdbId: "Ebzrz2" },
    { id: "START-425", javdbId: "3nEwJD" },
    { id: "MIAB-586", javdbId: "WwyYY7" },
    { id: "SONE-974", javdbId: "e8EXO1" },
    { id: "SONE-954", javdbId: "2mGJqB" },
    { id: "START-423", javdbId: "RkYGdR" },
    { id: "PRED-812", javdbId: "3nEVXe" },
    { id: "MVSD-662", javdbId: "kKQ0Xe" },
    { id: "JUFE-590", javdbId: "Aq91XO" },
    { id: "SONE-976", javdbId: "7yGMqR" },
    { id: "DASS-769", javdbId: "4DGY2b" },
    { id: "YMDS-235", javdbId: "Aq9NQy" },
    { id: "JUR-053", javdbId: "4DGYda" },
    { id: "SONE-998", javdbId: "7yGVJB" },
    { id: "CJOD-488", javdbId: "bKXpRv" },
    { id: "FTAV-014", javdbId: "1AMWNA" }
  ],
  "2025-12": [
    { id: "SONE-991", javdbId: "6dRezE", actress: "瀬戸環奈" },
    { id: "MIDA-439", javdbId: "4DA4Ab", actress: "新有菜" },
    { id: "MIDA-473", javdbId: "qAxqn9" },
    { id: "MIDA-490", javdbId: "e8qDEd" },
    { id: "MDVR-374", javdbId: "a8epx4" },
    { id: "MKMP-690", javdbId: "YwmqB8", actress: "乙アリス" },
    { id: "MIKR-055", javdbId: "Kkq4p0", actress: "佐々木あき" },
    { id: "IPZZ-719", javdbId: "ZNvqm8", actress: "桜空もも" },
    { id: "FPRE-212", javdbId: "2m0rqy", actress: "桃園怜奈,宍戸里帆" },
    { id: "MIDA-387", javdbId: "e8qKNb", actress: "石川澪" },
    { id: "START-473", javdbId: "DRKwDJ", actress: "神木麗" },
    { id: "URE-129", javdbId: "ZNv9RJ", actress: "逢見リカ,椿りか" },
    { id: "DASS-777", javdbId: "P9GMk0", actress: "北野未奈" },
    { id: "IPZZ-727", javdbId: "GZwdb7", actress: "佐々木さき" },
    { id: "SNOS-008", javdbId: "a8eBd3", actress: "紫堂るい" },
    { id: "FPRE-210", javdbId: "xA4vME", actress: "姫咲はな" },
    { id: "MIDA-446", javdbId: "NQg7PZ", actress: "石原希望" },
    { id: "MIRD-270", javdbId: "0ep2d3" },
    { id: "SNOS-033", javdbId: "P9GY70", actress: "未歩なな" },
    { id: "IPZZ-740", javdbId: "Ywmqv8", actress: "山田鈴奈" },
    { id: "START-478", javdbId: "BzV3gO", actress: "星乃莉子" },
    { id: "MIDA-410", javdbId: "Kkq42M", actress: "松本いちか" },
    { id: "IPZZ-751", javdbId: "1AMyzJ", actress: "西宮ゆめ,坂道みる" },
    { id: "ABF-293", javdbId: "J0d69x", actress: "鈴村あいり" },
    { id: "HMN-746", javdbId: "3nkJwD", actress: "美谷朱音" },
    { id: "DASS-770", javdbId: "7y2K7d" },
    { id: "MIUM-423", javdbId: "QnBk8" }
  ],
  "2026-01": [
    { id: "SNOS-037", javdbId: "wKV24B", actress: "紫堂るい" },
    { id: "IPZZ-743", javdbId: "2m06XP", actress: "佐々木さき" },
    { id: "MIDA-458", javdbId: "829ybO", actress: "輝星きら" },
    { id: "PRED-832", javdbId: "Eb43yJ", actress: "山岸あや花" },
    { id: "ABF-306", javdbId: "kKeEze", actress: "涼森れむ" },
    { id: "MIAB-588", javdbId: "wKVdEb", actress: "辻井ほのか" },
    { id: "DVAJ-724", javdbId: "ve32zW", actress: "辻井ほのか" },
    { id: "SNOS-038", javdbId: "BzV2a9", actress: "瀬戸環奈" },
    { id: "IPZZ-703", javdbId: "J0d7P8", actress: "楓カレン" },
    { id: "SNOS-066", javdbId: "4DAXDb", actress: "木村愛心" },
    { id: "MIDA-493", javdbId: "a8eJMp", actress: "井上もも" },
    { id: "DASS-821", javdbId: "kKe2q6", actress: "白峰ミウ" },
    { id: "JUR-589", javdbId: "NQgMbN", actress: "めぐり" },
    { id: "ACHJ-078", javdbId: "RkYN27", actress: "竹内有紀" },
    { id: "IPZZ-748", javdbId: "QN2A7p", actress: "三澄寧々" },
    { id: "EBWH-294", javdbId: "ZNv6WA", actress: "柏木ふみか" },
    { id: "MVSD-673", javdbId: "ve36Y9", actress: "宍戸里帆" },
    { id: "PRED-833", javdbId: "Eb437J", actress: "三好佑香" },
    { id: "MIDA-470", javdbId: "P9GrN0", actress: "福田ゆあ" },
    { id: "SNOS-073", javdbId: "6dRV5Z", actress: "みなみ羽琉" },
    { id: "ABF-314", javdbId: "OXr2zv", actress: "三佳詩" },
    { id: "HMN-779", javdbId: "bKE6Na", actress: "由良かな" },
    { id: "MIDA-474", javdbId: "GZw3eD", actress: "うんぱい" },
    { id: "SNOS-017", javdbId: "yxd6zX", actress: "金松季歩" },
    { id: "START-480", javdbId: "RkX6vm", actress: "小笠原菜乃" },
    { id: "YMDD-478", javdbId: "XeAJD5", actress: "逢沢みゆ" },
    { id: "SNOS-049", javdbId: "0ep7EJ", actress: "miru" }
  ],
  "2026-02": [
    { id: "SNOS-064", javdbId: "a8VKP4", actress: "瀨戶環奈" },
    { id: "JUR-636", javdbId: "r34v9z", actress: "桃園伶奈" },
    { id: "MNGS-039", javdbId: "P9J0q2", actress: "春陽萌花" },
    { id: "HMN-786", javdbId: "3nW9O9", actress: "春陽萌花" },
    { id: "MIDA-506", javdbId: "deQga9", actress: "松本一香" },
    { id: "MIDA-546", javdbId: "pkeYgq", actress: "松本一香" },
    { id: "SNOS-112", javdbId: "6dWQ8a", actress: "紫堂留衣" },
    { id: "DASS-787", javdbId: "NQ6mB4", actress: "橘瑪莉" },
    { id: "MNGS-040", javdbId: "GZn45b", actress: "七瀨愛麗絲" },
    { id: "IPZZ-820", javdbId: "EbnOVJ", actress: "林芽依" },
    { id: "SNOS-111", javdbId: "2mXD0p", actress: "石田佳蓮" },
    { id: "MNGS-038", javdbId: "NQ6Pvx", actress: "蓮實克蕾兒" },
    { id: "EBWH-302", javdbId: "J0nGOz", actress: "莉莉遙香" },
    { id: "START-518", javdbId: "2mXx9Z", actress: "戀淵桃菜,星乃莉子" },
    { id: "SNOS-095", javdbId: "OXrRE8", actress: "木村愛心" },
    { id: "EBWH-298", javdbId: "RkXA5n", actress: "清宮仁愛" },
    { id: "MIDA-524", javdbId: "6dWwxQ", actress: "篠真有" },
    { id: "SNOS-079", javdbId: "BzPOQ6", actress: "白上咲花" },
    { id: "MIAB-585", javdbId: "kKbqOV", actress: "波多野結衣" },
    { id: "PPPE-395", javdbId: "bKORgE", actress: "中山文香" },
    { id: "MIKR-075", javdbId: "2mXwVX", actress: "白濱果步" },
    { id: "SNOS-085", javdbId: "xAO34B", actress: "川越仁子" },
    { id: "MIDA-518", javdbId: "AqnMKK", actress: "宮下玲奈" },
    { id: "IPZZ-750", javdbId: "kKbrPP", actress: "長濱蜜璃" },
    { id: "DASS-870", javdbId: "de37R8", actress: "黑川堇" },
    { id: "HNDS-082", javdbId: "MbKZ4X", title: "本中" },
    { id: "MIRD-274", javdbId: "0e4dnk", title: "MOODYZ" },
    { id: "DVMM-352", javdbId: "2mXw2B", actress: "推川悠里" },
    { id: "MKMP-702", javdbId: "96yKWV", actress: "推川悠里" },
    { id: "ABF-315", javdbId: "RkXJMR", actress: "鈴村愛里" },
    { id: "MUDR-339", javdbId: "MbKZYQ", actress: "姬咲華" }
  ],
  "2026-03": [
    { id: "ABF-326", javdbId: "deQ5zB", actress: "鈴村愛里" },
    { id: "SNOS-161", javdbId: "BzPp5O", actress: "白上咲花" },
    { id: "IPZZ-789", javdbId: "7yYeJd", actress: "金松季步,长濱蜜璃" },
    { id: "SNOS-106", javdbId: "Kkr5AP", actress: "金松季步" },
    { id: "MIKR-082", javdbId: "82ZYEO", actress: "森日向子" },
    { id: "START-498", javdbId: "MbKMG1", actress: "青空光,神木麗" },
    { id: "START-539", javdbId: "0e4Qqk", actress: "神木麗" },
    { id: "SNOS-093", javdbId: "OXr49A", actress: "瀨戶環奈" },
    { id: "MIDA-533", javdbId: "z4b9O7", actress: "石川澪" },
    { id: "SNOS-146", javdbId: "7yYWmR", actress: "渡部穗乃" },
    { id: "IPZZ-814", javdbId: "6dWO29", actress: "佐佐木紗希望" },
    { id: "MIMK-268", javdbId: "1AWgNA", actress: "JULIA" },
    { id: "JUR-633", javdbId: "gyQKMN", actress: "惠理" },
    { id: "SNOS-152", javdbId: "yx5AJr", actress: "安達夕莉" },
    { id: "SNOS-144", javdbId: "gyQKmy", actress: "神樂桃香" },
    { id: "HMN-812", javdbId: "BzP9V4", actress: "愛花未滿" },
    { id: "ABF-328", javdbId: "bKO2xA", actress: "涼森鈴夢" },
    { id: "ADN-764", javdbId: "a8VD6p", actress: "白峰美羽" },
    { id: "IPZZ-781", javdbId: "MbK5rP", actress: "櫻空桃" },
    { id: "IPZZ-802", javdbId: "1AWqnw", actress: "楓可憐" },
    { id: "MIDA-558", javdbId: "wKgApb", actress: "水卜櫻" },
    { id: "SNOS-135", javdbId: "XeVxmJ", actress: "南羽琉" },
    { id: "ATID-663", javdbId: "P9JY30", actress: "栗山莉" },
    { id: "ABF-330", javdbId: "J0ngyA", actress: "瀧本雫葉" },
    { id: "IPZZ-788", javdbId: "pkeVwB", actress: "三澄寧々" }
  ],
  "2026-04": [
    { id: "SNOS-131", javdbId: "Ebn763", actress: "瀬戸環奈" },
    { id: "JUR-687", javdbId: "5nb7B7", actress: "藤浦めぐ" },
    { id: "JUVR-276", javdbId: "bKOk9a", actress: "藤浦めぐ" },
    { id: "REBD-1026", javdbId: "bKO6NA", actress: "藤浦めぐ" },
    { id: "MANX-028", javdbId: "2mXMqW", actress: "藤浦めぐ" },
    { id: "ABF-336", javdbId: "OXr0dA", actress: "鈴村あいり" },
    { id: "EBWH-322", javdbId: "GZnVnb", actress: "柏木ふみか" },
    { id: "START-540", javdbId: "V4V3YX", actress: "本庄鈴" },
    { id: "IPZZ-846", javdbId: "96p7eE", actress: "ひなの花音" },
    { id: "MNGS-052", javdbId: "qAb0n6", actress: "春陽モカ" },
    { id: "MIDA-581", javdbId: "V4VM8A", actress: "松本いちか" },
    { id: "START-542", javdbId: "veybyY", actress: "神木麗" },
    { id: "SNOS-165", javdbId: "mOb6gv", actress: "みなと羽琉" },
    { id: "ABF-338", javdbId: "82Z8AE", actress: "涼森れむ" },
    { id: "SNOS-115", javdbId: "4Dx3dZ", actress: "博多彩葉" },
    { id: "MIDA-597", javdbId: "ZNxGvX", actress: "水卜さくら" },
    { id: "START-548", javdbId: "1AWGW9", actress: "青空ひかり" },
    { id: "MIDA-573", javdbId: "7yYDK1", actress: "輝星きら" },
    { id: "SNOS-167", javdbId: "3nW4r0", actress: "紫堂るい" },
    { id: "MIMK-274", javdbId: "r34kYD", actress: "奥田咲,美園和花" },
    { id: "SNOS-150", javdbId: "xAO2DO", actress: "明日葉みつは" },
    { id: "MIDA-641", javdbId: "QNrMW7", actress: "篠真有" },
    { id: "DASS-881", javdbId: "P9JkGX", actress: "宍戸里帆" },
    { id: "MIDA-574", javdbId: "P9JxMr", actress: "石川澪" },
    { id: "MKMP-718", javdbId: "MbKpYP", actress: "乙アリス" }
  ],
  "2026-05": [
    { id: "SNOS-183", javdbId: "AqnZBM", actress: "瀨戶環奈" },
    { id: "SNOS-233", javdbId: "P91MB9", actress: "河北彩花" },
    { id: "MIRD-277", javdbId: "Ebnw8Q", title: "MOODYZ粉絲感謝祭" },
    { id: "DASS-945", javdbId: "1AWGVZ", actress: "彩月七緒" },
    { id: "JUR-753", javdbId: "Ebn8eJ", actress: "彩月七緒" },
    { id: "MIDA-590", javdbId: "veyJmG", actress: "筱真有,百田光希" },
    { id: "SNOS-207", javdbId: "Xe7qkM", actress: "渡部穗乃" },
    { id: "CJOD-514", javdbId: "Yw3qD6", actress: "辻井穗乃果" },
    { id: "JUR-752", javdbId: "Xe7q94", actress: "沙月芽衣" },
    { id: "IPZZ-827", javdbId: "OXrnmO", actress: "三澄寧寧" },
    { id: "JUR-708", javdbId: "e8D4Qx", actress: "愛弓涼" },
    { id: "EBWH-332", javdbId: "Yw3w2x", actress: "柏木文香" },
    { id: "SNOS-240", javdbId: "r3zPar", actress: "村上悠華" },
    { id: "SNOS-217", javdbId: "qAqPrP", actress: "南羽琉" },
    { id: "MIDA-633", javdbId: "5nNnO7", actress: "水卜櫻" },
    { id: "DASS-943", javdbId: "6dveKK", actress: "白峰美羽" },
    { id: "SNOS-166", javdbId: "RkX3Rp", actress: "安達夕莉,新木希空" },
    { id: "MIRD-283", javdbId: "NQ7QO3", actress: "仲村美羽,佐佐木明希" },
    { id: "JYMA-105", javdbId: "r3zPkq", actress: "波多野結衣" },
    { id: "SNOS-237", javdbId: "96ne7V", actress: "淺野心" },
    { id: "MIDA-624", javdbId: "wKgzb1", actress: "葵伊吹" },
    { id: "SNOS-192", javdbId: "z4bnYE", actress: "紫堂留衣" },
    { id: "MDHR-002", javdbId: "YwG60d", actress: "月野江翠" },
    { id: "MIRD-278", javdbId: "2mr8By", actress: "松本一香,春陽萌花,七瀨愛麗絲" }
  ]
};

async function loadMiddleFingerRecommend(params) {
  // sort_by 有选择时优先切换月份，无选择时用 month
  var month = params.sort_by || params.month || "2026-05";
  var list = MIDDLE_FINGER_DATA[month];
  if (!list || list.length === 0) {
    return [{ id: "tip", type: "text", title: "暂无推荐数据" }];
  }

  var page = Number(params.page || 1);
  var limit = LIMIT;
  var offset = (page - 1) * limit;
  var pageList = list.slice(offset, offset + limit);

  if (pageList.length === 0) {
    return [];
  }

  var items = [];

  for (var i = 0; i < pageList.length; i++) {
    var entry = pageList[i];
    var number = entry.id;
    var javdbId = entry.javdbId || "";

    // 用番号猜测封面（DMM/mgstage 规则，无需 API 调用）
    var coverCandidates = await buildImageCandidatesFromValue(number);
    var posterPath = "";
    var backdropPath = "";
    if (coverCandidates.strategy === "mgstage" || coverCandidates.strategy === "direct-dmm") {
      posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, "");
      backdropPath = chooseFirstCandidate(coverCandidates.backdropCandidates || [], "");
    } else if (javdbId) {
      // 非白名单番号：从 JavDB ID 拼封面 URL
      var prefix = javdbId.substring(0, 2).toLowerCase();
      posterPath = normalizeJavdbImageUrl("https://tp.cmastd.com/rhe951l4q/covers/" + prefix + "/" + javdbId + ".jpg");
      backdropPath = posterPath;
    }

    var descParts = [];
    if (entry.title) descParts.push(entry.title);
    if (entry.actress) descParts.push("演员: " + entry.actress);
    descParts.push(month);
    var description = descParts.join(" | ");

    items.push({
      id: number,
      type: "url",
      title: number,
      posterPath: posterPath,
      backdropPath: backdropPath,
      link: javdbId ? "detail:" + javdbId + ":" + number : "detail:" + number,
      description: description,
      mediaType: "movie"
    });
  }

  return items;
}

// ============================================================
// DMM 女优月度榜单 TOP100
// ============================================================

var DMM_ACTORS_DATA = [
  { rank: 1,  name: "逢沢みゆ",           javdbId: "zK98J" },
  { rank: 2,  name: "瀬戸環奈",           javdbId: "neRNX" },
  { rank: 3,  name: "波多野結衣",         javdbId: "R2Vg" },
  { rank: 4,  name: "河北彩花",           javdbId: "EvkJ" },
  { rank: 5,  name: "彩月七緒",           javdbId: "RdEb4" },
  { rank: 6,  name: "石川澪",             javdbId: "QV0p9" },
  { rank: 7,  name: "北岡果林",           javdbId: "J2q7B" },
  { rank: 8,  name: "幸村泉希",           javdbId: "k47Az" },
  { rank: 9,  name: "博多彩葉",           javdbId: "zKgPW" },
  { rank: 10, name: "小野坂ゆいか",       javdbId: "9Dx0R" },
  { rank: 11, name: "水卜さくら",         javdbId: "0edE" },
  { rank: 12, name: "桃乃木かな",         javdbId: "0dKX" },
  { rank: 13, name: "涼森れむ",           javdbId: "KxPb" },
  { rank: 14, name: "鷲尾めい",           javdbId: "xpbA" },
  { rank: 15, name: "紫堂るい",           javdbId: "bA2yd" },
  { rank: 16, name: "森沢かな",           javdbId: "A0Qy" },
  { rank: 17, name: "宍戸里帆",           javdbId: "meyzd" },
  { rank: 18, name: "羽月乃蒼",           javdbId: "J2z7B" },
  { rank: 19, name: "JULIA",              javdbId: "1KBW" },
  { rank: 20, name: "鈴村あいり",         javdbId: "nRKm" },
  { rank: 21, name: "浅野こころ",         javdbId: "me7mM" },
  { rank: 22, name: "愛花未滿",         javdbId: "YnwDp" },
  { rank: 23, name: "早坂奏音",           javdbId: "VwnPz" },
  { rank: 24, name: "井上もも",           javdbId: "0R1n3" },
  { rank: 25, name: "糸井瑠花",           javdbId: "eK5gr" },
  { rank: 26, name: "小那海あや",         javdbId: "Mm1YA" },
  { rank: 27, name: "神宮寺ナオ",         javdbId: "ZzNm" },
  { rank: 28, name: "伊藤舞雪",           javdbId: "YgJx" },
  { rank: 29, name: "花守夏歩",           javdbId: "D2EdJ" },
  { rank: 30, name: "宮下玲奈",           javdbId: "YnZ1K" },
  { rank: 31, name: "美園和花",           javdbId: "qA0N" },
  { rank: 32, name: "木村愛心",           javdbId: "yrRx0" },
  { rank: 33, name: "白上咲花",           javdbId: "bAv5g" },
  { rank: 34, name: "楪カレン",           javdbId: "p3kMZ" },
  { rank: 35, name: "月野かすみ",         javdbId: "znyb" },
  { rank: 36, name: "依本しおり",         javdbId: "xv6BV" },
  { rank: 37, name: "田野憂",             javdbId: "8VOMx" },
  { rank: 38, name: "小日向みゆう",       javdbId: "O2qxB" },
  { rank: 39, name: "葉山さゆり",         javdbId: "1B0AA" },
  { rank: 40, name: "新井リマ",           javdbId: "E2vOx" },
  { rank: 41, name: "北野未奈",           javdbId: "ZXy46" },
  { rank: 42, name: "吉根ゆりあ",         javdbId: "0Bw3" },
  { rank: 43, name: "明日葉みつは",       javdbId: "658kM" },
  { rank: 44, name: "長浜みつり",         javdbId: "zK9pQ" },
  { rank: 45, name: "黒島玲衣",           javdbId: "XWGG5" },
  { rank: 46, name: "小野六花",           javdbId: "zvK7" },
  { rank: 47, name: "園梨音",             javdbId: "eKbnd" },
  { rank: 48, name: "木下凛々子",         javdbId: "Wb1B" },
  { rank: 49, name: "楓ふうあ",           javdbId: "0RkDa" },
  { rank: 50, name: "七沢みあ",           javdbId: "NPD3" },
  { rank: 51, name: "夢乃あいか",         javdbId: "AbBK" },
  { rank: 52, name: "木下ひまり",         javdbId: "MW44" },
  { rank: 53, name: "明里つむぎ",         javdbId: "M4Q7" },
  { rank: 54, name: "八掛うみ",           javdbId: "p33Qb" },
  { rank: 55, name: "愛才りあ",           javdbId: "RdEyz" },
  { rank: 56, name: "巴ひかり",           javdbId: "W1PvB" },
  { rank: 57, name: "miru",               javdbId: "vd5z" },
  { rank: 58, name: "葵いぶき",           javdbId: "JbER" },
  { rank: 59, name: "柏木ふみか",         javdbId: "qDYDe" },
  { rank: 60, name: "七ツ森りり",         javdbId: "Ewa2" },
  { rank: 61, name: "大槻ひびき",         javdbId: "BKMM" },
  { rank: 62, name: "東條なつ",           javdbId: "A6zy" },
  { rank: 63, name: "桃園怜奈",           javdbId: "83V" },
  { rank: 64, name: "白石透羽",           javdbId: "zKgQ5" },
  { rank: 65, name: "金松季歩",           javdbId: "RdZe8" },
  { rank: 66, name: "村上悠華",           javdbId: "xvPx8" },
  { rank: 67, name: "安達夕莉",           javdbId: "O21k8" },
  { rank: 68, name: "森日向子",           javdbId: "bkxd" },
  { rank: 69, name: "本庄鈴",             javdbId: "BzpA" },
  { rank: 70, name: "夏目彩春",           javdbId: "kek6" },
  { rank: 71, name: "藤かんな",           javdbId: "p3DYE" },
  { rank: 72, name: "奥田咲",             javdbId: "wVVz" },
  { rank: 73, name: "九野ひなの",         javdbId: "g0W2Z" },
  { rank: 74, name: "友田真希",           javdbId: "Ab9n" },
  { rank: 75, name: "新妻ゆうか",         javdbId: "QVEBJ" },
  { rank: 76, name: "九井スナオ",         javdbId: "352Ow" },
  { rank: 77, name: "竹内有紀",           javdbId: "pZae" },
  { rank: 78, name: "石原希望",           javdbId: "QO2M" },
  { rank: 79, name: "風間ゆみ",           javdbId: "82m3" },
  { rank: 80, name: "鈴木希",             javdbId: "8VGE5" },
  { rank: 81, name: "天月あず",           javdbId: "90Rp" },
  { rank: 82, name: "白峰ミウ",           javdbId: "W1wee" },
  { rank: 83, name: "由良かな",           javdbId: "k43we" },
  { rank: 84, name: "八木奈々",           javdbId: "gEkm" },
  { rank: 85, name: "美咲かんな",         javdbId: "8Nqa" },
  { rank: 86, name: "福田ゆあ",           javdbId: "nen2w" },
  { rank: 87, name: "凪ひかる",           javdbId: "1G09" },
  { rank: 88, name: "紗倉まな",           javdbId: "J9dd" },
  { rank: 89, name: "天馬ゆい",           javdbId: "k4rwN" },
  { rank: 90, name: "純白彩永",           javdbId: "65PEn" },
  { rank: 91, name: "日向由奈",           javdbId: "p39RE" },
  { rank: 92, name: "西宮ゆめ",           javdbId: "7BX1" },
  { rank: 93, name: "MINAMO",             javdbId: "k4O90" },
  { rank: 94, name: "桜空もも",           javdbId: "bvWB" },
  { rank: 95, name: "小松空",             javdbId: "k4MbY" },
  { rank: 96, name: "河合あすな",         javdbId: "69A0" },
  { rank: 97, name: "北条麻妃",           javdbId: "wZxm" },
  { rank: 98, name: "守屋よしの",         javdbId: "Mm1qA" },
  { rank: 99, name: "莉々はるか",         javdbId: "vNKW" },
  { rank: 100,name: "森下茉莉",           javdbId: "QVy9n" }
];

async function loadDMMRanking(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var actressId = params.actress || "zK98J";
  var sortBy = params.sort_by || "release";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/movies/tags", {
    filter_by: "0:a:" + actressId,
    sort_by: sortBy,
    order_by: "desc",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  var movies = extractMovies(data);
  if (!movies || movies.length === 0) {
    console.warn("[loadDMMRanking] 返回空数据, actressId:", actressId, "sort:", sortBy, "page:", page, "response:", JSON.stringify(data).slice(0, 500));
  }

  return await moviesToItems(movies);
}

// ============================================================
// DMM 月度榜单 TOP100（FANZA 月间 AV 女优/作品综合排名）
// ============================================================

var DMM_MONTHLY_DATA = [
  { rank:1,  cid:"SQTE-633",   javdbId:"deGg95",   actress:"依本しおり" },
  { rank:2,  cid:"SNOS-183",   javdbId:"AqnZBM",   actress:"瀬戸環奈" },
  { rank:3,  cid:"SONE-615",   javdbId:"DROqWa",   actress:"瀬戸環奈" },
  { rank:4,  cid:"SNOS-093",   javdbId:"OXr49A",   actress:"瀬戸環奈" },
  { rank:5,  cid:"SNOS-038",   javdbId:"BzV2a9",   actress:"瀬戸環奈" },
  { rank:6,  cid:"VRKM-1777",  javdbId:"z4VRn6" },
  { rank:7,  cid:"NQTD-022",   javdbId:"kKyyOY" },
  { rank:8,  cid:"OFJE-594",   javdbId:"5nmPxz",   actress:"河北彩花 他" },
  { rank:9,  cid:"SNOS-149",   javdbId:"82ZzAO",   actress:"博多彩葉" },
  { rank:10, cid:"MIDA-459",   javdbId:"96yg9q",   actress:"石川澪" },
  { rank:11, cid:"SAVR-1001",  javdbId:"82ZndV" },
  { rank:12, cid:"OFJE-512",   javdbId:"YwqX4e",   actress:"河北彩花 他" },
  { rank:13, cid:"MIZD-432",   javdbId:"2mKmkW",   actress:"水卜さくら" },
  { rank:14, cid:"MIZD-441",   javdbId:"pkPwqb",   actress:"篠田ゆう" },
  { rank:15, cid:"SNOS-233",   javdbId:"P91MB9",   actress:"河北彩花" },
  { rank:16, cid:"MIDA-470",   javdbId:"P9GrN0",   actress:"福田ゆあ" },
  { rank:17, cid:"SNOS-037",   javdbId:"wKV24B",   actress:"紫堂るい" },
  { rank:18, cid:"HSODA-098",  javdbId:"6dR7wE",   actress:"望実かなえ" },
  { rank:19, cid:"MIMK-267",   javdbId:"Ebnwx4",   actress:"石川澪" },
  { rank:20, cid:"START-373",  javdbId:"yxn5da",   actress:"青空ひかり" },
  { rank:21, cid:"MIRD-253",   javdbId:"OXKbpA",   actress:"小野六花 他" },
  { rank:22, cid:"SQTE-683",   javdbId:"GZPZED",   actress:"花守夏歩" },
  { rank:23, cid:"SIVR-444",   javdbId:"1A8YRd",   actress:"瀬戸環奈" },
  { rank:24, cid:"BLOR-289",   javdbId:"e87Yyd" },
  { rank:25, cid:"NAMH-064",   javdbId:"EbPOWQ",   actress:"花守夏歩" },
  { rank:26, cid:"ADN-762",    javdbId:"4Dxv7p",   actress:"幸村泉希" },
  { rank:27, cid:"MIMK-159",   javdbId:"xAvRAn",   actress:"五日市芽依" },
  { rank:28, cid:"SAVR-1028",  javdbId:"MbKgp4",   actress:"小那海あや 他" },
  { rank:29, cid:"SODS-082",   javdbId:"r34n3A",   actress:"MINAMO" },
  { rank:30, cid:"DSS-246",    javdbId:"5nNnEz" },
  { rank:31, cid:"SONE-641",   javdbId:"e8pz4b",   actress:"鷲尾めい" },
  { rank:32, cid:"SNOS-166",   javdbId:"RkX3Rp",   actress:"安達夕莉,新木希空" },
  { rank:33, cid:"SGKI-080",   javdbId:"5nbD8z" },
  { rank:34, cid:"SONE-638",   javdbId:"RkG2b8",   actress:"瀬戸環奈" },
  { rank:35, cid:"STZY-019",   javdbId:"DRN64a",   actress:"小笠原菜乃" },
  { rank:36, cid:"MIDA-533",   javdbId:"z4b9O7",   actress:"石川澪" },
  { rank:37, cid:"NAMH-038",   javdbId:"gyzrKE",   actress:"本城はな" },
  { rank:38, cid:"3DSVR-1786", javdbId:"6dRGAZ",   actress:"MINAMO" },
  { rank:39, cid:"PFES-115",   javdbId:"DRnkPJ",   actress:"莉々はるか 他" },
  { rank:40, cid:"MKMP-660",   javdbId:"1A47p4",   actress:"羽月乃蒼" },
  { rank:41, cid:"START-285V", javdbId:"Ww3YRQ",   actress:"神木麗" },
  { rank:42, cid:"MURIKURI-009",javdbId:"gyQ9RE" },
  { rank:43, cid:"MIDA-493",   javdbId:"a8eJMp",   actress:"井上もも" },
  { rank:44, cid:"SONE-682",   javdbId:"pkxmQk",   actress:"瀬戸環奈" },
  { rank:45, cid:"MIRD-277",   javdbId:"Ebnw8Q",   actress:"八木奈々 他" },
  { rank:46, cid:"SIVR-467",   javdbId:"96pBnV",   actress:"紫堂るい" },
  { rank:47, cid:"URVRSP-527", javdbId:"deQw3M",   actress:"西元めいさ" },
  { rank:48, cid:"RKI-698",    javdbId:"96dX4E",   actress:"逢沢みゆ" },
  { rank:49, cid:"MIZD-502",   javdbId:"5nmEaB",   actress:"小野六花 他" },
  { rank:50, cid:"GQHB-024",   javdbId:"6dWJ0n",   actress:"美園和花" },
  { rank:51, cid:"HRSM-087",   javdbId:"r3OWXJ" },
  { rank:52, cid:"NTRH-006",   javdbId:"QN24xK",   actress:"逢沢みゆ" },
  { rank:53, cid:"FKAW-004",   javdbId:"e8EQ5p" },
  { rank:54, cid:"PRED-759",   javdbId:"J0AeBq",   actress:"北岡果林,天馬ゆい" },
  { rank:55, cid:"SNOS-081",   javdbId:"nK3VpY",   actress:"鈴木希" },
  { rank:56, cid:"MDVR-388",   javdbId:"MbnYm1",   actress:"葵いぶき 他" },
  { rank:57, cid:"START-158",  javdbId:"MbbGd1",   actress:"MINAMO" },
  { rank:58, cid:"SQDE-023",   javdbId:"verV8p",   actress:"宮沢ちはる" },
  { rank:59, cid:"SAVR-978",   javdbId:"wKg3Gz",   actress:"乙アリス" },
  { rank:60, cid:"SODS-074",   javdbId:"P9Vz12",   actress:"彩月七緒" },
  { rank:61, cid:"JUR-583",    javdbId:"de3JPM",   actress:"新妻ゆうか" },
  { rank:62, cid:"RKI-694",    javdbId:"wKpdw2",   actress:"月野かすみ" },
  { rank:63, cid:"OFJE-701",   javdbId:"96pNZg",   actress:"瀬戸環奈" },
  { rank:64, cid:"URVRSP-559", javdbId:"96pKJ8" },
  { rank:65, cid:"DVMM-337",   javdbId:"ZNv6Q6" },
  { rank:66, cid:"SNOS-131",   javdbId:"Ebn763",   actress:"瀬戸環奈" },
  { rank:67, cid:"MDVR-406",   javdbId:"2mXRGP",   actress:"福田ゆあ" },
  { rank:68, cid:"HNVR-176",   javdbId:"r3zGND",   actress:"椿りか" },
  { rank:69, cid:"SNOS-115",   javdbId:"4Dx3dZ",   actress:"博多彩葉" },
  { rank:70, cid:"AJVR-309",   javdbId:"gyQggq",   actress:"倉木しおり" },
  { rank:71, cid:"SONE-592",   javdbId:"82X7Ex",   actress:"夢乃あいか" },
  { rank:72, cid:"EBWH-218",   javdbId:"gy4VXE",   actress:"柏木ふみか" },
  { rank:73, cid:"SONE-670",   javdbId:"e84ObM",   actress:"村上悠華" },
  { rank:74, cid:"MUDR-297",   javdbId:"kKBWy6",   actress:"倉本すみれ" },
  { rank:75, cid:"KTKL-139",   javdbId:"r347nA" },
  { rank:76, cid:"SNOS-050",   javdbId:"NQgM74",   actress:"川越にこ" },
  { rank:77, cid:"SQTE-647",   javdbId:"ZNvn6v",   actress:"花守夏歩" },
  { rank:78, cid:"EBWH-317",   javdbId:"V4V9Xz",   actress:"白羽舞菜" },
  { rank:79, cid:"LULU-423",   javdbId:"KkrKVA",   actress:"九井スナオ" },
  { rank:80, cid:"MIRD-268",   javdbId:"Eb4Ra2",   actress:"小野六花 他" },
  { rank:81, cid:"MIDV-946",   javdbId:"r33W8q",   actress:"石川澪" },
  { rank:82, cid:"START-480",  javdbId:"RkX6vm",   actress:"小笠原菜乃" },
  { rank:83, cid:"SSIS-808",   javdbId:"ne0Kzw",   actress:"安達夕莉" },
  { rank:84, cid:"SSIS-595",   javdbId:"PQ8O7v",   actress:"河北彩花" },
  { rank:85, cid:"HNVR-170",   javdbId:"6dWGNK",   actress:"逢沢みゆ" },
  { rank:86, cid:"JUR-041",    javdbId:"veZv9n",   actress:"篠原いよ" },
  { rank:87, cid:"DVMM-191",   javdbId:"XeBB8M" },
  { rank:88, cid:"JERA-026",   javdbId:"GZzrzb",   actress:"逢沢みゆ" },
  { rank:89, cid:"BLOR-294",   javdbId:"YwGaEz" },
  { rank:90, cid:"START-568",  javdbId:"96nrmR",   actress:"青空ひかり" },
  { rank:91, cid:"HOIZ-178",   javdbId:"deGkq0" },
  { rank:92, cid:"SNOS-017",   javdbId:"yxd6zX",   actress:"金松季歩" },
  { rank:93, cid:"SDMM-181",   javdbId:"WwwJaK",   actress:"弥生みづき" },
  { rank:94, cid:"MKMP-705",   javdbId:"kKbrrP",   actress:"乙アリス" },
  { rank:95, cid:"SNOS-208",   javdbId:"Ww73GR",   actress:"白石透羽" },
  { rank:96, cid:"SNOS-039",   javdbId:"de3JD5",   actress:"田野憂" },
  { rank:97, cid:"VRKM-1765",  javdbId:"WwrJeg",   actress:"羽月乃蒼 他" },
  { rank:98, cid:"LULU-421",   javdbId:"OXrWOz",   actress:"波多野結衣" },
  { rank:99, cid:"NSODN-009",  javdbId:"DRK4eJ" },
  { rank:100,cid:"JUR-036",    javdbId:"a8BypX",   actress:"新妻ゆうか" }
];

async function loadDMMMonthlyRanking(params) {
  var page = Number(params.page || 1);
  var limit = LIMIT;
  var offset = (page - 1) * limit;
  var pageList = DMM_MONTHLY_DATA.slice(offset, offset + limit);
  if (pageList.length === 0) return [];

  var items = [];
  for (var i = 0; i < pageList.length; i++) {
    var entry = pageList[i];

    var coverCandidates = await buildImageCandidatesFromValue(entry.cid);
    var posterPath = "";
    if (coverCandidates.strategy === "mgstage" || coverCandidates.strategy === "direct-dmm") {
      posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, "");
    } else if (entry.javdbId) {
      var prefix = entry.javdbId.substring(0, 2).toLowerCase();
      posterPath = normalizeJavdbImageUrl("https://tp.cmastd.com/rhe951l4q/covers/" + prefix + "/" + entry.javdbId + ".jpg");
    }

    var descParts = [];
    descParts.push("#" + entry.rank);
    if (entry.actress) descParts.push(entry.actress);
    descParts.push("DMM月榜");
    var description = descParts.join(" | ");

    items.push({
      id: entry.cid,
      type: "url",
      title: entry.cid,
      posterPath: posterPath,
      backdropPath: posterPath,
      link: "detail:" + entry.javdbId + ":" + entry.cid,
      description: description,
      mediaType: "movie"
    });
  }
  return items;
}

// ============================================================
// 女优排行（内置前 90 位，头像由 JavDB API 返回）
// ============================================================

var ACTORS_DATA = [{"id":"83V","name":"桃園怜奈","name_zht":"桃園憐奈"},{"id":"0edE","name":"水卜さくら","name_zht":"水卜樱"},{"id":"BzpA","name":"本庄鈴","name_zht":""},{"id":"qA0N","name":"美園和花","name_zht":""},{"id":"82m3","name":"風間ゆみ","name_zht":"風間由美"},{"id":"8Nqa","name":"美咲かんな","name_zht":"美咲佳奈"},{"id":"7BX1","name":"西宮ゆめ","name_zht":"西宮夢"},{"id":"Ab9n","name":"友田真希","name_zht":""},{"id":"EvkJ","name":"河北彩花","name_zht":""},{"id":"AbBK","name":"夢乃あいか","name_zht":"夢乃愛華"},{"id":"BKMM","name":"大槻ひびき","name_zht":"大槻響"},{"id":"NPD3","name":"七沢みあ","name_zht":"七澤美亞"},{"id":"0dKX","name":"桃乃木かな","name_zht":"桃乃木香奈"},{"id":"R2Vg","name":"波多野結衣","name_zht":"波多野結衣"},{"id":"M4Q7","name":"明里つむぎ","name_zht":"明裡絹"},{"id":"wVVz","name":"奥田咲","name_zht":"奧田咲"},{"id":"kek6","name":"夏目彩春","name_zht":""},{"id":"1KBW","name":"JULIA","name_zht":""},{"id":"ZzNm","name":"神宮寺ナオ","name_zht":"神宮寺奈緒"},{"id":"YgJx","name":"伊藤舞雪","name_zht":"伊藤舞雪"},{"id":"bvWB","name":"桜空もも","name_zht":"櫻空桃"},{"id":"nRKm","name":"鈴村あいり","name_zht":"鈴村愛裡"},{"id":"J9dd","name":"紗倉まな","name_zht":"紗倉真菜"},{"id":"69A0","name":"河合あすな","name_zht":"河合明日菜"},{"id":"A0Qy","name":"森沢かな","name_zht":"森澤佳奈"},{"id":"KxPb","name":"涼森れむ","name_zht":"涼森玲夢"},{"id":"0Bw3","name":"吉根ゆりあ","name_zht":"吉根柚莉愛"},{"id":"pZae","name":"竹内有紀","name_zht":""},{"id":"gEkm","name":"八木奈々","name_zht":""},{"id":"A6zy","name":"東條なつ","name_zht":"東條夏"},{"id":"Wb1B","name":"木下凛々子","name_zht":"木下凛凛子"},{"id":"MW44","name":"木下ひまり","name_zht":"木下日葵"},{"id":"zvK7","name":"小野六花","name_zht":""},{"id":"QO2M","name":"石原希望","name_zht":""},{"id":"bkxd","name":"森日向子","name_zht":""},{"id":"JbER","name":"葵いぶき","name_zht":"葵伊吹"},{"id":"Ewa2","name":"七ツ森りり","name_zht":"七森莉莉"},{"id":"znyb","name":"月野かすみ","name_zht":"月野香澄"},{"id":"p33Qb","name":"八掛うみ","name_zht":"八掛海"},{"id":"W1wee","name":"白峰ミウ","name_zht":"白峰美羽"},{"id":"p3kMZ","name":"楓カレン","name_zht":"楓可憐"},{"id":"ZXy46","name":"北野未奈","name_zht":""},{"id":"k4O90","name":"MINAMO","name_zht":""},{"id":"E2vOx","name":"新井リマ","name_zht":"新井莉麻"},{"id":"0RkDa","name":"楓ふうあ","name_zht":"楓芙愛"},{"id":"QV0p9","name":"石川澪","name_zht":""},{"id":"meyzd","name":"宍戸里帆","name_zht":""},{"id":"YnZ1K","name":"宮下玲奈","name_zht":""},{"id":"k43we","name":"由良かな","name_zht":""},{"id":"p3DYE","name":"藤かんな","name_zht":"藤環奈"},{"id":"O21k8","name":"安達夕莉","name_zht":""},{"id":"g0W2Z","name":"九野ひなの","name_zht":""},{"id":"1B0AA","name":"葉山さゆり","name_zht":""},{"id":"O2qxB","name":"清原みゆう","name_zht":"清原美優"},{"id":"J2z7B","name":"羽月乃蒼","name_zht":""},{"id":"658kM","name":"明日葉みつは","name_zht":""},{"id":"XWGG5","name":"黒島玲衣","name_zht":""},{"id":"352Ow","name":"九井スナオ","name_zht":"九井蘇娜歐"},{"id":"xvPx8","name":"村上悠華","name_zht":""},{"id":"zK98J","name":"逢沢みゆ","name_zht":""},{"id":"zK9pQ","name":"長浜みつり","name_zht":""},{"id":"RdZe8","name":"金松季歩","name_zht":""},{"id":"J2q7B","name":"北岡果林","name_zht":""},{"id":"bAv5g","name":"白上咲花","name_zht":""},{"id":"8VOMx","name":"田野憂","name_zht":""},{"id":"9Dx0R","name":"小野坂ゆいか","name_zht":""},{"id":"p39RE","name":"日向由奈","name_zht":""},{"id":"RdEb4","name":"彩月七緒","name_zht":""},{"id":"xv6BV","name":"依本しおり","name_zht":""},{"id":"eK5gr","name":"糸井瑠花","name_zht":""},{"id":"W1PvB","name":"巴ひかり","name_zht":""},{"id":"RdEyz","name":"愛才りあ","name_zht":""},{"id":"neRNX","name":"瀬戸環奈","name_zht":""},{"id":"D2EdJ","name":"花守夏歩","name_zht":""},{"id":"QVEBJ","name":"新妻ゆうか","name_zht":""},{"id":"qDYDe","name":"柏木ふみか","name_zht":""},{"id":"yrRx0","name":"木村愛心","name_zht":""},{"id":"bA2yd","name":"紫堂るい","name_zht":""},{"id":"Mm1qA","name":"守屋よしの","name_zht":""},{"id":"65PEn","name":"純白彩永","name_zht":""},{"id":"k47Az","name":"幸村泉希","name_zht":""},{"id":"nen2w","name":"福田ゆあ","name_zht":""},{"id":"0R1n3","name":"井上もも","name_zht":""},{"id":"8VGE5","name":"鈴木希","name_zht":""},{"id":"VwnPz","name":"早坂奏音","name_zht":""},{"id":"zKgPW","name":"博多彩葉","name_zht":""},{"id":"k4MbY","name":"小松空","name_zht":""},{"id":"zKgQ5","name":"白石透羽","name_zht":""},{"id":"QVy9n","name":"森下茉莉","name_zht":""},{"id":"eKbnd","name":"園梨音","name_zht":""},{"id":"1BZnn","name":"新木希空","name_zht":"新木希空"}];

async function searchActress(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var keyword = (params.keyword || "").trim();
  if (!keyword) {
    return [{ id: "tip", type: "text", title: "请输入女优名称" }];
  }

  var page = Number(params.page || 1);
  var found = null;
  for (var i = 0; i < ACTORS_DATA.length; i++) {
    var actress = ACTORS_DATA[i];
    if ((actress.name && actress.name.indexOf(keyword) !== -1) || (actress.name_zht && actress.name_zht.indexOf(keyword) !== -1)) {
      found = actress;
      break;
    }
  }

  if (!found) {
    return [{ id: "empty", type: "text", title: "未找到匹配女优" }];
  }

  var data = await apiGet("/v1/movies/tags", {
    filter_by: "0:a:" + found.id,
    sort_by: "release",
    order_by: "desc",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  return await moviesToItems(extractMovies(data));
}

async function loadActors(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var actressId = params.actress || "83V";
  var sortBy = params.sort_by || "release";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/movies/tags", {
    filter_by: "0:a:" + actressId,
    sort_by: sortBy,
    order_by: "desc",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  return await moviesToItems(extractMovies(data));
}

// ============================================================
// 搜索
// ============================================================

async function searchJavDB(params) {
  try {
    var filtered = await handleListParams(params);
    if (filtered) return filtered;
    var keyword = (params.keyword || "").trim();
    if (!keyword) {
      return [{ id: "tip", type: "text", title: "请输入番号或标题搜索" }];
    }
    var page = Number(params.page || 1);

    var data = await apiGet("/v2/search", {
      q: keyword,
      type: "video",
      page: page,
      limit: LIMIT
    }, params.username, params.password);

    return await moviesToItems(extractMovies(data));
  } catch (error) {
    console.error("[searchJavDB] 失败:", error.message || error);
    throw error;
  }
}

// ============================================================
// 厂牌
// ============================================================

async function loadMaker(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var makerId = params.maker || "7R";
  var sortBy = params.sort_by || "release";
  var page = Number(params.page || 1);

  var data = await apiGet("/v1/movies/tags", {
    filter_by: "0:m:" + makerId,
    sort_by: sortBy,
    order_by: "desc",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  return await moviesToItems(extractMovies(data));
}

// ============================================================
// 搜索厂牌
// ============================================================

async function searchMaker(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var keyword = (params.keyword || "").trim();
  if (!keyword) {
    return [{ id: "tip", type: "text", title: "请输入厂牌名称搜索" }];
  }

  var page = Number(params.page || 1);
  var data = await apiGet("/v2/search", {
    q: keyword,
    type: "video",
    page: page,
    limit: LIMIT
  }, params.username, params.password);

  return await moviesToItems(extractMovies(data));
}

// ============================================================
// 搜索片单
// ============================================================

async function searchList(params) {
  var filtered = await handleListParams(params);
  if (filtered) return filtered;
  var keyword = (params.keyword || "").trim();
  if (!keyword) {
    return [{ id: "tip", type: "text", title: "请输入关键词搜索" }];
  }

  var data = await apiGet("/v2/search", {
    q: keyword,
    type: "video",
    page: Number(params.page || 1),
    limit: LIMIT
  }, params.username, params.password);

  return await moviesToItems(extractMovies(data));
}

// ============================================================
// 影片详情
// ============================================================

async function loadDetail(link) {
  // link 格式: detail:{movieId}:{number}
  // 115detail://{pickcode} — 115 直播放映
  // offline-submit://{dvdId}?cid={candidateId} — 115 离线回执

  // 115 直播放映（简单路由，实际播放走 loadResource）
  if (link.indexOf("115detail://") === 0) {
    var cleanLink = String(link || "").trim();
    var pathPart = cleanLink.slice("115detail://".length);
    var qIdx = pathPart.indexOf("?");
    if (qIdx >= 0) pathPart = pathPart.slice(0, qIdx);
    var pickcode = pathPart;
    return {
      id: link, type: "url",
      title: pickcode || "115 视频",
      link: link, mediaType: "movie"
    };
  }
  // 115 离线提交回执
  if (link.indexOf("offline-submit://") === 0) {
    return await handleOfflineSubmit(link);
  }

  var parts = String(link || "").replace(/^detail:/, "").split(":");
  var id = parts[0];
  if (!id) return null;

  // 115 文件详情（pickcode 通常 20+ 字符，与 TAVDB 的短 ID 区分）
  if (id.length >= 20) {
    return await handleNormalDetail(link);
  }

  try {
    var creds = await getCredentials();
    if (!creds.username || !creds.password) return null;

    var raw = await apiGet("/v4/movies/" + encodeURIComponent(id), {}, creds.username, creds.password);
    if (!raw) return null;

    var movie = raw.data && raw.data.movie ? raw.data.movie : null;
    if (!movie) return null;

    var number = movie.number || "";
    var title = (number ? number + " " : "") + (movie.title || number);
    var cover = normalizeJavdbImageUrl(movie.cover_url || movie.thumb_url || "");
    var coverCandidates = await buildImageCandidatesFromValue(number || title);
    coverCandidates.posterCandidates = normalizeJavdbImageCandidates(coverCandidates.posterCandidates || []);
    coverCandidates.backdropCandidates = normalizeJavdbImageCandidates(coverCandidates.backdropCandidates || []);
    var summary = movie.summary || "";
    var score = Number(movie.score) || 0;

    var posterPath = cover;
    var backdropPath = cover;
    if (coverCandidates.strategy === "mgstage") {
      posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, cover);
      backdropPath = chooseFirstCandidate(coverCandidates.backdropCandidates, cover);
    } else if (coverCandidates.strategy === "direct-dmm") {
      posterPath = chooseFirstCandidate(coverCandidates.posterCandidates, cover);
      backdropPath = chooseFirstCandidate(coverCandidates.backdropCandidates, cover);
    } else if (coverCandidates.posterCandidates && coverCandidates.posterCandidates.length > 0) {
      posterPath = await pickFirstAvailableImageUrl(coverCandidates.posterCandidates, cover);
      backdropPath = await pickFirstAvailableImageUrl(coverCandidates.backdropCandidates || [], cover);
    }
    // 演员
    var peoples = [];
    if (movie.actors && Array.isArray(movie.actors)) {
      for (var i = 0; i < movie.actors.length; i++) {
        var a = movie.actors[i];
        var avatar = "";
        if (a.avatar_url) {
          avatar = normalizeJavdbImageUrl(a.avatar_url);
        } else if (a.id) {
          // JavDB 头像 URL 格式可预测: https://tp.cmastd.com/rhe951l4q/avatars/{id前2位小写}/{id}.jpg
          var aid = String(a.id).toLowerCase();
          var prefix = aid.substring(0, 2);
          avatar = normalizeJavdbImageUrl("https://tp.cmastd.com/rhe951l4q/avatars/" + prefix + "/" + aid + ".jpg");
        }
        peoples.push({
          id: String(a.id || a.name || i),
          title: a.name || "",
          avatar: avatar,
          role: "演员"
        });
      }
    }

    // 标签
    var genreItems = [];
    if (movie.tags && Array.isArray(movie.tags)) {
      for (var i = 0; i < movie.tags.length; i++) {
        var t = movie.tags[i];
        genreItems.push({
          id: String(t.name || t.id || i),
          title: t.name || ""
        });
      }
    }

    // 预览图（剧照）
    var backdropPaths = [];
    if (movie.preview_images && Array.isArray(movie.preview_images)) {
      for (var i = 0; i < movie.preview_images.length; i++) {
        var url = movie.preview_images[i].large_url || movie.preview_images[i].thumb_url || "";
        if (url) backdropPaths.push(normalizeJavdbImageUrl(url));
      }
    }

    // 简介：番号 + 摘要 + 统计
    var descLines = [];
    if (summary) descLines.push(summary);
    if (movie.maker_name) {
      descLines.push("厂牌: " + movie.maker_name);
    }
    var statsParts = [];
    if (movie.want_watch_count) statsParts.push("想看 " + movie.want_watch_count);
    if (movie.watched_count) statsParts.push("观看 " + movie.watched_count);
    if (movie.reviews_count) statsParts.push("评价 " + movie.reviews_count);
    if (statsParts.length > 0) descLines.push(statsParts.join("  "));
    var description = descLines.join("\n\n");

    // 获取前 3 条短评追加到简介
    try {
      var reviewRaw = await apiGet("/v1/movies/" + encodeURIComponent(id) + "/reviews", {}, creds.username, creds.password);
      if (reviewRaw && reviewRaw.data && reviewRaw.data.reviews) {
        var allReviews = reviewRaw.data.reviews;
        // 按点赞数降序取前 3
        allReviews.sort(function (a, b) {
          return (b.likes_count || 0) - (a.likes_count || 0);
        });
        var topReviews = allReviews.slice(0, 5).filter(function (r) { return r.content; });
        if (topReviews.length > 0) {
          var reviewTexts = ["── 短评 ──"];
          for (var ri = 0; ri < topReviews.length; ri++) {
            reviewTexts.push(topReviews[ri].content);
          }
          description = description + "\n\n" + reviewTexts.join("\n\n");
        }
      }
    } catch (e) {}

    // 预告片（如果有）
    var trailers = [];
    if (movie.has_preview_video && movie.preview_video_url) {
      trailers.push({
        name: "预览",
        url: normalizeJavdbImageUrl(movie.preview_video_url),
        coverUrl: cover
      });
    }
    if (!trailers.length && number) {
      var javpUrl = await fetchJavpTrailerUrl(number);
      if (javpUrl) {
        trailers.push({
          name: "预告片",
          url: javpUrl,
          coverUrl: cover
        });
      }
    }

    // 把预告片封面图替换第一张剧照
    if (trailers.length > 0 && trailers[0].coverUrl) {
      if (backdropPaths.length > 0) {
        backdropPaths[0] = trailers[0].coverUrl;
      } else {
        backdropPaths.push(trailers[0].coverUrl);
      }
    }

    var result = {
      id: String(movie.id || id),
      type: "url",
      title: title,
      posterPath: posterPath,
      backdropPath: backdropPath,
      description: description,
      mediaType: "movie",
      releaseDate: movie.release_date || "",
      rating: score,
      duration: movie.duration || 0,
      durationText: movie.duration ? movie.duration + "分钟" : "",
      number: number,
      link: link
    };

    if (backdropPaths.length > 0) result.backdropPaths = backdropPaths;
    if (peoples.length > 0) result.peoples = peoples;
    if (genreItems.length > 0) result.genreItems = genreItems;
    if (trailers.length > 0) result.trailers = trailers;

    return result;
  } catch (e) {
  }
}

function guessQualityFromResolution(width, height) {
  var h = Number(height || 0);
  if (h >= 2160) return { quality: "BD", label: "4K", priority: 4 };
  if (h >= 1080) return { quality: "UD", label: "1080P", priority: 3 };
  if (h >= 720)  return { quality: "HD", label: "720P", priority: 2 };
  if (h >= 480)  return { quality: "SD", label: "480P", priority: 1 };
  if (h >= 360)  return { quality: "LD", label: "360P", priority: 0 };
  return { quality: "", label: h ? (h + "P") : "", priority: -1 };
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  var n = Number(bytes);
  if (isNaN(n) || n < 0) return "";
  if (n === 0) return "0 B";
  var units = ["B", "KB", "MB", "GB", "TB"];
  var i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
  var v = (n / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return v + " " + units[i];
}

function isVideoFile(filename) {
  var ext = String(filename || "").split(".").pop().toLowerCase();
  return VIDEO_EXTS.has(ext);
}

function extractNumber(text) {
  var s = getText(text).toUpperCase();
  if (!s) return "";

  // 1. 去掉域名前缀: hhd800.com@, hhb800.com@, xxx.yyy@
  s = s.replace(/^[A-Z0-9]+(?:\.[A-Z0-9]+)+@/, "");

  // 2. 去掉已知资源站脏前缀(域名无@后缀时): HHD800, HHB800
  s = s.replace(/^(?:HHD800|HHB800)[_\-@.\s]?/, "");

  var normalized = s.replace(/_/g, "-").replace(/\s+/g, " ").trim();

  var patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?(\d{5,8})\b/,
    /\bCARIB[- ]?(\d{6,8})\b/,
    /\b1PONDO[- ]?(\d{6,8})\b/,
    /\bHEYZO[- ]?(\d{3,6})\b/,
    /\bT28[- ]?(\d{6,8})\b/,
    /\b([A-Z]{2,15})[- ]?(\d{2,10})\b/,
    /\b(\d{6}[-_]\d{2,3})\b/,
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = normalized.match(patterns[i]);
    if (match) {
      if (match[1] && match[2]) {
        var result = match[1] + "-" + match[2];
        console.log("[pan115/extractNumber] input:", text,
                    "cleaned:", s, "result:", result);
        return result;
      }
      if (match[1]) {
        console.log("[pan115/extractNumber] input:", text,
                    "cleaned:", s, "result:", match[1].replace(/\s+/g, ""));
        return match[1].replace(/\s+/g, "");
      }
    }
  }

  console.log("[pan115/extractNumber] input:", text,
              "cleaned:", s, "result: (none)");
  return "";
}

function displayTitleFromFile(filename) {
  var number = extractNumber(filename);
  if (number) return number;
  var name = String(filename || "").replace(/\.[^.]+$/, "");
  return name.length > 50 ? name.slice(0, 50) + "..." : name;
}

// ==================== 欧美 Scene Key 提取 ====================

var WESTERN_NOISE = /\b(?:xxx|1080p|2160p|4k|mp4|mkv|x264|x265|hevc|web-dl|webdl|ktr|n1c)\b/gi;

function extractWesternSceneKey(text) {
  var s = getText(text).toLowerCase();
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化：空白/下划线/冒号 → 点号，合并连续点号
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 日期之后 → performer
  var afterRaw = clean.slice(dateIndex + dateStr.length).replace(/^\.+/, "").replace(/\.+$/, "");
  var performerParts = afterRaw.split(".").filter(Boolean);

  // 6. 校验：至少需要 studio + performer
  if (!studio || !performerParts.length) return null;

  var performerJoined = performerParts.join(".");
  var key = studio + "." + dateStr + "." + performerJoined;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "") + performerJoined).replace(/[^a-z0-9]/g, "");

  console.log("[pan115/extractWesternSceneKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget);

  return {
    key: key,
    searchText: searchText,
    strictTarget: strictTarget
  };
}

function extractWesternDateKey(text) {
  var s = getText(text).toLowerCase();
  if (!s) return null;

  // 1. 过滤噪音词
  s = s.replace(WESTERN_NOISE, "");

  // 2. 分隔符归一化（含冒号）
  var clean = s.replace(/[_\s:]+/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "").trim();
  if (!clean) return null;

  // 3. 找日期模式 YY.MM.DD
  var dateMatch = clean.match(/(\d{2})[-.](\d{2})[-.](\d{2})/);
  if (!dateMatch) return null;

  var dateStr = dateMatch[0];
  var dateIndex = dateMatch.index;
  if (dateIndex === undefined) return null;

  // 4. 日期之前 → 取紧邻日期前的一个 token 作为 studio（忽略前置噪声）
  var beforeRaw = clean.slice(0, dateIndex).replace(/\.+$/, "").replace(/^\.+/, "");
  var beforeParts = beforeRaw.split(".").filter(Boolean);
  var studio = beforeParts.length > 0 ? beforeParts[beforeParts.length - 1] : "";

  // 5. 只要求 studio + date（不要求 performer）
  if (!studio) return null;

  var key = studio + " " + dateStr;
  var searchText = studio;
  var strictTarget = (studio + dateStr.replace(/\./g, "")).replace(/[^a-z0-9]/g, "");
  var displayTitle = studio.charAt(0).toUpperCase() + studio.slice(1) + " " + dateStr;

  console.log("[pan115/extractWesternDateKey] extracted scene: \"" + (beforeParts.length > 1 ? beforeParts.slice(-2).join(".") : studio + "." + dateStr) + "\"  studio: \"" + studio + "\"  date: \"" + dateStr + "\"");
  console.log("[pan115/extractWesternDateKey] key:", key,
              "searchText:", searchText,
              "strictTarget:", strictTarget,
              "displayTitle:", displayTitle);

  return {
    type: "western_date",
    key: key,
    searchText: searchText,
    strictTarget: strictTarget,
    displayTitle: displayTitle,
    weak: true
  };
}

// ==================== Western 文件评分 ====================

var WESTERN_BAD_WORDS = ["trailer", "sample", "preview", "behind", "bts"];

function scoreWesternFile(file) {
  var fn = String(file.filename || "").toLowerCase();
  var score = 0;

  // 扣分：非正片关键词
  for (var wi = 0; wi < WESTERN_BAD_WORDS.length; wi++) {
    if (fn.indexOf(WESTERN_BAD_WORDS[wi]) !== -1) score -= 50;
  }

  // 大小加分/扣分
  var size = Number(file.size || 0);
  if (size >= 2 * 1024 * 1024 * 1024) score += 30;
  else if (size >= 1024 * 1024 * 1024) score += 20;
  else if (size >= 500 * 1024 * 1024) score += 10;
  else if (size > 0 && size < 100 * 1024 * 1024) score -= 20;

  // 文件名越长越可能是完整 scene
  if (fn.length > 30) score += 5;

  return score;
}

function extractMatchKey(text) {
  // 1) 先试 JAV 番号
  var number = extractNumber(text);
  if (number) {
    var searchText = number.toLowerCase().replace(/^fc2-/, "");
    var result = { type: "jav", key: number, searchText: searchText };
    console.log("[pan115/extractMatchKey] type: jav, key:", number);
    return result;
  }

  // 2) 再试 Western scene（强匹配：需要 performer）
  var western = extractWesternSceneKey(text);
  if (western) {
    var result = {
      type: "western",
      key: western.key,
      searchText: western.searchText,
      strictTarget: western.strictTarget
    };
    console.log("[pan115/extractMatchKey] type: western, key:", result.key);
    return result;
  }

  // 3) 最后试 Western date（弱匹配：只需要 studio + date）
  var dateKey = extractWesternDateKey(text);
  if (dateKey) {
    console.log("[pan115/extractMatchKey] type: western_date, key:", dateKey.key);
    return dateKey;
  }

  console.log("[pan115/extractMatchKey] no match");
}

// ==================== 115 常量 & HTTP 封装 ====================

async function httpGet(url, options) {
  options = options || {};
  var finalOptions = {
    headers: Object.assign({}, BASE_HEADERS, options.headers || {}),
    timeout: options.timeout || TIMEOUT
  };

  var resp = await Widget.http.get(url, finalOptions);
  if (!resp || resp.statusCode !== 200) {
    throw new Error("HTTP " + (resp && resp.statusCode || "unknown") + ": " + url.slice(0, 80));
  }
  return resp.data;
}

function cookieHeader(cookie) {
  if (!cookie) return {};
  return { "Cookie": cookie };
}

// ==================== 115 API 核心 ====================

async function listFolder(cookie, cid, page) {
  var limit = 30;
  var offset = ((page || 1) - 1) * limit;
  var url = WEB_API_115 + "/files?cid=" + encodeURIComponent(cid)
    + "&offset=" + offset + "&limit=" + limit
    + "&show_dir=1&type=&star=&is_share=&format=json";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}

  var allLists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.list,
    parsed && parsed.data && parsed.data.files,
  ];

  var files = [];
  for (var ci = 0; ci < allLists.length; ci++) {
    if (Array.isArray(allLists[ci])) { files = allLists[ci]; break; }
  }

  return files.map(function (item) {
    return {
      fid: item.fid || item.id || "",
      pickcode: item.pc || item.pickcode || "",
      filename: item.n || item.name || "",
      size: item.s || item.size || 0,
      isdir: !item.pc && !item.pickcode,
      cid: item.cid || item.fid || "",
    };
  }).filter(function (item) { return item.pickcode || item.isdir; });
}

async function searchFiles(cookie, keyword) {
  var url = WEB_API_115 + "/files/search?search_value=" + encodeURIComponent(keyword)
    + "&limit=30&offset=0";

  var data = await httpGet(url, { headers: cookieHeader(cookie) });

  var parsed = null;
  try { parsed = typeof data === "string" ? JSON.parse(data) : data; } catch (e) {}

  var lists = [
    parsed && parsed.data,
    parsed && parsed.data && parsed.data.list,
    parsed && parsed.data && parsed.data.files,
    parsed && parsed.data && parsed.data.items,
    parsed && parsed.files,
    parsed && parsed.list,
  ];

  var files = [];
  for (var i = 0; i < lists.length; i++) {
    if (Array.isArray(lists[i])) { files = lists[i]; break; }
  }

  return files.map(function (item) {
    return {
      pickcode: item.pc || item.pickcode || item.pick_code || item.pickCode || "",
      filename: item.n || item.name || item.file_name || item.filename || "",
      size: item.s || item.size || 0,
    };
  }).filter(function (item) { return item.pickcode && item.filename; });
}

async function getMasterM3u8Text(cookie, pickcode) {
  var url = API_115 + "/api/video/m3u8/" + encodeURIComponent(pickcode) + ".m3u8";
  var data = await httpGet(url, { headers: cookieHeader(cookie) });
  return String(data || "");
}

function parseStreams(masterText) {
  if (!masterText || masterText.indexOf("#EXTM3U") !== 0) return [];

  var lines = masterText.split("\n");
  var streams = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") === -1) continue;

    var nameMatch = line.match(/NAME="([^"]+)"/);
    var resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
    var bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);

    var name = nameMatch ? nameMatch[1].toUpperCase() : "";
    var width = resolutionMatch ? Number(resolutionMatch[1]) : 0;
    var height = resolutionMatch ? Number(resolutionMatch[2]) : 0;

    // 优先 NAME 匹配，NAME 未识别时用 RESOLUTION 猜
    var quality = QUALITY_MAP[name];
    if (!quality) {
      quality = guessQualityFromResolution(width, height);
    }

    var urlLine = "";
    for (var j = i + 1; j < lines.length; j++) {
      var trimmed = lines[j].trim();
      if (trimmed && trimmed.charAt(0) !== "#") {
        urlLine = trimmed;
        break;
      }
    }

    urlLine = urlLine.replace(/^https:\s*\/\//i, "https://");
    if (!urlLine || urlLine.indexOf("http") !== 0) continue;

    var label = quality.label || (height ? height + "P" : "");
    streams.push({
      url: urlLine,
      quality: name || quality.quality || "",
      label: label,
      priority: quality.priority >= 0 ? quality.priority : -1,
      resolution: resolutionMatch ? width + "x" + height : "",
      bandwidth: bandwidthMatch ? Number(bandwidthMatch[1]) : 0
    });
  }

  // 按 priority 降序 → bandwidth 降序
  streams.sort(function (a, b) {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return (b.bandwidth || 0) - (a.bandwidth || 0);
  });

  console.log("[pan115/parseStreams] count:", streams.length);
  for (var si = 0; si < streams.length; si++) {
    var s = streams[si];
    console.log("[pan115/parseStreams]  #" + si, "label:", s.label,
                "resolution:", s.resolution,
                "url:", (s.url || "").slice(0, 80));
  }

  return streams;
}

// ==================== MissAV 元数据补充 ====================

async function enrichViaMissav(number) {
  if (!number) return null;

  try {
    var url = MISS_AV + "/cn/search/" + encodeURIComponent(number);
    var html = await httpGet(url, { headers: MISS_AV_HEADERS, timeout: 8000 });
    var $ = Widget.html.load(html);

    var group = $("div.group").first();
    if (!group || !group.length) return null;

    var link = group.find("a.text-secondary");
    var href = link.attr("href");
    var title = link.text().trim();
    if (!href) return null;

    var videoId = href.split('/').pop()
      .replace(/-uncensored-leak|-chinese-subtitle/g, '')
      .toUpperCase();

    var coverUrl = "https://fourhoi.com/" + videoId.toLowerCase() + "/cover-t.jpg";
    var img = group.find("img");
    var fallbackCover = img.attr("data-src") || img.attr("src") || "";

    return {
      title: title,
      coverUrl: coverUrl,
      fallbackCover: fallbackCover,
      videoId: videoId,
      missavLink: href.indexOf("http") === 0 ? href : MISS_AV + href,
      source: "missav"
    };
  } catch (err) {
    console.warn("[pan115] MissAV 元数据失败:", err && err.message ? err.message : err);
  }
}

// ==================== Cookie 同步 ====================

var COOKIE_115 = "";
var PICKCODE_FILE_MAP = {};
var TIMEOUT = 15000;
var SUKEBEI_BASE = "https://sukebei.nyaa.si";
var MAGNET_CACHE_TTL = 3600 * 1000;
var MISS_AV = "https://missav.ai";

var BASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://115.com/",
  "Origin": "https://115.com"
};

var MISS_AV_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://missav.ai/"
};

var VIDEO_EXTS = new Set([
  "mp4", "mkv", "avi", "wmv", "mov", "m4v",
  "ts", "flv", "rmvb", "webm", "3gp"
]);

var QUALITY_MAP = {
  BD: { label: "4K",    priority: 4 },
  UD: { label: "1080P", priority: 3 },
  HD: { label: "720P",  priority: 2 },
  SD: { label: "480P",  priority: 1 },
  LD: { label: "360P",  priority: 0 }
};

var API_115 = "https://115.com";
var WEB_API_115 = "https://webapi.115.com";

function resolveCookie(params) {
  return getText(params && params.cookie ? params.cookie : COOKIE_115);
}

function syncCookie(cookie) {
  COOKIE_115 = cookie || "";
}

// ==================== 构建函数 ====================

/**
 * buildFallbackBrowseItem — 纯本地 fallback 浏览卡片
 * 不依赖任何网络调用，确保合法视频文件至少显示一张卡片
 */
function buildFallbackBrowseItem(file) {
  var number = extractNumber(file.filename);
  var title = displayTitleFromFile(file.filename);
  var backdropPath = "";

  var descParts = [];
  if (number) descParts.push("番号: " + number);
  descParts.push("原文件: " + file.filename);
  if (formatSize(file.size)) descParts.push("大小: " + formatSize(file.size));
  var description = descParts.filter(Boolean).join(" · ");

  PICKCODE_FILE_MAP[file.pickcode] = {
    title: title,
    filename: file.filename,
    size: file.size,
    number: number,
    backdropPath: backdropPath,
    description: description
  };

  var link = "115detail://" + file.pickcode;
  if (number) {
    link += "?title=" + encodeURIComponent(number);
  }

  var itemId = number || ("115_" + file.pickcode);

  console.log("[pan115] [FALLBACK] filename:", file.filename,
              "number:", number, "title:", title);

  return {
    id: itemId,
    vod_id: itemId,
    type: "url",
    title: title,
    name: title,
    originalTitle: number || title,
    backdropPath: backdropPath,
    coverUrl: backdropPath,
    posterPath: backdropPath,
    mediaType: "movie",
    link: link,
    description: description
  };
}

async function buildBrowseItem(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return null;

  console.log("[pan115/buildBrowseItem] filename:", file.filename,
              "pickcode:", file.pickcode);

  try {
    var number = extractNumber(file.filename);
    var displayTitle = displayTitleFromFile(file.filename);
    console.log("[pan115/buildBrowseItem] number:", number,
                "displayTitle:", displayTitle);

    var meta = null;
    if (number) {
      meta = await enrichViaMissav(number);
    }

    var title = (meta && meta.title) ? meta.title : displayTitle;
    var backdropPath = (meta && meta.coverUrl) ? meta.coverUrl
                    : (meta && meta.fallbackCover) ? meta.fallbackCover
                    : "";

    console.log("[pan115/buildBrowseItem] metaHit:", !!meta,
                "title:", title,
                "backdropPath:", !!backdropPath);

    var descParts = [];
    if (number) descParts.push("番号: " + number);
    descParts.push("原文件: " + file.filename);
    if (formatSize(file.size)) descParts.push("大小: " + formatSize(file.size));
    if (meta && meta.source) descParts.push("元数据: " + meta.source);
    var description = descParts.filter(Boolean).join(" · ");

    PICKCODE_FILE_MAP[file.pickcode] = {
      title: title,
      filename: file.filename,
      size: file.size,
      number: number,
      backdropPath: backdropPath,
      description: description
    };

    var link = "115detail://" + file.pickcode;
    if (number) {
      link += "?title=" + encodeURIComponent(number);
    }

    var itemId = number || ("115_" + file.pickcode);

    return {
      id: itemId,
      vod_id: itemId,
      type: "url",
      title: title,
      name: title,
      originalTitle: number || title,
      backdropPath: backdropPath,
      coverUrl: backdropPath,
      posterPath: backdropPath,
      mediaType: "movie",
      link: link,
      description: description
    };
  } catch (err) {
    console.warn("[pan115/buildBrowseItem] 异常, 使用 fallback —",
                 file.filename,
                 err && err.message ? err.message : err);
    return buildFallbackBrowseItem(file);
  }
}

async function buildStreamSources(cookie, file) {
  if (!file.pickcode || !file.filename || !isVideoFile(file.filename)) return [];

  var number = extractNumber(file.filename);
  var displayTitle = number || displayTitleFromFile(file.filename);

  var masterText = await getMasterM3u8Text(cookie, file.pickcode);
  var streams = parseStreams(masterText);
  if (!streams.length) return [];

  var result = streams.map(function (s) {
    var label = s.label || s.quality || "";
    return {
      name: "115 网盘" + (label ? " (" + label + ")" : ""),
      description: (number ? "番号: " : "标题: ") + displayTitle +
                   "\n文件: " + file.filename +
                   (s.resolution ? "\n分辨率: " + s.resolution : ""),
      url: s.url,
      customHeaders: {
        "Referer": "https://115.com/",
        "User-Agent": BASE_HEADERS["User-Agent"]
      }
    };
  });

  console.log("[pan115/buildStreamSources] count:", result.length);
  return result;
}

// 兼容包装：单 stream 版本
async function buildStreamSource(cookie, file) {
  var streams = await buildStreamSources(cookie, file);
  return streams.length ? streams[0] : null;
}

/**
 * parse115DetailLink — 解析 115detail://{pickcode}[?title=xxx] 链接
 */
function parse115DetailLink(link) {
  var cleanLink = String(link || "");
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  return {
    pickcode: qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart,
    query: qIndex >= 0 ? pathPart.slice(qIndex + 1) : ""
  };
}

/**
 * handleDirectPickcodeResource — 115detail:// 直播放路径
 * 不依赖番号，不用 searchFiles，直接用 pickcode 获取 115 播放源
 */
async function handleDirectPickcodeResource(params, link) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) return [];

  var parsed = parse115DetailLink(link);
  var pickcode = parsed.pickcode;
  if (!pickcode) return [];

  var cached = PICKCODE_FILE_MAP[pickcode] || {};
  var filename = cached.filename || params.title || params.name || "115-video.mp4";
  var file = {
    pickcode: pickcode,
    filename: filename,
    size: cached.size || 0
  };

  var sources = await buildStreamSources(cookie, file);
  console.log("[pan115/directPickcode] pickcode:", pickcode, "filename:", filename, "streams:", sources.length);
  return sources;
}

// ==================== 入口函数 ====================

async function loadFolder(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);

  var cid = getText(params.cid) || "0";
  var page = parseInt(params.page || "1", 10) || 1;

  if (!cookie) {
    return [{
      id: "no-cookie",
      type: "url",
      title: "需要 115 Cookie",
      backdropPath: "",
      mediaType: "movie",
      link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  try {
    var files = await listFolder(cookie, cid, page);
    var folders = [];
    var videoFiles = [];
    for (var fi = 0; fi < files.length; fi++) {
      if (files[fi].isdir) folders.push(files[fi]);
      else if (isVideoFile(files[fi].filename)) videoFiles.push(files[fi]);
    }

    var results = [];
    for (var di = 0; di < folders.length; di++) {
      results.push({
        id: "https://115.com/dir/" + folders[di].cid,
        type: "url",
        title: "\u{1F4C1} " + folders[di].filename,
        backdropPath: "",
        mediaType: "movie",
        link: "",
        description: "子文件夹（当前版本暂不支持递归浏览）"
      });
    }

    if (!videoFiles.length) {
      return folders.length ? results : [{
        id: "empty", type: "url", title: "空文件夹",
        backdropPath: "", mediaType: "movie", link: "",
        description: "该目录下没有内容"
      }];
    }

    var itemPromises = videoFiles.map(function (f) {
      return buildBrowseItem(cookie, f)["catch"](function (err) {
        console.warn("[pan115/loadFolder] buildBrowseItem 未捕获异常(不应发生):",
                     f.filename, err && err.message ? err.message : err);
        return buildFallbackBrowseItem(f);
      });
    });
    var items = await Promise.all(itemPromises);
    for (var ii = 0; ii < items.length; ii++) {
      if (items[ii]) results.push(items[ii]);
    }

    return results.length ? results : [{
      id: "no-video", type: "url", title: "无可用视频",
      backdropPath: "", mediaType: "movie", link: "",
      description: "未能解析到可播放的视频文件"
    }];
  } catch (err) {
    console.error("[pan115] loadFolder:", err && err.message ? err.message : err);
    return [{
      id: "error", type: "url", title: "加载失败",
      backdropPath: "", mediaType: "movie", link: "",
      description: err && err.message ? err.message : "请检查 Cookie 或目录 ID 是否正确"
    }];
  }
}

// --- loadDetail (v1.2.0: 路由拆分) ---

// --- loadResource (v1.2.0: 移除 testOfflineMagnet 自动提交) ---
async function _loadResource115(params) {
  var link = String(params && params.link || "");

  // 1. 离线候选卡片点击
  if (link.indexOf("offline-submit://") === 0) {
    console.log("[pan115/stream] offline-submit detected:", link);
    return await handleOfflineSubmitFromResource(params, link);
  }

  // 2. 115 浏览页本地文件：直接按 pickcode 播放（不依赖番号/搜索）
  if (link.indexOf("115detail://") === 0) {
    console.log("[pan115/stream] 115detail detected:", link);
    return await handleDirectPickcodeResource(params, link);
  }

  // 3. 外部详情页聚合：需要番号搜索（JAV）或欧美 scene key 搜索
  console.log("[pan115/stream] params keys:", JSON.stringify(Object.keys(params)));
  try {
    var cookie = resolveCookie(params);
    syncCookie(cookie);
    console.log("[pan115/stream] cookie length:", (cookie || "").length, "| has value:", !!cookie);
    if (!cookie) { console.log("[pan115/stream] cookie empty, abort"); return []; }

    var texts = [];
    if (params.title) texts.push(params.title);
    if (params.name) texts.push(params.name);
    if (params.originalTitle) texts.push(params.originalTitle);
    if (params.id) texts.push(params.id);
    if (params.vod_id) texts.push(params.vod_id);
    if (params.link) texts.push(params.link);
    if (params.description) texts.push(params.description);
    if (params.episodeName) texts.push(params.episodeName);
    if (params.airDate) texts.push(params.airDate);
    var combined = texts.join(" ");
    console.log("[pan115/stream] combined text:", combined.slice(0, 120));

    var matchKey = extractMatchKey(combined);
    console.log("[pan115/stream] matchKey:", JSON.stringify(matchKey));
    if (!matchKey) { console.log("[pan115/stream] no match key, abort"); return []; }

    console.log("[pan115/stream] searchFiles keyword:", matchKey.searchText);
    var files = await searchFiles(cookie, matchKey.searchText);

    console.log("[pan115/stream] searchFiles result count:", files.length);
    if (!files.length) {
      console.log("[pan115/stream] no files found");
      return [];
    }

    var matched = [];
    if (matchKey.type === "jav") {
      // JAV：维持原有严格匹配逻辑
      var normalizedTarget = matchKey.key.replace(/[^a-z0-9]/gi, "").toLowerCase();
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(normalizedTarget) !== -1) matched.push(files[mi]);
      }
      console.log("[pan115/stream] JAV matched count:", matched.length);
    } else if (matchKey.type === "western") {
      // Western：用 strictTarget 做 normalized contains 匹配
      var strictTarget = matchKey.strictTarget;
      console.log("[pan115/stream] western strictTarget:", strictTarget);
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(strictTarget) !== -1) matched.push(files[mi]);
      }
      console.log("[pan115/stream] western matched count:", matched.length);
    } else if (matchKey.type === "western_date") {
      // Western date 弱匹配：筛选候选后再评分
      var strictTarget = matchKey.strictTarget;
      console.log("[pan115/stream] western_date strictTarget:", strictTarget, "displayTitle:", matchKey.displayTitle);
      var candidates = [];
      for (var mi = 0; mi < files.length; mi++) {
        var fn = String(files[mi].filename).replace(/[^a-z0-9]/gi, "").toLowerCase();
        if (fn.indexOf(strictTarget) !== -1) candidates.push(files[mi]);
      }
      console.log("[pan115/stream] western_date candidates count:", candidates.length);
      if (candidates.length === 1) {
        matched = candidates;
        console.log("[pan115/stream] western_date [WEAK] exact match:", candidates[0].filename);
      } else if (candidates.length > 1) {
        // 评分排序：排除 trailer/sample/preview，大文件优先
        candidates.sort(function (a, b) {
          return scoreWesternFile(b) - scoreWesternFile(a);
        });
        // 过滤负分文件（明显不是正片的）
        var filtered = candidates.filter(function (f) { return scoreWesternFile(f) >= 0; });
        if (filtered.length === 0) {
          // 全部负分，取最不坏的
          matched = [candidates[0]];
          console.log("[pan115/stream] western_date [WEAK] all bad, best of worst:", candidates[0].filename);
        } else if (filtered.length === 1) {
          matched = filtered;
          console.log("[pan115/stream] western_date [WEAK] best candidate:", filtered[0].filename);
        } else {
          // 多个候选，取评分最高的
          matched = [filtered[0]];
          console.log("[pan115/stream] western_date [WEAK] top scored:", filtered[0].filename,
                      "skipped", filtered.length - 1, "others");
        }
      }
    }

    console.log("[pan115/stream] matched count:", matched.length, "| files total:", files.length);
    if (!matched.length) {
      console.log("[pan115/stream] no match among", files.length, "files");
      return [];
    }

    var promises = matched.map(function (f) {
      return buildStreamSources(cookie, f)["catch"](function (err) {
        console.warn("[pan115/stream] buildStreamSources failed:", f && f.filename, err && err.message || err);
        return [];
      });
    });
    var nested = await Promise.all(promises);
    var streams = [];
    for (var si = 0; si < nested.length; si++) {
      if (nested[si] && nested[si].length) {
        streams = streams.concat(nested[si]);
      }
    }
    return streams;
  } catch (err) {
    console.error("[pan115/stream] loadResource:", err && err.message ? err.message : err);
    return [];
  }
}

// --- searchPan115 ---
async function searchPan115(params) {
  var cookie = resolveCookie(params);
  syncCookie(cookie);
  if (!cookie) {
    return [{
      id: "no-cookie", type: "url", title: "需要 115 Cookie",
      backdropPath: "", mediaType: "movie", link: "",
      description: "请在参数或全局设置中填入 115 Cookie"
    }];
  }

  var keyword = getText(params.keyword);
  if (!keyword) return [];

  try {
    var files = await searchFiles(cookie, keyword);
    var videoFiles = files.filter(function (f) { return isVideoFile(f.filename); });

    var promises = videoFiles.map(function (f) {
      return buildBrowseItem(cookie, f)["catch"](function () { return null; });
    });
    var items = await Promise.all(promises);
    return items.filter(Boolean);
  } catch (err) {
    console.error("[pan115] searchPan115:", err && err.message ? err.message : err);
    return [];
  }
}

// ==================== JavDB API 封装（自包含，不依赖 TAVDB 模块）====================

/* JavDB API MD5 签名（轻量实现，与 TAVDB 模块算法一致） */
function javdbMd5(s) {
  function md5cycle(h, x) {
    var a = h[0], b = h[1], c = h[2], d = h[3];
    a = ff(a, b, c, d, x[0], 7, -680876936); d = ff(d, a, b, c, x[1], 12, -389564586); c = ff(c, d, a, b, x[2], 17, 606105819); b = ff(b, c, d, a, x[3], 22, -1044525330);
    a = ff(a, b, c, d, x[4], 7, -176418897); d = ff(d, a, b, c, x[5], 12, 1200080426); c = ff(c, d, a, b, x[6], 17, -1473231341); b = ff(b, c, d, a, x[7], 22, -45705983);
    a = ff(a, b, c, d, x[8], 7, 1770035416); d = ff(d, a, b, c, x[9], 12, -1958414417); c = ff(c, d, a, b, x[10], 17, -42063); b = ff(b, c, d, a, x[11], 22, -1990404162);
    a = ff(a, b, c, d, x[12], 7, 1804603682); d = ff(d, a, b, c, x[13], 12, -40341101); c = ff(c, d, a, b, x[14], 17, -1502002290); b = ff(b, c, d, a, x[15], 22, 1236535329);
    a = gg(a, b, c, d, x[1], 5, -165796510); d = gg(d, a, b, c, x[6], 9, -1069501632); c = gg(c, d, a, b, x[11], 14, 643717713); b = gg(b, c, d, a, x[0], 20, -373897302);
    a = gg(a, b, c, d, x[5], 5, -701558691); d = gg(d, a, b, c, x[10], 9, 38016083); c = gg(c, d, a, b, x[15], 14, -660478335); b = gg(b, c, d, a, x[4], 20, -405537848);
    a = gg(a, b, c, d, x[9], 5, 568446438); d = gg(d, a, b, c, x[14], 9, -1019803690); c = gg(c, d, a, b, x[3], 14, -187363961); b = gg(b, c, d, a, x[8], 20, 1163531501);
    a = gg(a, b, c, d, x[13], 5, -1444681467); d = gg(d, a, b, c, x[2], 9, -51403784); c = gg(c, d, a, b, x[7], 14, 1735328473); b = gg(b, c, d, a, x[12], 20, -1926607734);
    a = hh(a, b, c, d, x[5], 4, -378558); d = hh(d, a, b, c, x[8], 11, -2022574463); c = hh(c, d, a, b, x[11], 16, 1839030562); b = hh(b, c, d, a, x[14], 23, -35309556);
    a = hh(a, b, c, d, x[1], 4, -1530992060); d = hh(d, a, b, c, x[4], 11, 1272893353); c = hh(c, d, a, b, x[7], 16, -155497632); b = hh(b, c, d, a, x[10], 23, -1094730640);
    a = hh(a, b, c, d, x[13], 4, 681279174); d = hh(d, a, b, c, x[0], 11, -358537222); c = hh(c, d, a, b, x[3], 16, -722521979); b = hh(b, c, d, a, x[6], 23, 76029189);
    a = hh(a, b, c, d, x[9], 4, -640364487); d = hh(d, a, b, c, x[12], 11, -421815835); c = hh(c, d, a, b, x[15], 16, 530742520); b = hh(b, c, d, a, x[2], 23, -995338651);
    a = ii(a, b, c, d, x[0], 6, -198630844); d = ii(d, a, b, c, x[7], 10, 1126891415); c = ii(c, d, a, b, x[14], 15, -1416354905); b = ii(b, c, d, a, x[5], 21, -57434055);
    a = ii(a, b, c, d, x[12], 6, 1700485571); d = ii(d, a, b, c, x[3], 10, -1894986606); c = ii(c, d, a, b, x[10], 15, -1051523); b = ii(b, c, d, a, x[1], 21, -2054922799);
    a = ii(a, b, c, d, x[8], 6, 1873313359); d = ii(d, a, b, c, x[15], 10, -30611744); c = ii(c, d, a, b, x[6], 15, -1560198380); b = ii(b, c, d, a, x[13], 21, 1309151649);
    a = ii(a, b, c, d, x[4], 6, -145523070); d = ii(d, a, b, c, x[11], 10, -1120210379); c = ii(c, d, a, b, x[2], 15, 718787259); b = ii(b, c, d, a, x[9], 21, -343485551);
    h[0] = safe_add(a, h[0]); h[1] = safe_add(b, h[1]); h[2] = safe_add(c, h[2]); h[3] = safe_add(d, h[3]);
  }
  function cmn(q, a, b, x, s, t) { return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function rol(n, b) { return (n << b) | (n >>> (32 - b)); }
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function str2binl(str) {
    var bin = [];
    for (var i = 0; i < str.length * 8; i += 8) { bin[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32); }
    return bin;
  }
  function binl2hex(binarray) {
    var hex = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      hex += "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) +
             "0123456789abcdef".charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15);
    }
    return hex;
  }
  var x = str2binl(s);
  var lenBits = s.length * 8;
  x[lenBits >> 5] |= 0x80 << ((lenBits) % 32);
  while (((x.length * 32) % 512) !== 448) { x.push(0); }
  x.push(lenBits & 0xFFFFFFFF);
  x.push(Math.floor(lenBits / 0x100000000) & 0xFFFFFFFF);
  var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
  for (var i = 0; i < x.length; i += 16) { md5cycle(h, x.slice(i, i + 16)); }
  return binl2hex(h);
}

var JAVDB_BASE_URL = "https://jdforrepam.com/api";
var JAVDB_SIGN_KEY = "71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa";
var JAVDB_TOKEN_KEY = "javdb_token";
var JAVDB_TOKEN_EXP_KEY = "javdb_token_expires";

function javdbSig() {
  var ts = Math.floor(Date.now() / 1000);
  return ts + ".lpw6vgqzsp." + javdbMd5(String(ts) + JAVDB_SIGN_KEY);
}

async function javdbLogin(username, password) {
  var ts = Math.floor(Date.now() / 1000);
  var sig = ts + ".lpw6vgqzsp." + javdbMd5(String(ts) + JAVDB_SIGN_KEY);
  var body = {
    username: username, password: password,
    device_uuid: "04b9534d-5118-53de-9f87-2ddded77111e", device_name: "MagnetBoard",
    device_model: "Server", platform: "ios", system_version: "17.4",
    app_version: "official", app_version_number: "1.9.29", app_channel: "official"
  };
  var resp = await Widget.http.post(JAVDB_BASE_URL + "/v1/sessions", body, {
    headers: { "jdSignature": sig, "User-Agent": "Dart/3.5 (dart:io)", "Content-Type": "application/json" }
  });
  if (!resp || !resp.data) throw new Error("JavDB 登录无响应");
  var d = resp.data;
  if (d.success === 1 && d.data && d.data.token) {
    Widget.storage.set(JAVDB_TOKEN_KEY, d.data.token);
    Widget.storage.set(JAVDB_TOKEN_EXP_KEY, String(Math.floor(Date.now() / 1000) + 7 * 24 * 3600));
    return d.data.token;
  }
  throw new Error(d.message || "JavDB 登录失败");
}

async function javdbEnsureToken(username, password) {
  if (!username || !password) throw new Error("JavDB 账号密码未设置");
  var token = await Widget.storage.get(JAVDB_TOKEN_KEY);
  var expires = await Widget.storage.get(JAVDB_TOKEN_EXP_KEY);
  if (token && expires && Math.floor(Date.now() / 1000) < Number(expires)) return token;
  return javdbLogin(username, password);
}

async function javdbApiGet(endpoint, username, password) {
  var token = await javdbEnsureToken(username, password);
  var resp = await Widget.http.get(JAVDB_BASE_URL + endpoint, {
    headers: { "jdSignature": javdbSig(), "User-Agent": "Dart/3.5 (dart:io)", "Authorization": "Bearer " + token }
  });
  if (!resp || !resp.data) throw new Error("JavDB API 空响应: " + endpoint);
  var raw = resp.data;
  var retried2 = false;
  while (raw && raw.success === 0 && !retried2) {
    console.warn("[javdbApiGet] " + endpoint + " 返回 success=0, message:", raw.message || "", "将清除 token 并重新登录");
    retried2 = true;
    Widget.storage.set(JAVDB_TOKEN_KEY, "");
    try {
      token = await javdbLogin(username, password);
    } catch (e) {
      console.warn("[javdbApiGet] 重新登录失败:", e && e.message || e);
      break;
    }
    resp = await Widget.http.get(JAVDB_BASE_URL + endpoint, {
      headers: { "jdSignature": javdbSig(), "User-Agent": "Dart/3.5 (dart:io)", "Authorization": "Bearer " + token }
    });
    raw = resp && resp.data;
  }
  if (raw && raw.success === 0) {
    console.warn("[javdbApiGet] 重试后仍然返回 success=0, endpoint:", endpoint, "message:", raw.message || "", "data:", JSON.stringify(raw).slice(0, 500));
  }
  return raw;
}

/**
 * 通过 JAV 番号直接搜索并获取磁力列表（完全自包含，不依赖 TAVDB 模块）
 * @param {string} javNumber - 番号如 "SSIS-834"
 * @param {string} username - JavDB 账号
 * @param {string} password - JavDB 密码
 * @returns {Array|null} 排序后的磁力列表，或 null
 */
async function javdbSearchAndGetMagnets(javNumber, username, password) {
  if (!username || !password) {
    console.log("[pan115/javdb] no JavDB credentials provided");
  }
  // 1. 先搜索番号获取影片 ID
  var searchRaw = await javdbApiGet("/v2/search?q=" + encodeURIComponent(javNumber) + "&type=video&page=1&limit=5", username, password);
  if (!searchRaw || searchRaw.success !== 1) return null;
  var movies = (searchRaw.data && searchRaw.data.movies) || searchRaw.movies || [];
  // 精确匹配番号（不区分大小写）
  var target = javNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
  var matched = null;
  for (var i = 0; i < movies.length; i++) {
    var mn = String(movies[i].number || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (mn === target) { matched = movies[i]; break; }
  }
  if (!matched) matched = movies[0]; // 无精确匹配则取第一条
  if (!matched || !matched.id) return null;

  // 2. 获取磁力列表
  var magRaw = await javdbApiGet("/v1/movies/" + encodeURIComponent(matched.id) + "/magnets", username, password);
  if (!magRaw || magRaw.success !== 1) return null;
  var magnets = (magRaw.data && magRaw.data.magnets) || [];
  for (var mi = 0; mi < magnets.length; mi++) {
    magnets[mi].magnet = "magnet:?xt=urn:btih:" + (magnets[mi].hash || "");
  }
  // 排序：HD → 中文字幕 → 大小降序
  magnets.sort(function (a, b) {
    if (a.hd !== b.hd) return a.hd ? -1 : 1;
    if (a.cnsub !== b.cnsub) return a.cnsub ? -1 : 1;
    return (b.size || 0) - (a.size || 0);
  });
  return magnets;
}

// ==================== 自动离线：从 JavDB 获取磁力并提交 115 ====================

/**
 * 当 115 搜索不到文件时，尝试从 JavDB API 获取磁力并自动提交离线
 * @param {object} params - loadResource 的 params
 * @param {string} cookie - 115 Cookie
 * @param {object} matchKey - extractMatchKey 的返回
 * @returns {Array|null} 操作回执流媒体项，或 null（无需处理）
 */
async function tryAutoOfflineFromJavDB(params, cookie, matchKey) {
  // 1. 仅对 JAV 番号启用自动离线
  if (!matchKey || matchKey.type !== "jav") return null;

  var dvdId = matchKey.key || "";
  if (!dvdId) return null;

  // 2. 防重：同一番号 1 小时内不重复触发
  var dedupKey = "auto-offline-attempted:" + dvdId;
  var lastAttempt = storeGetJSON(dedupKey, null);
  if (lastAttempt && (Date.now() - lastAttempt.time) < 3600000) {
    console.log("[pan115/auto-offline] skipped (dedup):", dvdId, "last attempt:", new Date(lastAttempt.time).toISOString());
    return null;
  }

  // 3. 获取磁力列表
  console.log("[pan115/auto-offline] fetching magnets for:", dvdId);
  var magnets = null;

  // 自包含调用 JavDB API（凭证从 params.username / params.password）
  var javdbUser = String(params && params.username || "");
  var javdbPass = String(params && params.password || "");
  if (javdbUser && javdbPass) {
    try {
      magnets = await javdbSearchAndGetMagnets(dvdId, javdbUser, javdbPass);
      console.log("[pan115/auto-offline] javdbSearchAndGetMagnets result:", magnets ? magnets.length : 0);
    } catch (e) {
      console.warn("[pan115/auto-offline] javdbSearchAndGetMagnets error:", e && e.message || e);
      magnets = null;
    }
  }

  if (!magnets || !magnets.length) {
    console.log("[pan115/auto-offline] no magnets from any source");
    storeSetJSON(dedupKey, { time: Date.now(), reason: "no-magnets" });
    return null;
  }

  // 4. 取最佳磁力（已排序：HD → 中文字幕 → 大文件优先）
  var best = magnets[0];
  var maglink = best.magnet || "";
  if (!maglink) {
    console.log("[pan115/auto-offline] best magnet has no url");
    storeSetJSON(dedupKey, { time: Date.now(), reason: "no-url" });
    return null;
  }
  console.log("[pan115/auto-offline] best magnet:", best.name, maglink.slice(0, 60));

  // 5. 按 hash 二次防重
  var hashKey = "offline-submitted:" + dvdId + ":" + (best.hash || "");
  var alreadySubmitted = storeGetJSON(hashKey, null);
  if (alreadySubmitted && alreadySubmitted.ok) {
    console.log("[pan115/auto-offline] already submitted, skip:", best.hash);
    return null;
  }
  var pendingKey = "offline-pending:" + dvdId + ":" + (best.hash || "");
  var alreadyPending = storeGetJSON(pendingKey, null);
  if (alreadyPending) {
    console.log("[pan115/auto-offline] already pending, skip:", best.hash);
    return null;
  }
  storeSetJSON(pendingKey, { time: Date.now(), hash: best.hash });

  // 6. 提交离线
  console.log("[pan115/auto-offline] submitting to 115...");
  var result;
  try {
    result = await offlineOneClick(cookie, maglink);
    console.log("[pan115/auto-offline] result:", JSON.stringify(result));
  } catch (e) {
    console.error("[pan115/auto-offline] offlineOneClick error:", e && e.message || e);
    storeSetJSON(dedupKey, { time: Date.now(), reason: "submit-error" });
  }

  // 7. 记录结果
  if (result && result.state) {
    storeSetJSON(hashKey, { ok: true, time: Date.now(), info_hash: result.info_hash });
    console.log("[pan115/auto-offline] ✅ success, info_hash:", result.info_hash);
  } else {
    console.warn("[pan115/auto-offline] ❌ failed:", result && result.error || "unknown");
    storeSetJSON(dedupKey, { time: Date.now(), reason: "submit-failed", error: result && result.error });
  }

  // 8. 返回操作回执
  var sizeKB = best.size || 0;
  var sizeLabel = sizeKB >= 1048576
    ? (sizeKB / 1048576).toFixed(1) + "GB"
    : Math.round(sizeKB / 1024) + "MB";
  return [{
    url: "",
    name: "已提交离线",
    description: "JavDB 磁力已自动提交到 115 离线\n"
      + (best.name || "") + "\n"
      + "大小: " + sizeLabel + " | " + (best.files_count || "?") + " 文件\n"
      + "请在 115 离线列表查看进度，稍后刷新即可播放"
  }];
}

// ==================== 115 离线下载函数 ====================

/**
 * 从 Cookie 首段提取 UID
 * Cookie 格式通常为: UID=xxx; CID=...; SEID=...; ...
 */
function extractUidFromCookie(cookie) {
  var first = String(cookie || "").split(";")[0].trim();
  var idx = first.indexOf("=");
  return idx >= 0 ? first.slice(idx + 1) : "";
}

/**
 * 获取 115 离线 token (sign + time)
 * GET https://115.com/?ct=offline&ac=space
 * 返回: { sign, time, size, limit }
 * 需要 Cookie 处于登录态
 */
async function getOfflineSpaceToken(cookie) {
  console.log("[pan115/offline] === getOfflineSpaceToken ===");
  var url = "https://115.com/?ct=offline&ac=space&_=" + Date.now();
  try {
    var raw = await httpGet(url, { headers: cookieHeader(cookie) });
    console.log("[pan115/offline] space raw type:", typeof raw);

    var json = null;
    if (typeof raw === "string") {
      console.log("[pan115/offline] space raw preview:", raw.slice(0, 200));
      json = JSON.parse(raw);
    } else if (raw && typeof raw === "object") {
      console.log("[pan115/offline] space raw object keys:", JSON.stringify(Object.keys(raw)));
      json = raw;
    } else {
      throw new Error("space 返回格式异常: " + String(raw));
    }

    console.log("[pan115/offline] space response state:", json.state, "| has sign:", !!json.sign, "| has time:", !!json.time);
    if (json.state !== true) {
      throw new Error("space 获取失败: " + (json.error || json.error_msg || JSON.stringify(json)));
    }
    return {
      sign: json.sign,
      time: json.time,
      size: json.size,
      limit: json.limit
    };
  } catch (err) {
    console.error("[pan115/offline] space 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 提交一条磁力链离线任务
 * POST https://115.com/web/lixian/?ct=lixian&ac=add_task_url
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ sign: string, time: string|number, uid?: string }} tokenObj - 离线授权参数
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function submitOfflineTask(cookie, magnet, tokenObj) {
  console.log("[pan115/offline] === submitOfflineTask ===");
  var maglink = String(magnet || "").trim();
  var uid = tokenObj.uid || extractUidFromCookie(cookie);
  var body = "url=" + encodeURIComponent(maglink)
           + "&uid=" + encodeURIComponent(uid)
           + "&sign=" + encodeURIComponent(tokenObj.sign)
           + "&time=" + encodeURIComponent(tokenObj.time);

  console.log("[pan115/offline] POST url:", maglink.slice(0, 50));
  console.log("[pan115/offline] uid:", uid);
  console.log("[pan115/offline] body preview:", body.slice(0, 100) + "...");

  try {
    var raw = await Widget.http.post(
      "https://115.com/web/lixian/?ct=lixian&ac=add_task_url",
      body,
      {
        headers: Object.assign({}, BASE_HEADERS, cookieHeader(cookie), {
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": "https://115.com/",
          "Origin": "https://115.com"
        }),
        timeout: 20000
      }
    );

    var data = raw && raw.data;
    console.log("[pan115/offline] POST raw.data type:", typeof data);

    var json = null;
    if (typeof data === "string") {
      console.log("[pan115/offline] POST response:", data.slice(0, 200));
      json = JSON.parse(data);
    } else if (data && typeof data === "object") {
      console.log("[pan115/offline] POST response object keys:", JSON.stringify(Object.keys(data)));
      json = data;
    } else {
      throw new Error("POST 返回格式异常: " + String(data));
    }

    if (json.state === true) {
      console.log("[pan115/offline] success, info_hash:", json.info_hash);
      return { state: true, info_hash: json.info_hash || "" };
    }
    var errMsg = json.errcode === "911"
      ? "账号使用异常，请手工验证"
      : (json.error_msg || json.error || "未知错误");
    console.warn("[pan115/offline] task failed:", errMsg, "| full:", JSON.stringify(json));
    return {
      state: false,
      error: errMsg,
      errcode: json.errcode,
    };
  } catch (err) {
    console.error("[pan115/offline] POST 请求异常:", err && err.message ? err.message : err);
    throw err;
  }
}

/**
 * 一键离线：space token → 提交任务
 * @param {string} cookie - 115 登录 Cookie
 * @param {string} magnet - 磁力链接
 * @param {{ uid?: string }} [opts] - 可选参数，不传则自动从 cookie 提取 uid
 * @returns {{ state: boolean, info_hash?: string, error?: string }}
 */
async function offlineOneClick(cookie, magnet, opts) {
  console.log("[pan115/offline] === offlineOneClick ===");
  console.log("[pan115/offline] cookie length:", (cookie || "").length);
  console.log("[pan115/offline] magnet:", String(magnet || "").slice(0, 80));
  opts = opts || {};
  var token = await getOfflineSpaceToken(cookie);
  console.log("[pan115/offline] space token ok, sign:", token.sign, "| time:", token.time);
  var result = await submitOfflineTask(cookie, magnet, {
    sign: token.sign,
    time: token.time,
    uid: opts.uid || "",
  });
  console.log("[pan115/offline] result:", JSON.stringify(result));
  return result;
}

// ==================== v1.2.0: 存储工具函数 ====================

function storeGetJSON(key, fallback) {
  try {
    var raw = Widget.storage.get(key);
    if (!raw) return fallback;
    if (typeof raw === "string") return JSON.parse(raw);
    return raw;
  } catch (_) {
    return fallback;
  }
}

function storeSetJSON(key, value) {
  try {
    Widget.storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error("[storage] set failed:", e && e.message || e);
  }
}

// ==================== v1.2.0: Sukebei 磁力引擎 ====================

/**
 * 从磁力链接中提取 infoHash
 */
function extractInfoHash(maglink) {
  var m = String(maglink).match(/btih:([a-f0-9]{40})/i);
  return m ? m[1].toLowerCase() : "";
}

/**
 * 简单的字符串哈希（作为 infoHash 缺失时的 fallback）
 */
function simpleHash(s) {
  var hash = 0;
  var str = String(s);
  for (var i = 0; i < str.length; i++) {
    var chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return "h" + Math.abs(hash).toString(36);
}

/**
 * 从磁力标题中提取标签
 * @returns {string[]} tags 数组，如 ["cnsub", "hd", "4k"]
 */
function extractTags(title) {
  var t = String(title || "");
  var tags = [];
  if (/(?:[^A-Za-z]|^)FHDC|[-_]CH?(?:[^A-Za-z]|$)|中字|中文/i.test(t)) tags.push("cnsub");
  if (/\bHD\b/i.test(t)) tags.push("hd");
  if (/\b4K\b/i.test(t)) tags.push("4k");
  return tags;
}

/**
 * 将大小文本（如 "2.3 GiB"）解析为字节数
 */
function parseSizeBytes(s) {
  var m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(GiB|MiB|KiB|GB|MB|KB|B)?/i);
  if (!m) return 0;
  var n = parseFloat(m[1]);
  var u = (m[2] || "B").toUpperCase();
  var map = {
    GIB: 1 << 30, MIB: 1 << 20, KIB: 1 << 10,
    GB: 1 << 30, MB: 1 << 20, KB: 1 << 10, B: 1
  };
  return n * (map[u] || 1);
}

/**
 * 字节数 → 可读大小标签
 */
function formatSizeLabel(bytes) {
  if (!bytes || bytes <= 0) return "";
  var gb = bytes / (1 << 30);
  if (gb >= 1) return gb.toFixed(gb >= 10 ? 1 : 2) + " GB";
  var mb = bytes / (1 << 20);
  if (mb >= 1) return Math.round(mb) + " MB";
  return Math.round(bytes / (1 << 10)) + " KB";
}

/**
 * 磁力候选评分排序
 * 中字优先 > 高清优先 > 合理大小优先 > 大合集降权
 */
function scoreCandidate(c) {
  var score = 0;
  if (c.tags && c.tags.indexOf("cnsub") >= 0) score += 100;
  if (c.tags && c.tags.indexOf("hd") >= 0)    score += 20;
  if (c.tags && c.tags.indexOf("4k") >= 0)    score += 10;
  if (c.sizeBytes) {
    var gb = c.sizeBytes / (1 << 30);
    if (gb >= 0.3 && gb <= 15) score += 20;   // 合理大小范围
    if (gb > 30) score -= 50;                  // 超大合集降权
  }
  return score;
}

/**
 * 从 Sukebei 搜索磁力链接
 * GET https://sukebei.nyaa.si/?f=0&c=0_0&q={kw}
 * 解析 HTML 表格获取磁力行，按评分排序后返回
 */
async function searchMagnetSukebei(kw) {
  var url = SUKEBEI_BASE + "/?f=0&c=0_0&q=" + encodeURIComponent(kw);
  console.log("[magnet:sukebei] url:", url);
  var resp = await Widget.http.get(url, { timeout: 8000 });
  if (!resp || !resp.data) {
    console.log("[magnet:sukebei] no response");
    return [];
  }
  console.log("[magnet:sukebei] html length:", String(resp.data).length);

  var $ = Widget.html.load(resp.data);
  var items = [];

  $("tr.default, tr.success").each(function () {
    var titleEl = $(this).find("td:nth-child(2) > a:nth-child(1)");
    var magEl   = $(this).find("td:nth-child(3) > a:last-child");
    var sizeEl  = $(this).find("td:nth-child(4)");

    var title  = String(titleEl.attr("title") || titleEl.text()).trim();
    var maglink = String(magEl.attr("href") || "").trim();
    var size   = String(sizeEl.text()).trim();

    if (!title || !maglink) return;

    var infoHash = extractInfoHash(maglink);
    var tags = extractTags(title);
    var sizeBytes = parseSizeBytes(size);

    items.push({
      title: title,
      maglink: maglink,
      size: size,
      sizeBytes: sizeBytes,
      infoHash: infoHash || simpleHash(maglink),
      source: "sukebei",
      tags: tags
    });
  });

  items.sort(function (a, b) { return scoreCandidate(b) - scoreCandidate(a); });
  console.log("[magnet:sukebei] result count:", items.length);
  return items;
}

// ==================== v1.2.0: 磁力候选管理与 episodeItems ====================

/**
 * 获取磁力候选（缓存优先）
 * - 缓存命中且未过期 → 直接构建 episodeItems
 * - 缓存未命中 → 搜索 → 写缓存 → 构建
 * - 任何异常返回空数组，不阻塞详情页
 */
async function getMagnetCandidatesWithCache(number) {
  var dvdId = (number || "").trim().toLowerCase();
  if (!dvdId) return [];

  // 1. 读缓存
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  if (cached && Date.now() - cached.time < MAGNET_CACHE_TTL) {
    console.log("[magnet] cache hit:", dvdId, (cached.items || []).length);
    return buildEpisodeItems(dvdId, cached.items);
  }

  // 2. 搜索 Sukebei（超时由 Widget.http.get 的 timeout 参数保障）
  console.log("[magnet] search start:", dvdId);
  var items = [];
  try {
    items = await searchMagnetSukebei(dvdId);
    console.log("[magnet] search done:", dvdId, items.length);
  } catch (e) {
    console.error("[magnet] search failed:", e && e.message || e);
    items = [];
  }

  // 3. 写缓存
  if (items.length > 0) {
    storeSetJSON("magnet-candidates:" + dvdId, { time: Date.now(), items: items });
  } else {
    console.log("[magnet] no candidates, skip empty cache:", dvdId);
  }

  // 4. 构建 episodeItems（含提交状态）
  return buildEpisodeItems(dvdId, items);
}

/**
 * 将磁力候选列表构建为 episodeItems
 * 每条候选是一个 type:"url" 的 VideoItem，禁止设置 videoUrl
 * 提交状态从 storage 读取：✅ 已提交 / ⬇️ 未提交 / ⬇️ 失败可重试
 */
function buildEpisodeItems(dvdId, candidates) {
  if (!candidates || !candidates.length) return [];

  return candidates.map(function (c, idx) {
    var candidateId = c.infoHash || ("idx_" + idx);
    var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);

    var sizeLabel = formatSizeLabel(c.sizeBytes) || c.size || "";
    var tagText = "";
    if (c.tags) {
      if (c.tags.indexOf("cnsub") >= 0) tagText += "｜中文字幕";
      if (c.tags.indexOf("hd") >= 0)    tagText += "｜高清";
      if (c.tags.indexOf("4k") >= 0)    tagText += "｜4K";
    }
    var sourceLabel = "Sukebei";
    var title = "";
    var desc = "";

    if (submitted && submitted.ok) {
      title = "✅ 已提交到115" + (sizeLabel ? "｜" + sizeLabel : "") + tagText;
      desc = "已提交到 115。请返回原详情页刷新，等待资源匹配。";
    } else if (submitted && !submitted.ok) {
      title = "⚠️ 上次提交失败｜" + sizeLabel;
      desc = "点击可重试 · 来源: " + sourceLabel;
    } else {
      title = "⬇️ 115离线｜点击提交｜" + (sizeLabel ? sizeLabel + tagText : "");
      desc = "来源: " + sourceLabel + " · 打开此卡片会提交到 115 离线";
    }

    return {
      id: "offline:" + dvdId + ":" + candidateId,
      type: "url",
      title: title,
      description: desc,
      link: "offline-submit://" + dvdId + "?cid=" + candidateId
      // 不设置 videoUrl / previewUrl / playerType
    };
  });
}

// ==================== v1.2.0: handleNormalDetail 详情页 + 磁力候选区 ====================

/**
 * 处理 115detail:// 正常详情页
 * - 解析 pickcode，构建基础详情
 * - 搜索 115 文件（失败不阻断）
 * - 搜索磁力候选（失败不阻断）
 * - 返回携带 episodeItems 的完整 VideoItem
 */
async function handleNormalDetail(link) {
  var cleanLink = getText(link);

  // 解析 pickcode
  var pathPart = cleanLink.slice("115detail://".length);
  var qIndex = pathPart.indexOf("?");
  var pickcode = qIndex >= 0 ? pathPart.slice(0, qIndex) : pathPart;
  if (!pickcode) return null;

  // 读取元数据缓存
  var cached = PICKCODE_FILE_MAP[pickcode] || {};
  var filename = cached.filename || "";
  var number = cached.number || extractNumber(filename);

  // 兜底解析 query 中的 title
  if (!number && qIndex >= 0) {
    var pairs = pathPart.slice(qIndex + 1).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      if (kv[0] === "title" && kv[1] !== undefined) {
        number = extractNumber(decodeURIComponent(kv[1]));
        break;
      }
    }
  }

  // 构建基础详情（同 v1.1.0 逻辑）
  var title = cached.title || number || displayTitleFromFile(filename) || "115 视频";
  var descParts = [];
  if (number) descParts.push("番号: " + number);
  if (filename) descParts.push("原文件: " + filename);
  if (cached.size && formatSize(cached.size)) descParts.push("大小: " + formatSize(cached.size));
  var description = descParts.join("\n") || cached.description || "";
  var itemId = number || ("115_" + pickcode);

  var item = {
    id: itemId,
    vod_id: itemId,
    type: "detail",
    title: title,
    name: title,
    originalTitle: number || title,
    description: description,
    backdropPath: cached.backdropPath || "",
    coverUrl: cached.backdropPath || "",
    posterPath: cached.backdropPath || "",
    mediaType: "movie",
    link: cleanLink,
    episodeItems: []    // 占位，后续填充
  };

  // 尝试搜索 115 文件（失败不阻断）
  try {
    var cookie = COOKIE_115 || "";
    if (cookie && number) {
      var searchText = number.toLowerCase().replace(/^fc2-/, "");
      await searchFiles(cookie, searchText);
    }
  } catch (e) {
    console.error("[pan115] searchFiles (non-blocking):", e && e.message || e);
  }

  // 搜索磁力候选（失败不阻断）
  var candidates = [];
  if (number) {
    candidates = await getMagnetCandidatesWithCache(number);
  }
  // episodeItems 不放入磁力候选（避免污染详情页标题/分集状态）
  item.episodeItems = [];

  // 离线候选放入 relatedItems，卡片会触发 loadResource → handleOfflineSubmitFromResource
  item.relatedItems = candidates.map(function (c) {
    return {
      id: c.id,
      type: "url",
      title: c.title,
      description: c.description,
      link: c.link
    };
  });
  console.log("[pan115/detail] relatedItems count:", item.relatedItems.length);

  return item;
}

// ==================== v1.2.0: handleOfflineSubmit 离线提交 + 操作回执 ====================

/**
 * 构建操作回执页
 * type:"url" + 不包含 videoUrl，仅展示结果
 */
function buildReceipt(link, ok, title, message) {
  return {
    id: link,
    type: "url",
    title: title,
    description: message,
    link: link
  };
}

/**
 * 处理 offline-submit:// 提交请求
 * - 解析番号和候选 ID
 * - 防重复提交（已成功的候选不再重复提交）
 * - 从缓存中读取磁力候选
 * - 提交 115 离线任务
 * - 写入提交状态缓存
 * - 返回操作回执页
 */
async function handleOfflineSubmit(link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";

  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    return buildReceipt(link, false, "提交失败", "未找到有效的番号和候选标识");
  }

  // 2. 防重复提交
  var submitted = storeGetJSON("offline-submitted:" + dvdId + ":" + candidateId, null);
  if (submitted && submitted.ok) {
    return buildReceipt(link, true, "此前已提交",
      "这条磁力已提交到 115。请返回原详情页并刷新，等待资源匹配。");
  }

  // 3. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    return buildReceipt(link, false, "提交失败",
      "未找到对应的磁力候选，请返回原详情页刷新后重试。");
  }

  // 4. 获取 cookie
  var cookie = COOKIE_115 || "";
  if (!cookie) {
    return buildReceipt(link, false, "提交失败",
      "请先在全局设置或参数中填入 115 Cookie。");
  }

  // 5. 提交 115 离线任务
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
  } catch (e) {
    result = { state: false, error: String(e && e.message || e) };
  }

  // 6. 写入提交状态
  storeSetJSON("offline-submitted:" + dvdId + ":" + candidateId, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || ""
  });

  // 7. 返回回执页
  if (result && result.state === true) {
    return buildReceipt(link, true, "已提交到 115 离线下载",
      "任务已提交。请返回原详情页并刷新，等待 115 资源匹配。");
  }

  return buildReceipt(link, false, "提交失败",
    (result && result.error) || "115 返回失败，请稍后重试。");
}

// ==================== v1.2.0: handleOfflineSubmitFromResource (通过 loadResource 触发离线提交) ====================

/**
 * 当 loadResource 检测到 params.link 以 offline-submit:// 开头时调用。
 * 提交 115 离线任务，不返回任何 stream 资源。
 * 两层防重复：submitted ok 检查 + pending 5 分钟检查。
 */
async function handleOfflineSubmitFromResource(params, link) {
  // 1. 解析参数
  var rest = link.slice("offline-submit://".length);
  var qIdx = rest.indexOf("?");
  var dvdId = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  var cidStr = qIdx >= 0 ? rest.slice(qIdx + 1) : "";
  var candidateId = "";
  cidStr.split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "cid") candidateId = decodeURIComponent(kv[1] || "");
  });

  if (!dvdId || !candidateId) {
    console.error("[pan115/stream] offline-submit parse failed:", link);
    return [];
  }
  console.log("[pan115/stream] offline parsed dvdId:", dvdId, "candidateId:", candidateId);

  // 2. 防重复：检查已提交状态
  var submittedKey = "offline-submitted:" + dvdId + ":" + candidateId;
  var submitted = storeGetJSON(submittedKey, null);
  if (submitted && submitted.ok) {
    console.log("[pan115/stream] offline already submitted, skip:", submittedKey);
    return [];
  }

  // 3. 防重复：检查 pending（5 分钟内不重复）
  var pendingKey = "offline-pending:" + dvdId + ":" + candidateId;
  var pending = storeGetJSON(pendingKey, null);
  if (pending && pending.time && Date.now() - pending.time < 5 * 60 * 1000) {
    console.log("[pan115/stream] offline pending, skip duplicate:", pendingKey);
    return [];
  }

  // 4. 写 pending
  storeSetJSON(pendingKey, { time: Date.now() });

  // 5. 从缓存读取磁力候选
  var cached = storeGetJSON("magnet-candidates:" + dvdId, null);
  var candidates = (cached && cached.items) || [];
  var candidate = null;
  for (var i = 0; i < candidates.length; i++) {
    var cid = candidates[i].infoHash || ("idx_" + i);
    if (cid === candidateId) { candidate = candidates[i]; break; }
  }

  if (!candidate) {
    console.error("[pan115/stream] offline candidate not found for:", candidateId);
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "candidate not found" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }
  console.log("[pan115/stream] offline candidate found:", candidate.title);

  // 6. 获取 cookie
  var cookie = resolveCookie(params) || COOKIE_115 || "";
  syncCookie(cookie);
  console.log("[pan115/stream] offline cookie length:", cookie.length);
  if (!cookie) {
    console.error("[pan115/stream] offline submit failed: no cookie");
    storeSetJSON(submittedKey, { ok: false, time: Date.now(), error: "no cookie" });
    storeSetJSON(pendingKey, { time: 0, done: true });
    return [];
  }

  // 7. 提交 115 离线任务
  console.log("[pan115/stream] offline submit start");
  var result;
  try {
    result = await offlineOneClick(cookie, candidate.maglink);
    console.log("[pan115/stream] offline submit result:", JSON.stringify(result));
  } catch (e) {
    var errMsg = e && e.message || String(e);
    console.error("[pan115/stream] offline submit failed:", errMsg);
    result = { state: false, error: errMsg };
  }

  // 8. 写入提交状态
  storeSetJSON(submittedKey, {
    ok: result && result.state === true,
    time: Date.now(),
    title: candidate.title,
    sizeText: formatSizeLabel(candidate.sizeBytes) || candidate.size || "",
    message: result && result.error || ""
  });

  // 9. 清除 pending
  storeSetJSON(pendingKey, { time: 0, done: true });

  // 10. 返回空数组（不提供 stream 资源）
  return [];
}

// ==================== jable.tv 流源（v2.5 原版引擎）====================

function normalizeCode(value) {
  return String(value || "").toUpperCase().replace(/[\s_\-]+/g, "");
}

function extractSearchCode(text, options = {}) {
  const allowPureNumeric = options.allowPureNumeric !== false;
  const s = String(text || "").toUpperCase().replace(/\./g, " ").replace(/_/g, "-").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const patterns = [
    /\bFC2(?:[- ]?PPV)?[- ]?\d{5,8}\b/,
    /\bCARIB[- ]?\d{6,8}\b/,
    /\b1PONDO[- ]?\d{6,8}\b/,
    /\bHEYZO[- ]?\d{3,6}\b/,
    /\bT28[- ]?\d{6,8}\b/,
    /\b(?:S2M|MIAA|SSNI|SNIS|IPX|IPZZ|SSIS|JUQ|MIDE|MIDV|STARS|ABW|RKI|DVAJ|WANZ|LULU|DLDSS|VRTM|SDMU|SDDE|MKMP|HMN|MUDR|ADN|CAWD|PPPE|PRED|MGR|SHKD|MXGS|FSDSS|JUL|KTB|MIAB|GVH|MIMK|JUY|JUTA|IDBD|HND|DASD|CLO|BF|HONB|ROE|CEMD|MIUM|NITR|RCTD|RCT|IPVR|MIBD|JUR|JURD|SOE|ORE|PYO|START|NSFS)\s*[-_ ]?\d{2,6}[A-Z]?(?:[-_ ]?[A-Z]{0,4})?\b/,
    /\b[A-Z]{2,10}\s*[-_ ]?\d{2,8}[A-Z]?\b/
  ];
  if (allowPureNumeric) patterns.push(/\b\d{6,8}\b/);
  for (const reg of patterns) {
    const match = s.match(reg);
    if (match && match[0]) return match[0].replace(/\s+/g, "").replace(/_/g, "-").replace(/-+/g, "-").toUpperCase();
  }
  return "";
}

function collectStringValues(value, depth = 0, out = [], visited = new Set()) {
  if (value === null || value === undefined || depth > 5) return out;
  const valueType = typeof value;
  if (valueType === "string" || valueType === "number") {
    const text = String(value).trim();
    if (text) out.push(text);
    return out;
  }
  if (valueType !== "object") return out;
  if (visited.has(value)) return out;
  visited.add(value);
  if (Array.isArray(value)) { for (const item of value) collectStringValues(item, depth + 1, out, visited); return out; }
  for (const key of Object.keys(value)) collectStringValues(value[key], depth + 1, out, visited);
  return out;
}

function extractCodeFromParams(params = {}) {
  const priorityCandidates = [
    params.code, params.videoId, params.number,
    params.fileName, params.filename, params.file_name, params.name, params.path,
    params.filePath, params.file_path, params.mediaPath, params.media_path,
    params.itemPath, params.item_path, params.localPath, params.local_path,
    params.originalFilename, params.originalFileName,
    params.id, params.title, params.seriesName, params.originalTitle, params.originalName,
    params.episodeName, params.description, params.genreTitle, params.overview,
    params.link, params.url, params.videoUrl, params.playUrl, params.streamUrl,
  ];
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
    for (const source of params.mediaSources) {
      priorityCandidates.push(source && source.name, source && source.fileName, source && source.filename, source && source.path, source && source.url, source && source.streamUrl);
    }
  }
  for (const value of priorityCandidates) { const code = extractSearchCode(value, { allowPureNumeric: true }); if (code) return code; }
  for (const value of collectStringValues(params)) { const code = extractSearchCode(value, { allowPureNumeric: false }); if (code) return code; }
  return "";
}

function parseJableSearchResults(html, targetCode) {
  if (!html || typeof html !== "string") return [];
  const $ = Widget.html.load(html);
  const results = [];
  const seen = new Set();
  $(".video-img-box").each((i, el) => {
    const $el = $(el);
    const $titleLink = $el.find(".title a").first();
    const href = $titleLink.attr("href") || "";
    const link = String(href).trim();
    if (!link || !link.includes("jable.tv") || seen.has(link)) return;
    const title = $titleLink.text().trim();
    const $img = $el.find("img").first();
    const cover = $img.attr("data-src") || $img.attr("src") || "";
    const match = (link.match(/\/([^/?#]+)(?:\?|#|$)/) || [])[1] || "";
    let decoded;
    try { decoded = decodeURIComponent(match); } catch (e) { decoded = match.replace(/%[0-9A-Fa-f]{2}/g, ""); }
    const code = extractSearchCode(decoded.replace(/-/g, " "), { allowPureNumeric: true }) || extractSearchCode(title, { allowPureNumeric: true });
    if (!code) return;
    seen.add(link);
    results.push({ title, link, code, cover });
  });
  if (results.length === 0) {
    $("a[href]").each((i, el) => {
      const href = $(el).attr("href") || "";
      const link = String(href).trim();
      if (!link || !link.includes("jable.tv") || seen.has(link)) return;
      const match = (link.match(/\/([^/?#]+)(?:\?|#|$)/) || [])[1] || "";
      let decoded2;
      try { decoded2 = decodeURIComponent(match); } catch (e) { decoded2 = match.replace(/%[0-9A-Fa-f]{2}/g, ""); }
      const codeFromLink = extractSearchCode(decoded2.replace(/-/g, " "), { allowPureNumeric: true });
      if (!codeFromLink) return;
      seen.add(link);
      results.push({ title: $(el).text().trim(), link, code: codeFromLink, cover: "" });
    });
  }
  const targetLoose = normalizeCode(targetCode);
  const exact = results.filter(item => normalizeCode(item.code) === targetLoose);
  if (exact.length > 0) return exact;
  return results;
}

function detectJableChineseSubtitle(html) {
  const $ = Widget.html.load(html);
  const keywords = $('meta[name="keywords"]').attr("content") || "";
  const firstKeyword = keywords.split(/[,，]/).map(s => s.trim()).filter(Boolean)[0];
  if (firstKeyword === "中文字幕") return true;
  const description = $('meta[name="description"]').attr("content") || "";
  if (description.includes("中文字幕版") || description.includes("更新至中文字幕") || description.includes("中文字幕")) return true;
  const lowerHtml = String(html).toLowerCase();
  if (lowerHtml.includes("chinese-subtitle") || lowerHtml.includes("chinese subtitle")) return true;
  return false;
}

async function _loadJableResource(params) {
  try {
    const code = extractCodeFromParams(params);
    if (!code) return [];
    const targetLoose = normalizeCode(code);
    let matched = null;
    const keys = [...new Set([code, code.replace(/-/g, "")])];
    for (const key of keys) {
      const keyword = encodeURIComponent(key);
      const searchUrl = `https://jable.tv/search/${keyword}/?mode=async&function=get_block&block_id=list_videos_videos_list_search_result&q=${keyword}`;
      const resp = await Widget.http.get(searchUrl, { timeout: 8000, headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" } });
      const html = resp && resp.data;
      if (!html) continue;
      const results = parseJableSearchResults(html, code);
      matched = results.find(item => normalizeCode(item.code) === targetLoose);
      if (matched) break;
    }
    if (!matched || !matched.link) return [];
    const detailResp = await Widget.http.get(matched.link, { timeout: 8000, headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", "Referer": "https://jable.tv/" } });
    const detailHtml = detailResp && detailResp.data;
    if (!detailHtml) return [];
    const hlsUrlMatch = detailHtml.match(/var\s+hlsUrl\s*=\s*['"](.*?)['"]/i);
    const hlsUrl = hlsUrlMatch && hlsUrlMatch[1] ? (hlsUrlMatch[1].startsWith("//") ? `https:${hlsUrlMatch[1]}` : hlsUrlMatch[1]) : "";
    if (!hlsUrl) return [];
    const isChineseSubtitle = detectJableChineseSubtitle(detailHtml);
    const sourceName = isChineseSubtitle ? "Jable 中字" : "Jable";
    return [{
      name: sourceName,
      description: `番号：${code}\n字幕：${isChineseSubtitle ? "中文字幕" : "无"}`,
      url: hlsUrl,
      customHeaders: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": matched.link,
        "Origin": "https://jable.tv"
      }
    }];
  } catch (e) {
    return [];
  }
}

// ==================== MissAV 流源 v1.2 ====================

var _MISSAV_BASE_URL = "https://missav.ai";
var _MISSAV_TIMEOUT = 6000;

var _MISSAV_DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Referer": "https://missav.ai/",
  "Connection": "keep-alive"
};

var _MISSAV_PLAY_HEADERS = {
  "Referer": "https://missav.ai/",
  "Origin": "https://missav.ai",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"
};

function _missavToAbsoluteUrl(href) {
  if (!href) return "";
  if (href.indexOf("http") === 0) return href;
  if (href.indexOf("/") === 0) return _MISSAV_BASE_URL + href;
  return _MISSAV_BASE_URL + "/" + href;
}

function _missavExtractCodeFromLink(link) {
  var href = getText(link);
  if (!href) return "";
  var lastPart = href.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || "";
  var cleaned = decodeURIComponent(lastPart)
    .replace(/-uncensored-leak/gi, "")
    .replace(/-chinese-subtitle/gi, "")
    .replace(/-/g, " ");
  return extractSearchCode(cleaned, { allowPureNumeric: true });
}

function _missavClassifyLink(link) {
  var href = getText(link).toLowerCase();
  if (href.indexOf("-uncensored-leak") !== -1) return "无码";
  if (href.indexOf("-chinese-subtitle") !== -1) return "中文";
  return "有码";
}

function _missavParseSearchResults(html, targetCode) {
  if (!html || html.indexOf("Just a moment") !== -1) {
    console.warn("[missav_stream] 可能被 Cloudflare 拦截");
    return [];
  }
  var $ = Widget.html.load(html);
  var results = [];
  var seen = {};

  $("div.group").each(function (i, el) {
    var $el = $(el);
    var $link = $el.find("a.text-secondary").first();
    var href = $link.attr("href");
    if (!href) return;
    var link = _missavToAbsoluteUrl(href);
    if (!link || seen[link]) return;
    seen[link] = true;
    var title = $link.text().trim();
    var codeFromLink = _missavExtractCodeFromLink(link);
    var codeFromTitle = extractSearchCode(title, { allowPureNumeric: true });
    var code = codeFromLink || codeFromTitle;
    results.push({ title: title, link: link, code: code });
  });

  if (results.length === 0) {
    $("a[href]").each(function (i, el) {
      var $el = $(el);
      var href = $el.attr("href");
      if (!href) return;
      var link = _missavToAbsoluteUrl(href);
      if (link.indexOf("/cn/") === -1) return;
      if (seen[link]) return;
      var codeFromLink = _missavExtractCodeFromLink(link);
      if (!codeFromLink) return;
      seen[link] = true;
      results.push({ title: $el.text().trim(), link: link, code: codeFromLink });
    });
  }

  var targetLoose = normalizeCode(targetCode);
  var exact = [];
  for (var ri = 0; ri < results.length; ri++) {
    if (normalizeCode(results[ri].code) === targetLoose) exact.push(results[ri]);
  }
  if (exact.length > 0) return exact;
  return results;
}

async function _missavFindDetailPages(code) {
  var keys = [code, code.replace(/-/g, "")];
  var targetLoose = normalizeCode(code);
  var seen = {};
  var pages = [];

  for (var ki = 0; ki < keys.length; ki++) {
    var url = _MISSAV_BASE_URL + "/cn/search/" + encodeURIComponent(keys[ki]);
    try {
      var resp = await Widget.http.get(url, {
        headers: _MISSAV_DEFAULT_HEADERS,
        timeout: _MISSAV_TIMEOUT
      });
      var html = resp && resp.data || "";
      var results = _missavParseSearchResults(html, code);
      if (!results.length) continue;
      for (var ri = 0; ri < results.length; ri++) {
        var item = results[ri];
        if (normalizeCode(item.code) === targetLoose && !seen[item.link]) {
          seen[item.link] = true;
          pages.push({ link: item.link, code: code, type: _missavClassifyLink(item.link) });
        }
      }
    } catch (e) {
      console.warn("[missav_stream] search failed:", keys[ki], e && e.message || e);
    }
  }
  return pages;
}

function _missavExtractUuid(html) {
  if (!html) return "";
  var $ = Widget.html.load(html);
  var uuid = "";

  $("script").each(function (i, el) {
    var content = $(el).html() || "";
    if (content.indexOf("surrit.com") !== -1 && content.indexOf(".m3u8") !== -1) {
      var m = content.match(/https:\/\/surrit\.com\/([a-f0-9\-]{36})\/[^"'\s]*\.m3u8/i);
      if (m && m[1]) { uuid = m[1]; return false; }
    }
    if (!uuid && content.indexOf("eval(function") !== -1) {
      var um = content.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi);
      if (um && um.length > 0) { uuid = um[0]; return false; }
    }
  });

  if (!uuid) {
    var m = html.match(/surrit\.com\/([a-f0-9\-]{36})\//i);
    if (m && m[1]) uuid = m[1];
  }
  return uuid;
}

async function _missavExtractUuidFromDetail(link) {
  try {
    var resp = await Widget.http.get(link, {
      headers: { "Referer": "https://missav.ai/" },
      timeout: _MISSAV_TIMEOUT
    });
    var html = resp && resp.data || "";
    if (!html || html.indexOf("Just a moment") !== -1) return "";
    return _missavExtractUuid(html);
  } catch (e) {
    return "";
  }
}

async function _missavIsM3U8Available(url) {
  try {
    var resp = await Widget.http.get(url, {
      headers: _MISSAV_PLAY_HEADERS,
      timeout: 1500
    });
    return resp && resp.statusCode === 200 && String(resp.data || "").indexOf("#EXTM3U") !== -1;
  } catch (e) {
    return false;
  }
}

function _missavBuildStreamItem(name, description, url) {
  return { name: name, description: description, url: url, customHeaders: _MISSAV_PLAY_HEADERS };
}

async function _missavBuildStreamItems(uuid, code, detailLink, type) {
  var url1080 = "https://surrit.com/" + uuid + "/1080p/video.m3u8";
  var url720 = "https://surrit.com/" + uuid + "/720p/video.m3u8";
  var items = [];
  var has1080 = await _missavIsM3U8Available(url1080);
  if (has1080) {
    items.push(_missavBuildStreamItem("MissAV " + type + " 1080P", "番号：" + code + "\n类型：" + type + "\n来源：MissAV\n清晰度：1080P", url1080));
  }
  items.push(_missavBuildStreamItem("MissAV " + type + " 720P", "番号：" + code + "\n类型：" + type + "\n来源：MissAV\n清晰度：720P", url720));
  return items;
}

async function _missavLoadResource(params) {
  try {
    var code = extractCodeFromParams(params);
    if (!code) return [];

    var pages = await _missavFindDetailPages(code);
    if (!pages.length) return [];

    var typePriority = { "中文": 0, "无码": 1, "有码": 2 };
    pages.sort(function (a, b) {
      var pa = typePriority[a.type] !== undefined ? typePriority[a.type] : 99;
      var pb = typePriority[b.type] !== undefined ? typePriority[b.type] : 99;
      return pa - pb;
    });

    var allStreams = [];
    for (var pi = 0; pi < pages.length; pi++) {
      var uuid = await _missavExtractUuidFromDetail(pages[pi].link);
      if (!uuid) continue;
      var streams = await _missavBuildStreamItems(uuid, code, pages[pi].link, pages[pi].type);
      for (var si = 0; si < streams.length; si++) allStreams.push(streams[si]);
    }
    return allStreams;
  } catch (e) {
    return [];
  }
}

// ==================== javp.cc 预告片流源 ====================

async function _loadJavpTrailer(params) {
  try {
    var code = extractCodeFromParams(params);
    if (!code) return [];
    var query = String(code).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!query || query.length < 3) return [];

    // 调用 javp.cc API 获取预告片 URL
    var resp = await Widget.http.get("https://javp.cc.cd/trailers/" + encodeURIComponent(query), {
      headers: { "User-Agent": "Dart/3.5 (dart:io)", "Accept": "application/json,text/plain,*/*", "Referer": "https://javp.cc/" },
      timeout: 1800
    });
    var data = typeof (resp && resp.data) === "string" ? JSON.parse(resp.data) : (resp && resp.data);
    var trailerUrl = String(data && data.trailer || "").trim();
    if (!trailerUrl) return [];

    // 提取画质后缀（DMM 格式: xxx{后缀}.mp4，如 xxxhhb.mp4 / xxxmhb.mp4 / xxx4k.mp4）
    var qualityMap = { "4k": "4K", "mhb": "1080P", "hhb": "720P", "dmb": "720P", "ssb": "360P" };
    var qualityMatch = trailerUrl.match(/[_]?(4k|mhb|hhb|dmb|ssb)\.mp4$/i);
    if (!qualityMatch) {
      return [{
        name: "预告片",
        description: "番号：" + code + "\n来源：JavDB 预告片",
        url: trailerUrl,
        customHeaders: { "Referer": "https://www.dmm.co.jp/" }
      }];
    }

    var matchedSuffix = qualityMatch[1].toLowerCase();
    var baseUrl = trailerUrl.slice(0, qualityMatch.index);

    // API 已返回 mhb 或 4k → 直接用
    if (matchedSuffix === "mhb" || matchedSuffix === "4k") {
      var label = qualityMap[matchedSuffix] || "1080P";
      return [{
        name: "预告片 " + label,
        description: "番号：" + code + "\n来源：JavDB 预告片\n清晰度：" + label,
        url: trailerUrl,
        customHeaders: { "Referer": "https://www.dmm.co.jp/" }
      }];
    }

    // API 返回了 hhb/其他 → 探测 mhb 是否存在
    var mhbUrl = baseUrl + "mhb.mp4";
    try {
      var probe = await Widget.http.get(mhbUrl, {
        headers: { "Referer": "https://www.dmm.co.jp/", "User-Agent": "Mozilla/5.0" },
        timeout: 1500
      });
      if (probe && (probe.statusCode === 200 || probe.statusCode === 206)) {
        return [{
          name: "预告片 1080P",
          description: "番号：" + code + "\n来源：JavDB 预告片\n清晰度：1080P",
          url: mhbUrl,
          customHeaders: { "Referer": "https://www.dmm.co.jp/" }
        }];
      }
    } catch (e) {}

    // mhb 不存在，兜底用 API 返回的画质
    var fallbackLabel = qualityMap[matchedSuffix] || "480P";
    return [{
      name: "预告片 " + fallbackLabel,
      description: "番号：" + code + "\n来源：JavDB 预告片\n清晰度：" + fallbackLabel,
      url: trailerUrl,
      customHeaders: { "Referer": "https://www.dmm.co.jp/" }
    }];
  } catch (e) {
    return [];
  }
}


async function loadResource(params) {
  // 并行调用所有流源
  var all = await Promise.allSettled([
    _loadResource115(params),
    _loadJableResource(params),
    _missavLoadResource(params),
    _loadJavpTrailer(params)
  ]);

  var results = [];
  var seenUrls = {};
  var sourceNames = ["115", "jable", "missav", "trailer"];

  for (var si = 0; si < all.length; si++) {
    var status = all[si];
    if (status.status === "rejected" || !status.value || !status.value.length) {
      if (status.status === "rejected") {
        console.error("[loadResource] " + sourceNames[si] + " error:", status.reason && (status.reason.message || status.reason) || status.reason);
      }
      continue;
    }
    var items = status.value;
    for (var i = 0; i < items.length; i++) {
      var url = items[i].url || "";
      if (url && !seenUrls[url]) {
        seenUrls[url] = true;
        results.push(items[i]);
      }
    }
  }

  // 仅当 115 + Jable + MissAV 都无结果时，触发自动离线（预告片不影响此判断）
  var has115 = all[0] && all[0].value && all[0].value.length > 0;
  var hasJable = all[1] && all[1].value && all[1].value.length > 0;
  var hasMissav = all[2] && all[2].value && all[2].value.length > 0;
  var autoOffline = String(params && params.auto_offline || "true") !== "false";
  if (!has115 && !hasJable && !hasMissav && autoOffline) {
    try {
      var cookie = resolveCookie(params);
      syncCookie(cookie);
      var texts = [];
      if (params.title) texts.push(params.title);
      if (params.name) texts.push(params.name);
      if (params.originalTitle) texts.push(params.originalTitle);
      if (params.id) texts.push(params.id);
      if (params.vod_id) texts.push(params.vod_id);
      if (params.link) texts.push(params.link);
      if (params.description) texts.push(params.description);
      if (params.episodeName) texts.push(params.episodeName);
      if (params.airDate) texts.push(params.airDate);
      var combined = texts.join(" ");
      var matchKey = extractMatchKey(combined);
      var autoItems = await tryAutoOfflineFromJavDB(params, cookie, matchKey);
      if (autoItems && autoItems.length) {
        for (var i = 0; i < autoItems.length; i++) {
          var u = autoItems[i].url || "";
          if (u && !seenUrls[u]) {
            seenUrls[u] = true;
            results.push(autoItems[i]);
          }
        }
      }
    } catch (e) {
      console.error("[loadResource] auto offline error:", e && e.message || e);
    }
  }

  return results;
}