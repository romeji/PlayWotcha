import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ygg", async (req, res) => {
  try {
    const response = await fetch(
      "https://yggtorrent.org/api/v2/torrents?category=2145&sort=seeders&order=desc&limit=10"
    );

    const text = await response.text();

    if (!text.startsWith("{") && !text.startsWith("[")) {
      return res.status(500).json({
        error: "YGG returned HTML (blocked or protected)"
      });
    }

    const data = JSON.parse(text);

    return res.json(data);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
