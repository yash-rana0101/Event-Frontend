import { checkProfileCompletion } from "../redux/user/organizer";

export const ensureProfileComplete = async (
  organizerId,
  dispatch,
  navigate,
  toast
) => {
  if (!organizerId) {
    toast.error("User ID not found. Please login again.");
    navigate("/auth/organizer-login");
    return false;
  }

  try {
    const profileCheck = await dispatch(checkProfileCompletion(organizerId));

    if (checkProfileCompletion.fulfilled.match(profileCheck)) {
      const isComplete = profileCheck.payload.isComplete;

      if (!isComplete) {
        toast.info("Please complete your profile to continue.");
        navigate("/organizer/details");
        return false;
      }

      return true;
    } else {
      toast.warning(
        "Unable to verify profile completion. Please complete your profile."
      );
      navigate("/organizer/details");
      return false;
    }
  } catch (error) {
    console.error("Error checking profile completion:", error);
    toast.warning("Please complete your profile to continue.");
    navigate("/organizer/details");
    return false;
  }
};

export const getUserId = (user) => {
  if (!user) return null;

  // Handle string format (serialized JSON)
  if (typeof user === "string") {
    try {
      const parsed = JSON.parse(user);
      return parsed?._id || parsed?.id || parsed?._doc?._id;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  }

  // Handle object format
  return user?._id || user?.id || user?._doc?._id;
};
