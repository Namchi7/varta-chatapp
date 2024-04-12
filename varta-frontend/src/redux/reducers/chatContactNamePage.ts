import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface contactType {
  name: string;
  username: string;
}

const chatContactNameSlice = createSlice({
  name: "chatContactName",
  initialState: {
    name: "",
    username: "",
  },
  reducers: {
    setContact: (state, action: PayloadAction<contactType>) => {
      state.name = action.payload.name;
      state.username = action.payload.username;
    },
    resetContact: (state) => {
      state.name = "";
      state.username = "";
    },
  },
});

export const { setContact, resetContact } = chatContactNameSlice.actions;

export default chatContactNameSlice.reducer;
