import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    layout: {},
};

export const layout = createSlice({
  name: "layout",
  initialState,
  reducers: {
    reset: () => initialState,
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
  },
});

export const { setLayout, reset } = layout.actions;
export default layout.reducer;