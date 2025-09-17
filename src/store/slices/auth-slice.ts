import type { RootState } from "..";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";

type State = {
  [key: string]: { [key: string]: string | number | boolean };
  login: { email: string; password: string };
  join: { email: string; password: string; name: string };
};
const initialState: State = {
  login: { email: "", password: "" },
  join: { email: "", password: "", name: "" },
  status: { success: "", message: "", loading: false },
};
const successSelector = (state: RootState) => {
  return state.auth.status.success;
};
const messageSelector = (state: RootState) => {
  return state.auth.status.message;
};
const loginSelector = (state: RootState) => {
  return state.auth.login;
};
const joinSelector = (state: RootState) => {
  return state.auth.join;
};
export const authData = createSelector(
  successSelector,
  messageSelector,
  loginSelector,
  joinSelector,
  (success, message, loginData, joindata) => ({
    success,
    message,
    loginData,
    joindata,
  })
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initForm: (state, { payload: form }) => {
      state[form] = initialState[form];
      state.status.success = initialState.status.success;
      state.status.message = initialState.status.message;
    },
    errorReset: (state) => {
      state.status.message = "";
    },
    changeField: (state, { payload: { form, key, value } }) => {
      state[form][key] = value;
    },
    login: (state) => {
      state.status.success = "";
      state.status.message = "";
    },
    loginSuccess: (state, { payload: { success, message } }) => {
      state.status.success = success;
      state.status.message = message;
    },
    loginFailure: (state, { payload: { success, message } }) => {
      state.status.success = success;
      state.status.message = message;
    },
    join: (state) => {
      state.status.success = "";
      state.status.message = "";
    },
    joinSuccess: (state, { payload: { success, message } }) => {
      state.status.success = success;
      state.status.message = message;
    },
    joinFailure: (state, { payload: { success, message } }) => {
      state.status.success = success;
      state.status.message = message;
    },
  },
});
export default authSlice.reducer;
export const authActions = authSlice.actions;
