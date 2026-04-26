export default async function handler(req, res) {
  const YGG_URL =
    "https://yggtorrent.org/api/v1/torrents/top100?category=film-video";

  try {
    console.log("🔄 Fetch YGG...");

    const response = await fetch(YGG_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    const text = await response.text();

    console.log("RAW RESPONSE (first 200 chars):", text.slice(0, 200));

    // 🚨 si HTML → bloqué
    if (!text.trim().startsWith("[")) {
      console.log("❌ YGG blocked or not JSON");

      return res.status(200).json({
        success: false,
        source: "ygg",
        message: "blocked_or_html",
        data: [],
      });
    }

    const json = JSON.parse(text);

    if (!Array.isArray(json)) {
      console.log("❌ Unexpected format");

      return res.status(200).json({
        success: false,
        source: "ygg",
        message: "invalid_format",
        data: [],
      });
    }

    // 🔥 transformation propre
    const items = json.map((t) => ({
      title: cleanTitle(t.name),
      rating: t.seeders || 0,
      type: "movie",
      poster: "",
    }));

    return res.status(200).json({
      success: true,
      source: "ygg",
      data: items,
    });

  } catch (err) {
    console.error("🔥 API ERROR:", err);

    return res.status(200).json({
      success: false,
      source: "ygg",
      message: "server_error",
      data: [],
    });
  }
}

/* =========================
   CLEAN TITLE
========================= */
function cleanTitle(name) {
  return (name || "")
    .replace(/\./g, " ")
    .replace(
      /(1080p|720p|2160p|x264|x265|H264|H265|WEBRip|BluRay|FRENCH|VOSTFR|MULTI)/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}
