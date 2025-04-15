import axios from "axios";
import { getApiBaseUrl, getApiHeaders } from "../utils/apiUtils";

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

export default eventService;
