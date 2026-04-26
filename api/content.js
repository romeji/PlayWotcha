export default async function handler(req, res) {
  res.status(200).json({
    tmdb_key_exists: !!process.env.TMDB_API_KEY
  });
}

  function cleanTitle(title) {
    return title
      .replace(/\.(1080p|720p|x264|x265|bluray|webrip|french|vostfr)/gi, '')
      .replace(/\./g, ' ')
      .trim();
  }

  async function getTMDBData(title) {
    const clean = cleanTitle(title);

    try {
      const search = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(clean)}`);
      const data = await search.json();

      if (data.results?.length > 0) {
        const item = data.results[0];

        let trailer = null;

        if (item.media_type === 'movie') {
          const vid = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=${TMDB_API_KEY}`);
          const vids = await vid.json();
          const yt = vids.results.find(v => v.site === 'YouTube');
          if (yt) trailer = `https://www.youtube.com/watch?v=${yt.key}`;
        }

        return {
          rating: item.vote_average,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          type: item.media_type,
          trailer
        };
      }
    } catch {}

    return {};
  }

  try {
    const ygg = await fetch('https://yggtorrent.org/api/v2/torrents?category=2145&sort=seeders&order=desc&limit=20');
    const data = await ygg.json();

    const content = await Promise.all(
      data.torrents.map(async t => ({
        title: t.name,
        seeders: t.seeders,
        ...await getTMDBData(t.name)
      }))
    );

    res.status(200).json(content);
  } catch {
    res.status(500).json({ error: 'API error' });
  }
}
