import { configureStore} from "@reduxjs/toolkit"; 
import storageSession from "redux-persist/lib/storage/session"; 
import { persistReducer, persistStore } from "redux-persist";
import userSlicerReducer from "../redux/UserSlice";
import NavigateSliceReducer from "../redux/NavigationSlice";

const persistConfig = {
  key: "root", 
  storage: storageSession, 
};

const persistedUserReducer = persistReducer(persistConfig, userSlicerReducer);

export const store = configureStore({
  reducer: {
    officeState: persistedUserReducer,
    NavigateState: NavigateSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = {
  officeState: ReturnType<typeof userSlicerReducer>;
  NavigateState: ReturnType<typeof NavigateSliceReducer>;
};

export type AppDispatch = typeof store.dispatch;