const searchService = require("../services/searchService");

exports.searchAll = async (req, res) => {
  const { query: query, page: page } = req.query;
  console.log(query, page, process.env.TMDB_API_KEY);
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const results = await searchService.searchAll(query, page ? page : 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search" });
  }
};

exports.searchMovie = async (req, res) => {
  const { query: query, page: page } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const results = await searchService.searchMovie(query, page ? page : 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search" });
  }
};

exports.searchTV = async (req, res) => {
  const { query: query, page: page } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const results = await searchService.searchTV(query, page ? page : 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search" });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const results = await searchService.getTrending();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to get trending" });
  }
};
