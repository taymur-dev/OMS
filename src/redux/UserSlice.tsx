import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserT = {
  id: number;
  employeeName?: string;
  name?: string;
  loginStatus?: string;
  role?: string;
  token: string;
  userId: string | number;
  image?: string;
  email?: string;
  cnic?: string;
  contact?: string;
  source?: string;
};

type AuthState = {
  currentUser: UserT | null;
  permissions: string[];
  error: string;
};

const initialState: AuthState = {
  currentUser: null,
  permissions: [],
  error: "",
};

const userSlice = createSlice({
  name: "officeState",
  initialState,
  reducers: {
    authSuccess: (
      state,
      action: PayloadAction<{ user: UserT; permissions: string[] } | null>,
    ) => {
      if (action.payload) {
        state.currentUser = action.payload.user || action.payload;
        state.permissions = action.payload.permissions || [];
      } else {
        state.currentUser = null;
        state.permissions = [];
      }
      state.error = "";
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.permissions = [];
      localStorage.clear();
    },
    resetStore: () => initialState,
  },
});

export const { authSuccess, authFailure, logOut, resetStore } =
  userSlice.actions;
export default userSlice.reducer;
