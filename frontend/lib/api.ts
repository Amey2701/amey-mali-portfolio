
const LOCAL_API_URL =
  process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:5001/api";

const PRODUCTION_API_URL =
  process.env.NEXT_PUBLIC_API_URL_PRODUCTION ||
  "https://amey-mali-portfolio.onrender.com/api";

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : LOCAL_API_URL;