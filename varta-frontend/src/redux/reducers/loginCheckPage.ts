import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface resultType {
  loggedIn: boolean;
  username: string;
}

export const fetchLoginStatus = createAsyncThunk(
  "fetchLoginStatus",
  async () => {
    const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

    const res = await fetch(`${serverURI}/check-login`, {
      method: "GET",
      credentials: "include",
    });

    const result: resultType = await res.json();

    return result;
  }
);

const loginCheckSlice = createSlice({
  name: "loginCheck",
  initialState: {
    isLoading: false,
    login: false,
    username: "",
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLoginStatus.pending, (state) => {
      state.isLoading = true;
      state.username = "";
      state.isError = false;
    });
    builder.addCase(fetchLoginStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.login = action.payload.loggedIn;
      state.username = action.payload.username;
      state.isError = false;
    });
    builder.addCase(fetchLoginStatus.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default loginCheckSlice.reducer;