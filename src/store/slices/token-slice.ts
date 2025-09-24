import type { RootState } from "..";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";

type State = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: State = {
  accessToken: null,
  refreshToken: null,
};

const tokenSelector = (state: RootState) => {
  return {
    accessToken: state.token.accessToken,
    refreshToken: state.token.refreshToken,
  };
};
export const tokenData = createSelector(tokenSelector, (token) => ({
  token,
}));
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    initToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },

    setToken: (state, { payload: rs }) => {
      console.log("token", rs);
      state.accessToken = rs.data.accessToken;
      state.refreshToken = rs.data.refreshToken;
    },
  },
});
export default tokenSlice.reducer;
export const tokenActions = tokenSlice.actions;
