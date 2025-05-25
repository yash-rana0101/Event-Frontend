import axios from "axios";
import { safelyParseToken } from "../utils/persistFix";
import {store} from "../redux/store"; // Import the Redux store directly

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Get auth config helper
const getAuthConfig = () => {
  const organizerToken = store.getState().organizer.token;
  const token = safelyParseToken(organizerToken);

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get organizer dashboard metrics
export const getOrganizerMetrics = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/organizer/metrics`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer metrics:", error);
    throw error;
  }
};

// Get revenue metrics
export const getRevenueMetrics = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(
      `${API_URL}/organizer/metrics/revenue`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue metrics:", error);
    throw error;
  }
};

// Get organizer events
export const getOrganizerEvents = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/organizer/events`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    throw error;
  }
};

export default {
  getOrganizerMetrics,
  getRevenueMetrics,
  getOrganizerEvents,
};
