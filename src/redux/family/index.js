import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  family: {},
};

export const family = createSlice({
  name: "family",
  initialState,
  reducers: {
    reset: () => initialState,
    setFamily: (state, action) => {
      state.family = action.payload;
    },
  },
});

export const { setFamily, reset } = family.actions;
export default family.reducer;