import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    admin: {},
    staff: {},
}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        setAdminValue: (state, action) => {
            state.admin = action.payload.admin;
        },
        setStaffValue: (state, action) => {
            state.staff = action.payload.staff;
        },
    }
})

export const {
    setAdminValue,
    setStaffValue,
    reset
} = auth.actions

export default auth.reducer