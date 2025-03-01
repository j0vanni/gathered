const axios = require("axios");
const { api } = require("../config/tmdbConfig");

exports.getDetailsTV = async (id) => {
  try {
    const url = `${api.baseUrl}/tv/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.TMBD_API_KEY}`,
      },
    };
    const response = await axios.get(url, options);
    const filteredResponse = {
      ...response.data,
      poster_path: response.data.poster_path
        ? `${api.imageUrl}${response.data.poster_path}`
        : null,
      backdrop_path: response.data.backdrop_path
        ? `${api.imageUrl}${response.data.backdrop_path}`
        : null,
    };
    return filteredResponse;
  } catch (error) {
    console.error("Error fetching TV details:", error);
    throw error;
  }
};

exports.getDetailsMovie = async (id) => {
  try {
    const url = `${api.baseUrl}/movie/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.TMBD_API_KEY}`,
      },
    };
    const response = await axios.get(url, options);
    const filteredResponse = {
      ...response.data,
      poster_path: response.data.poster_path
        ? `${api.imageUrl}${response.data.poster_path}`
        : null,
      backdrop_path: response.data.backdrop_path
        ? `${api.imageUrl}${response.data.backdrop_path}`
        : null,
    };
    return filteredResponse;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
