export default async function handler(req, res) {
  try {
    const r = await fetch("https://playwotcha.onrender.com/ygg");
    const json = await r.json();

    // 🔥 fonction nettoyage
    function cleanTitle(name) {
      return name
        .replace(/\./g, " ")
        .replace(/(1080p|720p|2160p|x264|x265|H264|H265|WEBRip|BluRay|FRENCH|VOSTFR|MULTI)/gi, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 🔥 ICI → const items
    if (json.success && json.data?.torrents) {
      const items = json.data.torrents.map(t => ({
        title: cleanTitle(t.name),
        rating: t.seeders,
        type: "movie",
        poster: ""
      }));

      return res.status(200).json(items);
    }

    // ❌ si YGG bloque
    return res.status(200).json([]);

  } catch (e) {
    console.error(e);
    return res.status(200).json([]);
  }
}
