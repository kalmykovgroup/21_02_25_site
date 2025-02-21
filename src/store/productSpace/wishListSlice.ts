import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishListItemDto } from "../../api/ProductSpace/WishListService/Dtos/WishListItemDto";
import {
    fetchGetWishList,
    toggleFavoriteBatch
} from "../../api/ProductSpace/WishListService/WishListService";
import { GetWishListResponse } from "../../api/ProductSpace/WishListService/Responses/GetWishListResponse";
import {RootState, store} from "../store";
import { addNotification } from "../notificationSlice";
import {ShortProductDtoUiExtended} from "../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts";
import { updateProductFavoriteStatus } from "./productsSlice.ts";


// Ключ для хранения в `localStorage`
const LOCAL_STORAGE_KEY = "wishlist";
const ORIGINAL_LOCAL_STORAGE_KEY = "original_wishlist";

interface WishListState {
    wishList: WishListItemDto[];
    originalWishList: WishListItemDto[];
    isLoading: boolean;
}

const initialState: WishListState = {
    wishList: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),
    originalWishList: JSON.parse(localStorage.getItem(ORIGINAL_LOCAL_STORAGE_KEY) || "[]"),
    isLoading: false,
};


// ✅ `thunk` для загрузки избранного (из БД или `localStorage`)
export const fetchWishListThunk = createAsyncThunk<GetWishListResponse, boolean>(
    "wishList/fetchWishList",
    async (isAuthenticated) => {
        if (isAuthenticated) {
            return await fetchGetWishList();
        } else {
            return {
                success: true,
                wishList: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),
                error: null,
            };
        }
    }
);


let syncTimeout: NodeJS.Timeout | null = null; // Таймер для отложенной синхронизации

export const toggleFavoriteThunk = createAsyncThunk<void, ShortProductDtoUiExtended, { state: RootState }>(
    "products/toggleFavorite",
    async (product, { getState, dispatch  }) => {
        const state = getState();
        const customer = state.authSlice.customer;
        const isAuthenticated = !!customer;

        // ✅ Обновляем `isFavorite` в `Redux`, чтобы UI обновился мгновенно

        // ✅ Обновляем `localStorage` мгновенно
        const wishList: ShortProductDtoUiExtended[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        const index = wishList.findIndex((item) => item.id === product.id);
        const isAdding = index === -1;

        if (isAdding) {
            wishList.push({ ...product, isFavorite: true });
            dispatch(updateProductFavoriteStatus({ productId: product.id, isFavorite: true }));
        } else {
            wishList.splice(index, 1);
            dispatch(updateProductFavoriteStatus({ productId: product.id, isFavorite: false }));
        }

        // ✅ Обновляем `Redux`
        dispatch(updateWishList(wishList));

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishList));


        if (isAuthenticated) {
            // ✅ Если пользователь авторизован, ждем 2 секунды перед отправкой запроса
            if (syncTimeout) {
                clearTimeout(syncTimeout); // Сбрасываем предыдущий таймер
            }

            syncTimeout = setTimeout(async () => {
                const originalWishList: ShortProductDtoUiExtended[] = JSON.parse(localStorage.getItem(ORIGINAL_LOCAL_STORAGE_KEY) || "[]");
                const wishList: ShortProductDtoUiExtended[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");


                const editList = findWishListChanges(wishList, originalWishList);


                if(editList.length === 0) return;

                localStorage.setItem(ORIGINAL_LOCAL_STORAGE_KEY, JSON.stringify(wishList));

                console.log(editList);
                console.log(wishList.length);

                await syncFavoritesWithServer(editList); // Отправляем данные на сервер
            }, 2000); // ⏳ Ждем 2 секунды после последнего клика
        }
    }
);


