import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    authModalOpen: boolean;
}

const initialState: UIState = {
    authModalOpen: false, // По умолчанию окно закрыто
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
            state.authModalOpen = action.payload;
        },
    },
});

export const { setAuthModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
