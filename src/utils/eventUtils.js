/* eslint-disable no-unused-vars */
/**
 * Format date to a human-readable format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid date";
  }
};

/**
 * Determine event status based on date
 * @param {string} startDate - Event start date
 * @param {string} endDate - Event end date (optional)
 * @returns {string} Event status: 'upcoming', 'ongoing', or 'past'
 */
export const getEventStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(startDate);

  // Add 24 hours to end date if it's the same as start date
  if (!endDate) {
    end.setHours(end.getHours() + 24);
  }

  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "ongoing";
};

/**
 * Get status badge color based on event status
 * @param {string} status - Event status: 'upcoming', 'ongoing', or 'past'
 * @returns {string} CSS classes for the badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-gray-900 text-cyan-400 border-cyan-600/30";
    case "ongoing":
      return "bg-green-900 text-green-400 border-green-600/30";
    case "past":
      return "bg-gray-800 text-gray-400 border-gray-600/30";
    default:
      return "bg-gray-800 text-gray-400 border-gray-600/30";
  }
};
