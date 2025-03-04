const { api } = require("../config/tmdbConfig");
const axios = require("axios");

exports.searchAll = async (query, page) => {
  try {
    const url =
      `${api.baseUrl}/search/multi` + `?query=${query}` + `&page=${page}`;
    const options = {
      headers: {
        Authorization: `Bearer ${api.apiKey}`,
      },
    };
    const response = await axios.get(url, options);
    if (response.data.results) {
      response.data.results = response.data.results.filter(
        (item) => item.media_type !== "person"
      );
      response.data.results = response.data.results.map((item) => ({
        ...item,
        poster_path: item.poster_path
          ? `${api.imageUrl}${item.poster_path}`
          : null,
        backdrop_path: item.backdrop_path
          ? `${api.imageUrl}${item.backdrop_path}`
          : null,
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching all:", error);
    throw error;
  }
};

exports.searchMovie = async (query, page) => {
  try {
    const url =
      `${api.baseUrl}/search/movie` + `?query=${query}` + `&page=${page}`;
    const options = {
      headers: {
        Authorization: `Bearer ${api.apiKey}`,
      },
    };
    const response = await axios.get(url, options);
    if (response.data.results) {
      response.data.results = response.data.results.map((item) => ({
        ...item,
        poster_path: item.poster_path
          ? `${api.imageUrl}${item.poster_path}`
          : null,
        backdrop_path: item.backdrop_path
          ? `${api.imageUrl}${item.backdrop_path}`
          : null,
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching movie:", error);
    throw error;
  }
};

exports.searchTV = async (query, page) => {
  try {
    const url =
      `${api.baseUrl}/search/tv` + `?query=${query}` + `&page=${page}`;
    const options = {
      headers: {
        Authorization: `Bearer ${api.apiKey}`,
      },
    };
    const response = await axios.get(url, options);
    if (response.data.results) {
      response.data.results = response.data.results.map((item) => ({
        ...item,
        poster_path: item.poster_path
          ? `${api.imageUrl}${item.poster_path}`
          : null,
        backdrop_path: item.backdrop_path
          ? `${api.imageUrl}${item.backdrop_path}`
          : null,
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error searching tv:", error);
    throw error;
  }
};

exports.getTrending = async () => {
  try {
    const url = `${api.baseUrl}/trending/all/week`;
    const options = {
      headers: {
        Authorization: `Bearer ${api.apiKey}`,
      },
    };
    const response = await axios.get(url, options);
    response.data.results = response.data.results.filter(
      (item) => item.media_type !== "person"
    );
    if (response.data.results) {
      response.data.results = response.data.results.map((item) => ({
        ...item,
        poster_path: item.poster_path
          ? `${api.imageUrl}${item.poster_path}`
          : null,
      }));
    }
    return response.data;
  } catch (error) {
    console.error("Error getting trending:", error);
    throw error;
  }
};
