const api =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export default api;
