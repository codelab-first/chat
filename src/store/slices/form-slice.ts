import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "..";
type State = {
  [key: string]: {
    visible: boolean;
    position: { x: number; y: number };
  };
  data: { visible: boolean; position: { x: number; y: number } };
  map: { visible: boolean; position: { x: number; y: number } };
  chatting: { visible: boolean; position: { x: number; y: number } };
};

const initialState: State = {
  data: { visible: false, position: { x: 250, y: 300 } },
  map: { visible: false, position: { x: 250, y: 300 } },
  chatting: { visible: false, position: { x: 600, y: 100 } },
};
const dataFormSelector = (state: RootState) => {
  return state.form.data;
};
const mapFormSelector = (state: RootState) => {
  return state.form.map;
};
const chattingFormSelector = (state: RootState) => {
  return state.form.chatting;
};

export const formSelector = createSelector(
  dataFormSelector,
  mapFormSelector,
  chattingFormSelector,

  (data, map, chatting) => ({
    data,
    map,
    chatting,
  })
);
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    toggle_form: (state, { payload: { form, value } }) => {
      state[form].visible = value;
    },
    changePosition: (state, { payload: { form, position } }) => {
      if (position.x > 0 && position.y > 60 && position.y < 900) {
        state[form].position = position;
      } else {
        if (position.x < 0 && position.y < 60) {
          state[form].position.x = 0;
          state[form].position.y = 60;
        } else if (position.x < 0 && position.y > 900) {
          state[form].position.x = 0;
          state[form].position.y = 900;
        } else if (position.x < 0) {
          state[form].position = position;
          state[form].position.x = 0;
        } else if (position.y < 60) {
          state[form].position = position;
          state[form].position.y = 60;
        } else if (position.y > 900) {
          state[form].position = position;
          state[form].position.y = 900;
        }
      }
    },
    initPosition: (state, { payload: form }) => {
      state[form].position.x = initialState[form].position.x;
      state[form].position.y = initialState[form].position.y;
      state[form].visible = false;
    },
    mobilePosoiton: (state) => {
      state.chatting.position.x = 0;
      state.chatting.position.y = 500;
    },
  },
});
export default formSlice.reducer;
export const formActions = formSlice.actions;
