export default async function handler(req, res) {
  try {
    const ygg = await fetch('https://yggtorrent.org/api/v2/torrents?category=2145&sort=seeders&order=desc&limit=10');
    const data = await ygg.json();

    const safe = (data.torrents || []).map(t => ({
      title: t.name,
      seeders: t.seeders,
      type: "movie"
    }));

    return res.status(200).json(safe);

  } catch (e) {
    return res.status(500).json({
      error: "YGG FAILED",
      message: e.message
    });
  }
}
