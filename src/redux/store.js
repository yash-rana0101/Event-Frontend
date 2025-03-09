import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./user/userSlice";
import organizerReducer from "./user/organizer";

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["_persist"], // Don't persist the persist key itself
};

// Configure reducer-specific persist settings
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // only persist these fields
  serialize: true, // Ensure proper serialization
};

const organizerPersistConfig = {
  key: "organizer",
  storage,
  whitelist: ["user", "token"], // only persist these fields
  serialize: true, // Ensure proper serialization
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedOrganizerReducer = persistReducer(
  organizerPersistConfig,
  organizerReducer
);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  organizer: persistedOrganizerReducer,
  // Add other reducers here
});

// Apply root level persistence
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

// Create store with improved middleware configuration
export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Expand ignored paths to be more flexible with field names
        ignoredActionPaths: [
          "payload.user",
          "payload.error",
          "payload.user.name",
          "payload.user.username",
        ],
        ignoredPaths: [
          "auth.user",
          "organizer.user",
          "auth.user.name",
          "auth.user.username",
        ],
      },
    }),
  devTools: import.meta.env?.PROD !== true, // Vite uses import.meta.env instead of process.env
});

// Initialize persistor
export const persistor = persistStore(store, null, () => {
  console.log("Rehydration complete");
});

// Helper function to clear persisted storage (for debugging)
export const purgeStore = () => {
  persistor.purge();
};
