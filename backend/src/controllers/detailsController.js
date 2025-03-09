const detailsService = require("../services/detailsService");

exports.getDetailsTV = async (req, res) => {
  const { id: id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }
  try {
    const details = await detailsService.getDetailsTV(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TV details" });
  }
};

exports.getEpisodeDetails = async (req, res) => {
  const { id: id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }
  try {
    const details = await detailsService.getEpisodeDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch episode details" });
  }
};

exports.getDetailsMovie = async (req, res) => {
  const { id: id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }
  try {
    const details = await detailsService.getDetailsMovie(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};
