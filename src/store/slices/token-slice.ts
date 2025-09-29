import type { RootState } from "..";
import { createSlice, createSelector } from "@reduxjs/toolkit";

type State = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: number; name: string } | null;
};

const initialState: State = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const tokenSelector = (state: RootState) => {
  return {
    accessToken: state.token.accessToken,
    refreshToken: state.token.refreshToken,
  };
};
const userSelector = (state: RootState) => {
  return state.token.user;
};
export const tokenData = createSelector(
  tokenSelector,
  userSelector,
  (token, user) => ({
    token,
    user,
  })
);
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    initToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },

    setToken: (state, { payload: rs }) => {
      state.accessToken = rs.data.accessToken;
      state.refreshToken = rs.data.refreshToken;
      state.user = rs.data.user;
    },
  },
});
export default tokenSlice.reducer;
export const tokenActions = tokenSlice.actions;
