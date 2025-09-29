import type { RootState } from "..";
import { createSlice, createSelector } from "@reduxjs/toolkit";

type State = {
  [key: string]: {
    [key: string]: string | { id: number; name: string };
  };

  login: { email: string; password: string };
  join: { email: string; password: string; name: string };
  status: {
    success: string;
    message: string;
  };
};

const initialState: State = {
  login: { email: "", password: "" },
  join: { email: "", password: "", name: "" },
  status: { success: "", message: "" },
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

  (success, message, loginData, joinData) => ({
    success,
    message,
    loginData,
    joinData,
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
    errorReset: (state, { payload: error }) => {
      state.status.message = error;
    },
    changeField: (state, { payload: { form, key, value } }) => {
      state[form][key] = value;
    },
    login: (state) => {
      state.status.success = "";
      state.status.message = "";
    },
    loginSuccess: (state, { payload: rs }) => {
      console.log("rs", rs);
      state.status.success = rs.success;
      // state.status.message = rs.message;
    },
    loginFailure: (state, { payload: rs }) => {
      console.log("rs", rs);
      state.status.success = rs.success;
      state.status.message = rs.err.msg;
    },
    join: (state) => {
      state.status.success = "";
      state.status.message = "";
    },
    joinSuccess: (state, { payload: datas }) => {
      // console.log("datas", datas);
      state.status.success = datas.success;
      state.login.email = datas.joinData.email;
      state.login.password = datas.joinData.password;
    },
    joinFailure: (state, { payload: { success, error } }) => {
      state.status.success = success;
      state.status.message = error;
    },
  },
});
export default authSlice.reducer;
export const authActions = authSlice.actions;
