import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

const getChatMessagesSlice = createSlice({
  name: "chatMessages",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
  },
  reducers: {},
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

export default getChatMessagesSlice.reducer;
