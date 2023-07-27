import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentLanguage: "jp",
    content: {}
}

export const counter = createSlice({
    name: "localization",
    initialState,
    reducers: {
        reset: () => initialState,
        setLocale: (state, action) => {
            state.currentLanguage = action.payload.language;
            state.content = action.payload.json
        },
    }
})

export const {
    setLocale,
    reset
} = counter.actions

export default counter.reducer