const api =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.URL}`
    : "http://localhost:3000";

export default api;
