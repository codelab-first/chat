import type { RootState } from "..";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createSelector } from "@reduxjs/toolkit";
type State = {
  imageList: { url: string }[];
  messages: { name: string; chat: string; image: string }[];
  status: { message: string; loading: boolean };
};
const initialState: State = {
  imageList: [],
  messages: [],
  status: { message: "", loading: false },
};
const imageSelector = (state: RootState) => {
  return state.chat.imageList;
};
const messagesSelector = (state: RootState) => {
  return state.chat.messages;
};
const statusSelector = (state: RootState) => {
  return state.chat.status;
};
export const chatData = createSelector(
  imageSelector,
  statusSelector,
  messagesSelector,
  (imageList, status, messages) => ({ imageList, status, messages })
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<FormData>) => {
      // console.log(action);
      state.imageList = [];
      state.status.message = "";
      state.status.loading = true;
    },
    addImageSuccess: (state, { payload: message }) => {
      // state.imageList = image;
      state.status.message = message;
      state.status.loading = false;
    },
    addImageFailure: (state, { payload: error }) => {
      state.imageList = [];
      state.status.message = error;
      state.status.loading = false;
    },
    getChats: (state) => {
      state.messages = [];
      state.status.message = "";
      state.status.loading = true;
    },
    getChatsSuccess: (state, { payload: messages }) => {
      // console.log("slice: messages", messages);
      state.messages = messages;
      state.status.message = "ok";
      state.status.loading = false;
    },
    getChatsFailure: (state, { payload: error }) => {
      state.messages = [];
      state.status.message = error;
      state.status.loading = false;
    },
  },
});
export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
