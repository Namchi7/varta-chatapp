import { configureStore } from "@reduxjs/toolkit";
import loginCheckReducer from "./reducers/loginCheckPage";
import getChatContactsReducer from "./reducers/getChatContactsPage";
import getChatMessagesReducer from "./reducers/getChatMessagesPage";
import chatContactNameReducer from "./reducers/chatContactNamePage";

export const store = configureStore({
  reducer: {
    loggedIn: loginCheckReducer,
    chatContact: chatContactNameReducer,
    chatContacts: getChatContactsReducer,
    chatMessages: getChatMessagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
