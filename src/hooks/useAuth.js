import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  verifyUserToken,
  fixNullValues as fixUserNullValues,
} from "../redux/user/userSlice";
import {
  logout as organizerLogout,
  verifyOrganizerToken,
  fixNullValues as fixOrganizerNullValues,
} from "../redux/user/organizer";
import { useNavigate } from "react-router-dom";
import { thoroughAuthCleanup } from "../utils/persistFix";

export const useAuth = () => {
  const [debugAuthInfo, setDebugAuthInfo] = useState(null);

  const currentUser = useSelector((state) => state.auth?.user);
  const currentOrganizer = useSelector((state) => state.organizer?.user);
  const authToken = useSelector((state) => state.auth?.token);
  const organizerToken = useSelector((state) => state.organizer?.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Improved function to extract user ID
  const getUserId = () => {
    if (currentOrganizer) {
      if (
        typeof currentOrganizer === "string" &&
        /^[0-9a-fA-F]{24}$/.test(currentOrganizer)
      ) {
        return currentOrganizer;
      }

      if (typeof currentOrganizer === "string") {
        try {
          const parsed = JSON.parse(currentOrganizer);
          if (typeof parsed === "string" && /^[0-9a-fA-F]{24}$/.test(parsed)) {
            return parsed;
          }
          if (parsed?._id) return parsed._id;
          if (parsed?.id) return parsed.id;
          if (parsed?._doc?._id) return parsed._doc._id;
          return null;
        } catch (e) {
          console.error("Error parsing organizer data:", e);
          return null;
        }
      }
      return (
        currentOrganizer._id ||
        currentOrganizer.id ||
        currentOrganizer?._doc?._id
      );
    } else if (currentUser) {
      if (
        typeof currentUser === "string" &&
        /^[0-9a-fA-F]{24}$/.test(currentUser)
      ) {
        return currentUser;
      }

      if (typeof currentUser === "string") {
        try {
          const parsed = JSON.parse(currentUser);
          if (typeof parsed === "string" && /^[0-9a-fA-F]{24}$/.test(parsed)) {
            return parsed;
          }
          if (parsed?._id) return parsed._id;
          if (parsed?.id) return parsed.id;
          if (parsed?._doc?._id) return parsed._doc._id;
          return null;
        } catch (e) {
          console.error("Error parsing user data:", e);
          return null;
        }
      }
      return currentUser._id || currentUser.id || currentUser?._doc?._id;
    }

    return null;
  };

  const userId = getUserId();
  const profileLink = userId
    ? currentOrganizer
      ? `/organizer/profile`
      : `/user/profile/${userId}`
    : null;

  const activeUser = currentUser || currentOrganizer || null;
  const user = useSelector((state) => state.auth?.user);
  const organizer = useSelector((state) => state.organizer?.user);
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;
  const adminData = isAdmin ? user : null;

  const hasValidAuthentication = () => {
    return Boolean(
      (authToken &&
        typeof authToken === "string" &&
        authToken.startsWith("ey")) ||
        (organizerToken &&
          typeof organizerToken === "string" &&
          organizerToken.startsWith("ey"))
    );
  };

  const handleLogout = () => {
    if (currentOrganizer) {
      thoroughAuthCleanup("organizer");
      dispatch(organizerLogout());
    } else {
      thoroughAuthCleanup("user");
      dispatch(logout());
    }
    navigate("/");
  };

  useEffect(() => {
    dispatch(fixUserNullValues());
    dispatch(fixOrganizerNullValues());

    const organizerTokenLocal = localStorage.getItem("organizer_token");
    if (organizerTokenLocal && organizerTokenLocal !== "null") {
      console.log("Found organizer token, verifying...");
      dispatch(verifyOrganizerToken());
    }

    const userTokenLocal = localStorage.getItem("token");
    if (userTokenLocal && userTokenLocal !== "null") {
      dispatch(verifyUserToken());
    }
  }, [dispatch]);

  useEffect(() => {
    const debug = {
      authState: {
        user: currentUser,
        token: authToken,
        tokenExists: !!authToken,
        isValidToken:
          authToken &&
          typeof authToken === "string" &&
          authToken.startsWith("ey"),
        tokenType: typeof authToken,
      },
      organizerState: {
        user: currentOrganizer,
        token: organizerToken,
        tokenExists: !!organizerToken,
        isValidToken:
          organizerToken &&
          typeof organizerToken === "string" &&
          organizerToken.startsWith("ey"),
        tokenType: typeof organizerToken,
      },
      activeUser: currentUser || currentOrganizer,
      isAuthenticated: !!(currentUser || currentOrganizer),
      localStorage: {
        userToken: localStorage.getItem("token"),
        organizerToken: localStorage.getItem("organizer_token"),
      },
    };

    setDebugAuthInfo(debug);

    if (organizerToken && !currentOrganizer) {
      console.log(
        "Organizer token exists but user is null - fetching organizer data"
      );
      dispatch(verifyOrganizerToken());
    }
  }, [currentUser, currentOrganizer, authToken, organizerToken, dispatch]);

  return {
    currentUser,
    currentOrganizer,
    authToken,
    organizerToken,
    userId,
    profileLink,
    activeUser,
    user,
    organizer,
    isAdmin,
    adminData,
    debugAuthInfo,
    hasValidAuthentication,
    handleLogout,
  };
};
