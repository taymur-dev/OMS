import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserT = {
  [key: string]: string;
};

type AuthState = {
  currentUser: UserT | null;
  error: string;
};

const initialState: AuthState = {
  currentUser: null,
  error: "",
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess: (state, action: PayloadAction<UserT | null>) => {
      state.currentUser = action.payload;
      state.error = "";
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
      localStorage.clear();
      // localStorage.removeItem("persist:root");
    },
    resetStore: () => initialState,
  },
});

export const { authSuccess, authFailure, logOut, resetStore } =
  userSlice.actions;
export default userSlice.reducer;
