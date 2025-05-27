import axios from "axios";
import { safelyParseToken } from "../utils/persistFix";

const API_URL = import.meta.env.VITE_API_URL;

// Add request caching
let dashboardCache = null;
let dashboardCacheTime = null;
const CACHE_DURATION = 30000; // 30 seconds

// Get auth headers with better token handling
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("persist:auth")?.replace(/"/g, "") ||
    safelyParseToken(localStorage.getItem("token"));

  const cleanToken = safelyParseToken(token);

  return {
    Authorization: `Bearer ${cleanToken}`,
    "Content-Type": "application/json",
  };
};

// Organizer Management Services
export const organizerService = {
  // Get all organizers with filtering and pagination
  getAllOrganizers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(
      `${API_URL}/admin/organizers?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Get organizer statistics
  getOrganizerStats: async () => {
    const response = await axios.get(`${API_URL}/admin/organizers/stats`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get specific organizer details
  getOrganizerById: async (id) => {
    const response = await axios.get(`${API_URL}/admin/organizers/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Update organizer status
  updateOrganizerStatus: async (id, status, reason) => {
    const response = await axios.patch(
      `${API_URL}/admin/organizers/${id}/status`,
      { status, reason },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Delete organizer
  deleteOrganizer: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/organizers/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

// Event Management Services
export const eventService = {
  // Get all events with filtering and pagination
  getAllEvents: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await axios.get(
      `${API_URL}/admin/events?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Get event details - updated to return proper format
  getEventDetails: async (eventId) => {
    const response = await axios.get(`${API_URL}/admin/events/${eventId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Update event status
  updateEventStatus: async (eventId, action, reason = "") => {
    const response = await axios.put(
      `${API_URL}/admin/events/${eventId}/status`,
      {
        action,
        reason,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId, reason = "") => {
    const response = await axios.delete(`${API_URL}/admin/events/${eventId}`, {
      data: { reason },
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Dashboard data
  getDashboardData: async () => {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

// Create a unified admin service object
const adminService = {
  // Dashboard methods with caching
  getDashboardStats: async () => {
    // Check cache first
    if (
      dashboardCache &&
      dashboardCacheTime &&
      Date.now() - dashboardCacheTime < CACHE_DURATION
    ) {
      return dashboardCache;
    }

    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });

    // Update cache
    dashboardCache = response.data;
    dashboardCacheTime = Date.now();

    return response.data;
  },

  getAnalytics: async (timeRange = "30d") => {
    const response = await axios.get(
      `${API_URL}/admin/analytics?timeRange=${timeRange}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Clear cache method
  clearCache: () => {
    dashboardCache = null;
    dashboardCacheTime = null;
  },

  // Organizer methods
  getAllOrganizers: organizerService.getAllOrganizers,
  getOrganizerStats: organizerService.getOrganizerStats,
  getOrganizerById: organizerService.getOrganizerById,
  updateOrganizerStatus: organizerService.updateOrganizerStatus,
  deleteOrganizer: organizerService.deleteOrganizer,

  // Event methods
  getAllEvents: eventService.getAllEvents,
  getEventDetails: eventService.getEventDetails,
  updateEventStatus: eventService.updateEventStatus,
  deleteEvent: eventService.deleteEvent,
  getDashboardData: eventService.getDashboardData,

  // Keep the nested structure for backwards compatibility
  organizer: organizerService,
  event: eventService,
};

export default adminService;
