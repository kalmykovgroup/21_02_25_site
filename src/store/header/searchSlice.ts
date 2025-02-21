import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
    isFocused: boolean;
    query: string;
    searchHistory: string[];
}

const initialState: SearchState = {
    isFocused: false,
    query: "",
    searchHistory: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setFocus: (state, action: PayloadAction<boolean>) => {
            state.isFocused = action.payload;
        },
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        addToHistory: (state, action: PayloadAction<string>) => {
            const searchTerm = action.payload.trim();
            if (searchTerm && !state.searchHistory.includes(searchTerm)) {
                state.searchHistory.unshift(searchTerm); // Добавляем в начало истории
                if (state.searchHistory.length > 10) {
                    state.searchHistory.pop(); // Ограничиваем историю 10 записями
                }
            }
        },
        clearHistory: (state) => {
            state.searchHistory = [];
        },

        removeFromHistory: (state, action: PayloadAction<string>) => {
            state.searchHistory = state.searchHistory.filter(item => item !== action.payload);
        },
    },
});

export const { setFocus, setQuery, addToHistory, clearHistory, removeFromHistory } = searchSlice.actions;
export default searchSlice.reducer;
