var WidgetMetadata = {
  id: "supjav_m3u8_play_test",
  title: "Supjav M3U8 Play Test",
  description: "测试 Supjav / TurboVIP m3u8 是否能通过 customHeaders 播放",
  author: "meeowzzz",
  site: "https://supjav.com",
  version: "0.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "loadResource",
      title: "Supjav M3U8 测试源",
      description: "硬编码测试 m3u8 播放",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15";

function headersFor(url) {
  let referer = "https://supjav.com/";

  try {
    referer = new URL(url).origin + "/";
  } catch (e) {}

  return {
    "Referer": referer,
    "User-Agent": UA,
    "Accept": "*/*"
  };
}

function item(name, url) {
  return {
    name,
    description:
      `URL: ${url}\n` +
      `Referer: ${headersFor(url).Referer}`,
    url,
    customHeaders: headersFor(url)
  };
}

async function loadResource(params = {}) {
  const auto =
    "https://cdn2.turboviplay.com/data1/6a0c1c9b5cfd2/6a0c1c9b5cfd2.m3u8";

  const p1080 =
    "https://hls6.turbosplayer.com/file/9354d09e-536e-11f1-bc5a-920007cd3cfc/master.m3u8";

  const p720 =
    "https://hls5.turbosplayer.com/file/51c9ff40-536c-11f1-9deb-920007ce01c7/master.m3u8";

  const p480 =
    "https://hls5.turbosplayer.com/file/e5d6455d-5368-11f1-9deb-920007ce01c7/master.m3u8";

  return [
    item("Supjav Auto", auto),
    item("Supjav 1080P", p1080),
    item("Supjav 720P", p720),
    item("Supjav 480P", p480)
  ];
}