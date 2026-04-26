export default async function handler(req, res) {
  const r = await fetch("https://ygg-proxy.onrender.com/ygg");
  const data = await r.json();

  const torrents = data.torrents || [];

  return res.status(200).json(
    torrents.map(t => ({
      title: t.name,
      seeders: t.seeders,
      type: "movie"
    }))
  );
}
