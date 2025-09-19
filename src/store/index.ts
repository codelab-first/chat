import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
import authReducer from "./slices/auth-slice";
import chatReducer from "./slices/chat-slice";

const authConfig = { key: "auth", storage: sessionStorage };

const reducers = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  chat: chatReducer,
});

const createStore = () => {
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
};
const store = createStore();
const persistor = persistStore(store, null, () => {
  console.log("Persisted state loaded");
});
// getUser();

export  { store, persistor };
export type RootState = ReturnType<typeof store.getState>;

// const getUser = () => {
//   try {
//     const user = localStorage.getItem("user");
//     if (!user) return;
//     store.dispatch(userActions.check());
//     store.dispatch(chatActions.getChats());
//   } catch (e) {
//     console.log("local storage is not working");
//   }
// };

// import localStorage from "redux-persist/es/storage";
