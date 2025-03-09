import axios from "axios";

// Function to check if server is available
export const checkServerStatus = async (url) => {
  try {
    // Try a simple HEAD request to check server availability
    await axios({
      method: "head",
      url,
      timeout: 2000,
    });
    return true;
  } catch (error) {
    console.log(`Server at ${url} is not available:`, error.message);
    return false;
  }
};

// Function to check if the backend API is accessible
export const checkApiStatus = async () => {
  const apiBaseUrls = [
    import.meta.env.VITE_API_URL,
    "http://localhost:3000/api/v1",
    "http://127.0.0.1:3000/api/v1",
    "http://localhost:5000/api/v1",
  ].filter(Boolean); // Remove any undefined values

  for (const baseUrl of apiBaseUrls) {
    try {
      // Make a simple request to check if server is available
      const checkUrl = baseUrl.endsWith('/') ? `${baseUrl}health` : `${baseUrl}/health`;
      const isAvailable = await checkServerStatus(checkUrl);

      if (isAvailable) {
        console.log(`API server available at ${baseUrl}`);
        return baseUrl;
      }
    } catch (error) {
      console.log(`Error checking ${baseUrl}:`, error.message);
    }
  }

  return null; // No server available
};

// Helper to get stored API URL or check for available one
export const getWorkingApiUrl = async () => {
  // Try from localStorage first (if we've previously found a working URL)
  const storedUrl = localStorage.getItem("working_api_url");
  if (storedUrl) {
    const isAvailable = await checkServerStatus(storedUrl);
    if (isAvailable) return storedUrl;
  }

  // Otherwise check for available server
  const workingUrl = await checkApiStatus();
  if (workingUrl) {
    localStorage.setItem("working_api_url", workingUrl);
    return workingUrl;
  }

  // Fallback to env variable even if not confirmed working
  return import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
};

export default {
  checkServerStatus,
  checkApiStatus,
  getWorkingApiUrl,
};
