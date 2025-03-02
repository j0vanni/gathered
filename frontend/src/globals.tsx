const api =
  process.env.NODE_ENV === "production"
    ? `https://${import.meta.env.VITE_VERCEL_URL}`
    : "http://localhost:3000";

export default api;
