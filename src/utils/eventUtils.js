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
 * Get random placeholder image for events
 * @returns {string} URL of a random placeholder image
 */
export const getRandomEventImage = () => {
  const images = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1464047736614-af63643285bf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Get status badge color based on event status
 * @param {string} status - Event status: 'upcoming', 'ongoing', or 'past'
 * @returns {string} CSS classes for the badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-cyan-900/30 text-cyan-400 border-cyan-600/30";
    case "ongoing":
      return "bg-green-900/30 text-green-400 border-green-600/30";
    case "past":
      return "bg-gray-800/50 text-gray-400 border-gray-600/30";
    default:
      return "bg-gray-800/50 text-gray-400 border-gray-600/30";
  }
};
