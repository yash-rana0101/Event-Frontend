import { store } from "../redux/store";
import { parseJwt } from "../utils/auth";

// Function to check and log the current auth state
export const debugAuth = () => {
  const state = store.getState();
  const { auth, organizer } = state;

  const userToken = auth?.token;
  const organizerToken = organizer?.token;

  console.group("🔍 Auth Debugger");

  console.log("User auth state:", {
    hasToken: !!userToken,
    tokenType: typeof userToken,
    tokenValid:
      userToken && typeof userToken === "string" && userToken.startsWith("ey"),
    hasUser: !!auth?.user,
    userType: typeof auth?.user,
  });

  console.log("Organizer auth state:", {
    hasToken: !!organizerToken,
    tokenType: typeof organizerToken,
    tokenValid:
      organizerToken &&
      typeof organizerToken === "string" &&
      organizerToken.startsWith("ey"),
    hasUser: !!organizer?.user,
    userType: typeof organizer?.user,
  });

  // Check localStorage
  console.log("LocalStorage tokens:", {
    user: localStorage.getItem("token"),
    organizer: localStorage.getItem("organizer_token"),
  });

  // If we have tokens, try to decode them
  if (userToken && typeof userToken === "string") {
    try {
      const decoded = parseJwt(userToken);
      console.log("User token payload:", decoded);
      const expiry = new Date(decoded.exp * 1000);
      console.log(
        "User token expires:",
        expiry.toLocaleString(),
        decoded.exp < Date.now() / 1000 ? "(EXPIRED)" : ""
      );
    } catch {
      console.log("Failed to decode user token");
    }
  }

  if (organizerToken && typeof organizerToken === "string") {
    try {
      const decoded = parseJwt(organizerToken);
      console.log("Organizer token payload:", decoded);
      const expiry = new Date(decoded.exp * 1000);
      console.log(
        "Organizer token expires:",
        expiry.toLocaleString(),
        decoded.exp < Date.now() / 1000 ? "(EXPIRED)" : ""
      );
    } catch {
      console.log("Failed to decode organizer token");
    }
  }

  console.groupEnd();

  return {
    userAuth: {
      valid: !!auth?.user && !!userToken,
      token: userToken,
      user: auth?.user,
    },
    organizerAuth: {
      valid: !!organizer?.user && !!organizerToken,
      token: organizerToken,
      user: organizer?.user,
    },
  };
};

// Add a global helper for easier debugging from console
if (typeof window !== "undefined") {
  window.debugAuth = debugAuth;
}

export default debugAuth;
