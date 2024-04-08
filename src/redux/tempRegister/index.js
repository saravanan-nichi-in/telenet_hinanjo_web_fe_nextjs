import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData:[],
  successData:{},
  placeId:{},
};

export const temp_register = createSlice({
  name: "tempRegisterData",
  initialState,
  reducers: {
    reset: () => initialState,
    clearExceptPlaceId: (state) => {
      return {
        ...initialState,
        placeId: state.placeId
      }
    },
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    setOriginalData: (state, action) => {
      state.originalData = action.payload;
    },
    setSuccessData: (state, action) => {
      state.successData = action.payload;
    },
    setPlaceId: (state, action) => {
      state.placeId = action.payload
    }
  },
});

export const { setRegisterData, setOriginalData,setSuccessData,setPlaceId,reset,clearExceptPlaceId } = temp_register.actions;
export default temp_register.reducer;