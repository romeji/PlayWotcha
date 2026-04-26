app.get("/ygg", async (req, res) => {
  try {
    const r = await fetch(
      "https://yggtorrent.org/api/v1/torrents/top100?category=film-video",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const text = await r.text();

    // si HTML → bloqué
    if (!text.startsWith("[")) {
      return res.json({ success: false, blocked: true });
    }

    const data = JSON.parse(text);

    res.json({
      success: true,
      data
    });

  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});
