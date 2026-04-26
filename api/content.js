export default async function handler(req, res) {
  try {
    const r = await fetch("https://playwotcha.onrender.com/ygg");
    const json = await r.json();

    console.log("RENDER RESPONSE:", json);

    // ✅ si succès YGG
    if (json.success && json.data?.torrents) {
      const items = json.data.torrents.map(t => ({
        title: t.name,
        rating: t.seeders,
        type: "movie",
        poster: ""
      }));

      return res.status(200).json(items);
    }

    // 🔥 FALLBACK SAFE (IMPORTANT)
    return res.status(200).json([
      {
        title: "Fallback Film 1",
        rating: 8,
        type: "movie",
        poster: "https://via.placeholder.com/300x450"
      },
      {
        title: "Fallback Film 2",
        rating: 7,
        type: "movie",
        poster: "https://via.placeholder.com/300x450"
      }
    ]);

  } catch (e) {
    console.error("API ERROR:", e);

    // 🔥 fallback ultime (évite 500)
    return res.status(200).json([
      {
        title: "Erreur API - fallback",
        rating: 5,
        type: "movie",
        poster: ""
      }
    ]);
  }
}
function cleanTitle(name) {
  return name
    .replace(/\./g, " ")
    .replace(/(1080p|720p|2160p|x264|x265|H264|H265|WEBRip|BluRay|FRENCH|VOSTFR|MULTI)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
