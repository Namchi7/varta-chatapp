import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchChatContactsData = createAsyncThunk(
  "fetchChatContactsData",
  async () => {
    const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

    const res = await fetch(`${serverURI}/chats`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    return result;
  }
);

const getChatContactsSlice = createSlice({
  name: "chatContacts",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChatContactsData.pending, (state) => {
      state.isLoading = true;
      state.data = [];
    });
    builder.addCase(fetchChatContactsData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchChatContactsData.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default getChatContactsSlice.reducer;