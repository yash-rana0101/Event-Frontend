import { store } from "../redux/store";
import { fixNullValues as fixUserNullValues } from "../redux/user/userSlice";
import { fixNullValues as fixOrganizerNullValues } from "../redux/user/organizer";

/**
 * Utility to fix common persistence issues in the Redux store
 */
export const fixPersistenceIssues = () => {
  // Check if we have string "null" values in the store
  const state = store.getState();

  console.log("Checking for persistence issues...");
  console.log("Auth state:", state.auth);
  console.log("Organizer state:", state.organizer);

  // Dispatch fixes if needed
  if (state.auth?.user === "null" || state.auth?.token === "null") {
    console.log("Fixing auth null values");
    store.dispatch(fixUserNullValues());
  }

  if (state.organizer?.user === "null" || state.organizer?.token === "null") {
    console.log("Fixing organizer null values");
    store.dispatch(fixOrganizerNullValues());
  }

  // Check localStorage for unexpected values
  const userToken = localStorage.getItem("token");
  const organizerToken = localStorage.getItem("organizer_token");

  if (userToken === "null") {
    console.log("Fixing user token in localStorage");
    localStorage.removeItem("token");
  }

  if (organizerToken === "null") {
    console.log("Fixing organizer token in localStorage");
    localStorage.removeItem("organizer_token");
  }

  return {
    fixed: {
      auth: state.auth?.user === "null" || state.auth?.token === "null",
      organizer:
        state.organizer?.user === "null" || state.organizer?.token === "null",
      localStorage: userToken === "null" || organizerToken === "null",
    },
  };
};

/**
 * Hard reset of all auth data (for emergencies/debugging)
 */
export const resetAllAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("organizer_token");

  // You would need to dispatch logout actions here too
  store.dispatch({ type: "auth/logout" });
  store.dispatch({ type: "organizer/logout" });

  // Clear redux persist data
  localStorage.removeItem("persist:auth");
  localStorage.removeItem("persist:organizer");
  localStorage.removeItem("persist:root");

  console.log("All auth data has been reset");
};

export default {
  fixPersistenceIssues,
  resetAllAuthData,
};
