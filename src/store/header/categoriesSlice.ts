import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CategoryDto} from "../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";
import {fetchCategories} from "../../api/CategorySpace/CategoryService/CategoryService.ts";


interface CategoryState {
    categories: CategoryDto[];
    activeCategory: CategoryDto | null;
    isOpenCategoryMenu: boolean;
    isLoading: boolean;
}


const initialState: CategoryState = {
    categories: [],
    activeCategory: null,
    isOpenCategoryMenu: false,
    isLoading: false
};

// ✅ Асинхронный запрос для получения категорий
export const fetchCategoriesThunk = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
             // Запрос к API
            return await fetchCategories(); // Возвращаем данные
        } catch (error) {
            return rejectWithValue("Ошибка загрузки категорий");
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setActiveCategory: (state, action: PayloadAction<CategoryDto | null>) => {
            state.activeCategory = action.payload;
        },
        toggleOpenCategoryMenu: (state) => {
            state.isOpenCategoryMenu = !state.isOpenCategoryMenu;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action: PayloadAction<CategoryDto[]>) => {
                state.categories = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCategoriesThunk.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setActiveCategory, toggleOpenCategoryMenu } = categorySlice.actions;
export default categorySlice.reducer;
