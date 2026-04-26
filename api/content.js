export default async function handler(req, res) {
  try {
    const r = await fetch("https://playwotcha.onrender.com/ygg");
    const json = await r.json();

    // ❌ si bloqué → fallback front possible
    if (!json.success) {
      return res.status(200).json({
        source: "fallback",
        items: [],
        message: "YGG blocked - use client fallback"
      });
    }

    const items = (json.data?.torrents || []).map(t => ({
      title: t.name,
      seeders: t.seeders,
      type: "movie"
    }));

    res.json(items);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
