import axios from "axios";
import { safelyParseToken } from "../utils/persistFix";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Get auth headers
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token");
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

export default {
  organizer: organizerService,
};
