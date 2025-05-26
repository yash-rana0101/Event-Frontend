import api from "./api";

export const admin = {
  // Get all settings (returns combined data) with better error handling
  getProfile: () =>
    api
      .get("/settings")
      .then((res) => ({ data: res.data.data.profile }))
      .catch(handleApiError),
  getSystemSettings: () =>
    api
      .get("/settings")
      .then((res) => ({ data: res.data.data.system }))
      .catch(handleApiError),
  getNotificationSettings: () =>
    api
      .get("/settings")
      .then((res) => ({ data: res.data.data.notifications }))
      .catch(handleApiError),
  getApiSettings: () =>
    api.get("/settings").then((res) => ({ data: res.data.data.api })),
  getBackupSettings: () =>
    api.get("/settings").then((res) => ({ data: res.data.data.backup })),

  // Update specific settings sections with optimistic updates
  updateProfile: (data) => updateSettingsSection("profile", data),
  updateSystemSettings: (data) => updateSettingsSection("system", data),
  updateNotificationSettings: (data) =>
    updateSettingsSection("notifications", data),
  updateApiSettings: (data) => updateSettingsSection("api", data),
  updateBackupSettings: (data) => updateSettingsSection("backup", data),

  // File upload APIs with progress tracking
  uploadAvatar: (file, onProgress) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api
      .post("/settings/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onProgress,
      })
      .catch(handleApiError);
  },

  // API key generation with retry
  generateApiKey: () =>
    retryApiCall(() => api.post("/settings/generate-api-key")),

  // Backup APIs with proper error handling
  createBackup: () => api.post("/settings/create-backup").catch(handleApiError),
  downloadBackup: (backupId) =>
    api
      .get(`/settings/download-backup/${backupId}`, { responseType: "blob" })
      .catch(handleApiError),
  restoreBackup: (file, onProgress) => {
    const formData = new FormData();
    formData.append("backup", file);

    return api
      .post("/settings/restore-backup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onProgress,
        timeout: 300000, // 5 minutes timeout for large backups
      })
      .catch(handleApiError);
  },
};

// Helper function to update settings sections
const updateSettingsSection = (section, data) => {
  return api.put("/settings", { section, data }).catch(handleApiError);
};

// Enhanced error handling
const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || "Server error occurred";
    throw new Error(message);
  } else if (error.request) {
    throw new Error("Network error - please check your connection");
  } else {
    throw new Error("An unexpected error occurred");
  }
};

// Retry mechanism for critical operations
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export default admin;
