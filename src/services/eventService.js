import axios from "axios";
import { getApiBaseUrl, getApiHeaders } from "../utils/apiUtils";
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
    // Handle image conversion to array if it's a string
    if (eventData.images && typeof eventData.images === "string") {
      eventData.images = [eventData.images];
    }

    const config = {
      headers: getApiHeaders(),
    };

    const response = await axios.put(
      `${getApiBaseUrl()}/events/${eventId}`,
      eventData,
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
