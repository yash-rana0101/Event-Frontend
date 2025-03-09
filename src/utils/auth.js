import axios from "axios";

// Configure axios with auth token
export const setupAuthTokens = (token, isOrganizer = false) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (isOrganizer) {
      localStorage.setItem("organizer_token", token);
    } else {
      localStorage.setItem("token", token);
    }
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("organizer_token");
  }
};

// Parse JWT token without validation - with better error handling
export const parseJwt = (token) => {
  if (!token || typeof token !== "string") return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT token:", e);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// Validate that a token exists and is properly formatted
export const isValidToken = (token) => {
  if (!token || token === "null" || typeof token !== "string") return false;

  // Basic format check (three parts with dots)
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // Check if it actually contains data
  try {
    const payload = parseJwt(token);
    return !!payload;
  } catch {
    return false;
  }
};

export default {
  setupAuthTokens,
  parseJwt,
  isTokenExpired,
  isValidToken,
};
