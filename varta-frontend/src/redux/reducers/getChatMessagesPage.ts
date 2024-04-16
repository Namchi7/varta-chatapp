import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { messageType } from "../../Components/Chat";

interface payloadDataType {
  prevData: messageType[];
  newMessage: messageType;
}

interface initialStateType {
  isLoading: boolean;
  isError: boolean;
  data: messageType[];
}

export const fetchChatMessagesData = createAsyncThunk(
  "fetchChatMessagesData",
  async (contact: string) => {
    const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

    const res = await fetch(`${serverURI}/chat-messages?contact=${contact}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    return result;
  }
);

const initialState: initialStateType = {
  isLoading: false,
  data: [],
  isError: false,
};

const getChatMessagesSlice = createSlice({
  name: "chatMessages",
  initialState,
  reducers: {
    setMessageData: (state, action: PayloadAction<payloadDataType>) => {
      const prevData: messageType[] = action.payload.prevData;
      const newMessage: messageType = action.payload.newMessage;

      state.data = [...prevData, newMessage];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatMessagesData.pending, (state) => {
      state.isLoading = true;
      state.data = [];
    });
    builder.addCase(fetchChatMessagesData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchChatMessagesData.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export const { setMessageData } = getChatMessagesSlice.actions;

export default getChatMessagesSlice.reducer;
