/* eslint-disable no-unused-vars */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";

// Import reducers
import authReducer from "./user/userSlice";
import organizerReducer from "./user/organizer";

// Helper to check if token is expired
const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return new Date().getTime() > expiryTime;
};

// Transform to handle token expiration for organizer
const organizerTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => {
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState, key) => {
    // Check if token is expired during rehydration
    if (outboundState.token && outboundState.tokenExpiry) {
      if (isTokenExpired(outboundState.tokenExpiry)) {
        // Return cleared state if token is expired
        return {
          ...outboundState,
          user: null,
          token: null,
          tokenExpiry: null,
          profileComplete: false,
        };
      }
    }
    return outboundState;
  },
  // define which reducers this transform gets called for
  { whitelist: ["organizer"] }
);

// Configure persistence for each reducer separately to avoid conflicts
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // only persist these fields
};

const organizerPersistConfig = {
  key: "organizer",
  storage,
  whitelist: ["token", "user", "tokenExpiry", "profileComplete"], // specify fields to persist
  transforms: [organizerTransform], // apply the transform
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  organizer: persistReducer(organizerPersistConfig, organizerReducer),
  // Add other reducers here
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);
