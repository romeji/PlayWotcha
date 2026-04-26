export default async function handler(req, res) {
  try {
    return res.status(200).json([
      {
        title: "API OK - Vercel working",
        rating: 9,
        poster: null,
        type: "movie"
      }
    ]);
  } catch (e) {
    return res.status(500).json({
      error: "CRASH",
      message: e.message
    });
  }
}