function findWishListChanges(wishList: ShortProductDtoUiExtended[], originalWishList: ShortProductDtoUiExtended[]) {
    const changes: ShortProductDtoUiExtended[] = [];

    // Создаем `Map` для быстрого поиска по `id`
    const originalMap = new Map(originalWishList.map((product) => [product.id, product]));

    // 🔹 Проверяем добавленные или измененные продукты
    for (const product of wishList) {
        const originalProduct = originalMap.get(product.id);

        if (!originalProduct) {
            // ✅ Продукт новый (был добавлен)
            changes.push({ ...product });
        } else if (product.isFavorite !== originalProduct.isFavorite) {
            // ✅ Продукт изменился (`isFavorite` поменялся)
            changes.push({ ...product });
        }

        // ✅ Удаляем из `originalMap`, чтобы после найти удаленные элементы
        originalMap.delete(product.id);
    }

    // 🔹 Оставшиеся элементы в `originalMap` - это удаленные продукты
    for (const removedProduct of originalMap.values()) {
        changes.push({ ...removedProduct, isFavorite: false }); // Помечаем, что продукт удален
    }

    return changes;
}


async function syncFavoritesWithServer(bach: ShortProductDtoUiExtended[]) {

    try {
        const response = await toggleFavoriteBatch(bach); // Отправляем только `id` продуктов
        if (response.success) {

            console.log(`✅ Избранное синхронизировано с сервером`);
        } else {
            console.error("❌ Ошибка при синхронизации избранного:", response.error);
        }
    } catch (error) {
        console.error("❌ Ошибка при отправке батч-запроса:", error);
    }
}



// ✅ `thunk` для синхронизации избранного из `localStorage` в БД при авторизации
export const syncLocalWishListToServer = createAsyncThunk<void, void>(
    "wishList/syncLocalToServer",
    async (_, { getState }) => {
        const state = getState() as { wishList: WishListState };
        const localWishList = state.wishList.wishList;

        if (localWishList.length > 0) {
            await fetch("/api/wish-list/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wishList: localWishList }),
            });

            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }
);

// ====================================================
// 🎯 `Redux Slice` - Управление избранным
// ====================================================
const wishListSlice = createSlice({
    name: "wishList", // Имя слайса (редьюсера)
    initialState, // Начальное состояние (загружается из `localStorage`)
    reducers: {
        // ✅ Очистка списка избранного (локально и в `localStorage`)
        clearWishList: (state) => {
            state.wishList = [];
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        },

        // ✅ Добавление товара в избранное (только локально, без запроса к серверу)
        addWishListItem: (state, action: PayloadAction<WishListItemDto>) => {
            const item = action.payload;

            // Проверяем, нет ли уже этого товара в `wishList`
            if (!state.wishList.some((p) => p.id === item.id)) {
                state.wishList.push(item); // Добавляем товар в `Redux`
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.wishList)); // Обновляем `localStorage`
            }
        },

        // ✅ Удаление товара из избранного (локально и из `localStorage`)
        removeWishListItem: (state, action: PayloadAction<string>) => {
            state.wishList = state.wishList.filter((item) => item.id !== action.payload); // Фильтруем список
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.wishList)); // Обновляем `localStorage`
        },
        updateWishList: (state, action: PayloadAction<ShortProductDtoUiExtended[]>) => {
            state.wishList = action.payload;
        },
    },

    // 🎯 `extraReducers` - обработка асинхронных `thunk`-действий
    extraReducers: (builder) => {
        builder
            // ✅ Обработка загрузки избранного (`fetchWishListThunk`)
            .addCase(fetchWishListThunk.pending, (state) => {
                state.isLoading = true; // Устанавливаем флаг загрузки
            })
            .addCase(fetchWishListThunk.fulfilled, (state, action: PayloadAction<GetWishListResponse>) => {
                state.isLoading = false; // Отключаем индикатор загрузки

                if (action.payload.success) {
                    state.wishList = action.payload.wishList; // Обновляем `Redux` состояние
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(action.payload.wishList)); // Синхронизируем `localStorage`
                } else {
                    store.dispatch(addNotification({ message: action.payload.error ?? "Ошибка загрузки избранного", type: "error" }));
                }
            })
            .addCase(fetchWishListThunk.rejected, (state, action) => {
                state.isLoading = false; // Сбрасываем флаг загрузки
                store.dispatch(addNotification({ message: action.payload as string ?? "Ошибка загрузки избранного", type: "error" }));
            })



    },
});

export const { clearWishList, addWishListItem, removeWishListItem, updateWishList } = wishListSlice.actions;
export default wishListSlice.reducer;
