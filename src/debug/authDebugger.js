import { store } from "../redux/store";
import { parseJwt } from "../utils/auth";
import { logout as userLogout } from "../redux/user/userSlice";
import { logout as organizerLogout } from "../redux/user/organizer";
import { thoroughAuthCleanup } from "../utils/persistFix";

// Function to check and log the current auth state
export const debugAuth = () => {
  const state = store.getState();
  const { auth, organizer } = state;

  const userToken = auth?.token;
  const organizerToken = organizer?.token;

  console.group("🔍 Auth Debugger");

  // Check for token format issues
  const userTokenIsQuoted =
    typeof userToken === "string" &&
    userToken?.startsWith('"') &&
    userToken?.endsWith('"');
  const organizerTokenIsQuoted =
    typeof organizerToken === "string" &&
    organizerToken?.startsWith('"') &&
    organizerToken?.endsWith('"');

  if (userTokenIsQuoted || organizerTokenIsQuoted) {
    console.warn(
      "⚠️ DETECTED QUOTED TOKENS - This can cause authentication issues!"
    );
    console.log("User token quoted:", userTokenIsQuoted);
    console.log("Organizer token quoted:", organizerTokenIsQuoted);
  }

  // Check localStorage token format
  const lsUserToken = localStorage.getItem("token");
  const lsOrganizerToken = localStorage.getItem("organizer_token");

  const lsUserTokenIsQuoted =
    typeof lsUserToken === "string" &&
    lsUserToken?.startsWith('"') &&
    lsUserToken?.endsWith('"');
  const lsOrganizerTokenIsQuoted =
    typeof lsOrganizerToken === "string" &&
    lsOrganizerToken?.startsWith('"') &&
    lsOrganizerToken?.endsWith('"');

  if (lsUserTokenIsQuoted || lsOrganizerTokenIsQuoted) {
    console.warn(
      "⚠️ DETECTED QUOTED TOKENS IN LOCALSTORAGE - This can cause authentication issues!"
    );
    console.log("LocalStorage user token quoted:", lsUserTokenIsQuoted);
    console.log(
      "LocalStorage organizer token quoted:",
      lsOrganizerTokenIsQuoted
    );
  }

  console.log("User auth state:", {
    hasToken: !!userToken,
    tokenType: typeof userToken,
    tokenValid:
      userToken && typeof userToken === "string" && userToken.startsWith("ey"),
    hasUser: !!auth?.user,
    userType: typeof auth?.user,
    tokenIsQuoted: userTokenIsQuoted,
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
    tokenIsQuoted: organizerTokenIsQuoted,
  });

  // Check localStorage
  console.log("LocalStorage tokens:", {
    user: lsUserToken,
    organizer: lsOrganizerToken,
    userIsQuoted: lsUserTokenIsQuoted,
    organizerIsQuoted: lsOrganizerTokenIsQuoted,
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

// Add a method to force logout for debugging purposes
export const forceLogout = (userType = "all") => {
  console.group("🧹 Auth Force Logout");

  // Clear localStorage
  const cleanupResult = thoroughAuthCleanup(userType);
  console.log("LocalStorage cleanup result:", cleanupResult);

  // Dispatch Redux actions
  if (userType === "user" || userType === "all") {
    store.dispatch(userLogout());
    console.log("User logout action dispatched");
  }

  if (userType === "organizer" || userType === "all") {
    store.dispatch(organizerLogout());
    console.log("Organizer logout action dispatched");
  }

  console.log("Logout complete");
  console.groupEnd();

  return {
    success: true,
    message: `Forced logout for ${userType}`,
  };
};

// Add a global helper for easier debugging from console
if (typeof window !== "undefined") {
  window.debugAuth = debugAuth;
  window.forceLogout = forceLogout;
}

export default debugAuth;
