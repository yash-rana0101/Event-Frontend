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
      const checkUrl = baseUrl.endsWith("/")
        ? `${baseUrl}health`
        : `${baseUrl}/health`;
      const isAvailable = await checkServerStatus(checkUrl);

      if (isAvailable) {
        console.log(`API available at: ${baseUrl}`);
        return baseUrl;
      }
    } catch (error) {
      console.log(`Failed to connect to ${baseUrl}: ${error.message}`);
    }
  }

  return null; // No available API found
};

// Helper to get base API URL without /api/v1 suffix
export const getBaseApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  // If URL already has /api/v1, return the base part
  if (apiUrl.endsWith("/api/v1")) {
    return apiUrl.substring(0, apiUrl.length - 8);
  }

  return apiUrl;
};

export default {
  checkServerStatus,
  checkApiStatus,
  getBaseApiUrl,
};
