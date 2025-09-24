import type { RootState } from "..";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";

type State = {
  [key: string]: {
    [key: string]: string | { id: number; name: string } | null;
  };
  login: { email: string; password: string };
  join: { email: string; password: string; name: string };
  status: {
    success: string;
    message: string;
    auth: { id: number; name: string } | null;
  };
};

const initialState: State = {
  login: { email: "", password: "" },
  join: { email: "", password: "", name: "" },
  status: { success: "", message: "", auth: null },
};
const successSelector = (state: RootState) => {
  return state.auth.status.success;
};
const messageSelector = (state: RootState) => {
  return state.auth.status.message;
};
const userSelector = (state: RootState) => {
  return state.auth.status.auth;
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
  userSelector,
  (success, message, loginData, joinData, user) => ({
    success,
    message,
    loginData,
    joinData,
    user,
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
      // console.log("rs:", rs.data.user);
      state.status.success = rs.success;
      // state.status.message = message;
      state.status.auth = rs.data.user;
    },
    loginFailure: (state, { payload: { success, error } }) => {
      state.status.success = success;
      state.status.message = error;
      state.status.auth = null;
    },
    join: (state) => {
      state.status.success = "";
      state.status.message = "";
    },
    joinSuccess: (state, { payload: datas }) => {
      console.log("datas", datas);
      state.status.success = datas.success;
      state.login.email = datas.joinData.email;
      state.login.password = datas.joinData.password;
    },
    joinFailure: (state, { payload: { success, error } }) => {
      state.status.success = success;
      state.status.message = error;
    },
    logout: (state) => {
      state.status.auth = null;
    },
  },
});
export default authSlice.reducer;
export const authActions = authSlice.actions;
