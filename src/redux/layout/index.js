import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layout: {},
  user: {
    place: {},
    other: ""
  },
};

export const layout = createSlice({
  name: "layout",
  initialState,
  reducers: {
    reset: () => initialState,
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { reset, setLayout, setUserDetails } = layout.actions;
export default layout.reducer;