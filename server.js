import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const YGG_URL =
  "https://yggtorrent.org/api/v1/torrents/top100?category=film-video";

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

app.get("/ygg", async (req, res) => {
  try {
    const r = await fetch(YGG_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    const text = await r.text();

    console.log("RAW:", text.slice(0, 200));

    // 🚨 bloqué ou HTML
    if (!text.trim().startsWith("[")) {
      return res.json({
        success: false,
        source: "ygg",
        message: "blocked_or_html",
        data: [],
      });
    }

    const json = JSON.parse(text);

    const items = json.map((t) => ({
      title: cleanTitle(t.name),
      rating: t.seeders || 0,
      type: "movie",
      poster: "",
    }));

    return res.json({
      success: true,
      source: "ygg",
      data: items,
    });

  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      source: "ygg",
      message: "error",
      data: [],
    });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "YGG proxy running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
