import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {thunk} from "redux-thunk";

// Import reducers
import authReducer from "./user/userSlice";
import organizerReducer from "./user/organizer";

// Configure persistence for each reducer separately to avoid conflicts
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // only persist these fields
};

const organizerPersistConfig = {
  key: "organizer",
  storage,
  whitelist: ["token", "user"], // only persist these fields
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
      serializableCheck: false, // Disable serializable check for redux-persist
    }).concat(thunk),
});

export const persistor = persistStore(store);
