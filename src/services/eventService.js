import axios from "axios";
import { getApiHeaders, getApiBaseUrl } from "../utils/apiUtils";
import { safelyParseToken } from "../utils/persistFix";

// Service for event-related API calls
const eventService = {
  // Create a new event
  createEvent: async (eventData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getApiHeaders(true),
      },
    };

    // Convert data to FormData if needed
    let formData;
    if (!(eventData instanceof FormData)) {
      formData = new FormData();

      // Add all fields to formData
      for (const key in eventData) {
        if (key === "image" && eventData[key] instanceof File) {
          formData.append("image", eventData[key]);
        } else {
          formData.append(
            key,
            typeof eventData[key] === "object"
              ? JSON.stringify(eventData[key])
              : eventData[key]
          );
        }
      }
    } else {
      formData = eventData;
    }

    const response = await axios.post(
      `${getApiBaseUrl()}/events`,
      formData,
      config
    );

    return response.data;
  },

  // Get all events (for admin or organizer)
  getEvents: async () => {
    const config = {
      headers: getApiHeaders(),
    };

    const response = await axios.get(`${getApiBaseUrl()}/events`, config);

    return response.data;
  },

  // Get published events (public)
  getPublishedEvents: async (page = 1, limit = 10, category = "") => {
    const params = { page, limit };
    if (category) params.category = category;

    const response = await axios.get(`${getApiBaseUrl()}/events/published`, {
      params,
    });

    return response.data;
  },

  // Get event by ID
  getEventById: async (eventId) => {
    const response = await axios.get(`${getApiBaseUrl()}/events/${eventId}`);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...getApiHeaders(true),
      },
    };

    // Handle form data conversion similar to createEvent if needed
    let data = eventData;
    if (eventData instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (typeof eventData === "object") {
      // Convert regular object to JSON
      data = JSON.stringify(eventData);
      config.headers["Content-Type"] = "application/json";
    }

    const response = await axios.put(
      `${getApiBaseUrl()}/events/${eventId}`,
      data,
      config
    );

    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const config = {
      headers: getApiHeaders(),
    };

    const response = await axios.delete(
      `${getApiBaseUrl()}/events/${eventId}`,
      config
    );

    return response.data;
  },

  // Upload event image
  uploadEventImage: async (eventId, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getApiHeaders(true),
      },
    };

    const response = await axios.post(
      `${getApiBaseUrl()}/events/${eventId}/upload-image`,
      formData,
      config
    );

    return response.data;
  },

  // Search events
  searchEvents: async (params) => {
    const response = await axios.get(`${getApiBaseUrl()}/events/search`, {
      params,
    });

    return response.data;
  },

  // Get user dashboard events
  getUserDashboardEvents: async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Create headers object properly
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Try the dashboard-specific endpoint first
      const response = await axios.get(
        `${getApiBaseUrl()}/profiles/me/events`,
        config
      );
      return response.data;
    } catch (err) {
      // Fallback to registrations if dashboard endpoint fails
      if (err.response && err.response.status === 404) {
        const regResponse = await axios.get(
          `${getApiBaseUrl()}/registrations`,
          config
        );
        return {
          data: regResponse.data.map((reg) => ({
            id: reg.event?._id,
            title: reg.event?.title || "Unnamed Event",
            date: reg.event?.startDate || reg.registrationDate,
            location: reg.event?.location?.address || "No location specified",
            image: reg.event?.images?.[0] || null,
            status: reg.status,
          })),
          success: true,
        };
      }
      throw err;
    }
  },

  // Get user saved events
  getUserSavedEvents: async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Create headers object properly
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${getApiBaseUrl()}/profiles/saved-events`,
        config
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching saved events:", err);
      throw err;
    }
  },

  // Get user calendar data
  getUserCalendarData: async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Create headers object properly
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Try the calendar-specific endpoint
      const response = await axios.get(
        `${getApiBaseUrl()}/profiles/me/calendar`,
        config
      );
      return response.data;
    } catch (err) {
      // If 404, create fallback calendar data
      if (err.response && err.response.status === 404) {
        // Generate demo calendar data
        const currentDate = new Date();
        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();

        const calendarData = {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          calendarDays: [],
        };

        // Generate empty calendar days
        for (let day = 1; day <= daysInMonth; day++) {
          calendarData.calendarDays.push({
            day,
            events: [],
            status: "absent",
          });
        }

        return {
          success: true,
          data: calendarData,
        };
      }
      throw err;
    }
  },

  // Get user recommendations
  getUserRecommendations: async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Create headers object properly
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${getApiBaseUrl()}/profiles/me/recommendations`,
        config
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      throw err;
    }
  },
};

// Update your client-side code to properly format the image data before sending to the API
export const createEvent = async (eventData, token) => {
  try {
    const cleanToken = safelyParseToken(token);

    if (!cleanToken) {
      throw new Error("Invalid authentication token");
    }

    // Format image data properly
    const formattedData = { ...eventData };

    // If image is an empty object, set to empty string
    if (
      formattedData.image &&
      typeof formattedData.image === "object" &&
      Object.keys(formattedData.image).length === 0
    ) {
      formattedData.image = "";
    }

    // Ensure images is an array of strings
    if (formattedData.images) {
      if (!Array.isArray(formattedData.images)) {
        formattedData.images = formattedData.image ? [formattedData.image] : [];
      }

      // Filter out any non-string or empty values
      formattedData.images = formattedData.images.filter(
        (img) => typeof img === "string" && img.trim() !== ""
      );
    }

    // If we have a main image but no images array, initialize it
    if (
      formattedData.image &&
      typeof formattedData.image === "string" &&
      (!formattedData.images || formattedData.images.length === 0)
    ) {
      formattedData.images = [formattedData.image];
    }

    const apiUrl = import.meta.env.VITE_API_URL || "/api/v1";

    const response = await axios.post(`${apiUrl}/events`, formattedData, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error creating event:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default eventService;
