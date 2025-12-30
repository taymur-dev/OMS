import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage as default
import { persistReducer, persistStore } from "redux-persist";
import userSlicerReducer from "../redux/UserSlice";
import NavigateSliceReducer from "../redux/NavigationSlice";
// 🔹 Redux Persist configuration
const persistConfig = {
  key: "root", // The key for storing data in localStorage
  storage, // Defines storage type
};

// 🔹 Wrap your reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userSlicerReducer);

export const store = configureStore({
  reducer: {
    officeState: persistedReducer,
    NavigateState: NavigateSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to prevent errors with non-serializable values
    }),
});

// 🔹 Create persistor
export const persistor = persistStore(store);

// 🔹 Define TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
