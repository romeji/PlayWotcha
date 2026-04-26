import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ygg", async (req, res) => {
  try {
    const url = "https://yggtorrent.org/api/v2/torrents?category=2145&sort=seeders&order=desc&limit=10";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/json"
      }
    });

    const text = await response.text();

    // 🔥 si HTML → on ne crash plus
    if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
      return res.json({
        success: false,
        source: "ygg",
        message: "blocked_or_html",
        fallback: true
      });
    }

    const data = JSON.parse(text);

    return res.json({
      success: true,
      source: "ygg",
      data
    });

  } catch (e) {
    return res.json({
      success: false,
      error: e.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Proxy running on", PORT);
});
