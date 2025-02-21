import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Используем localStorage
import productsSlice from './productSpace/productsSlice.ts';
import authSlice from './userSpace/authSlice.ts';
import uiSlice from './uiSlice.ts';
import notificationSlice from './notificationSlice.ts';
import categoriesSlice from "./header/categoriesSlice.ts";
import searchSlice from "./header/searchSlice.ts";
import wishListSlice from "./productSpace/wishListSlice.ts";

// 🔹 Конфигурация persist
const persistConfig = {
    key: 'root',       // Ключ для хранения в localStorage
    storage,           // Где хранить (localStorage)
    whitelist: ['authSlice', 'uiSlice', 'notificationsSlice', 'categoriesSlice', 'searchSlice', 'wishListSlice', 'productsSlice'], // Какие редюсеры сохранять
};

// 🔹 Комбинированный редюсер (все редюсеры приложения)
const rootReducer = combineReducers({
    productsSlice: productsSlice, // ❌ НЕ сохраняем (данные API)
    authSlice: authSlice,         // ✅ Сохраняем (авторизация)
    uiSlice: uiSlice,             // ✅ Сохраняем (UI настройки)
    notificationsSlice: notificationSlice, // ✅ Сохраняем (уведомления)
    categorySlice: categoriesSlice,
    searchSlice: searchSlice,
    wishListSlice: wishListSlice,
});

// 🔹 Оборачиваем rootReducer в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Создаем store с persistedReducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Отключаем предупреждение о сериализации
        }),
});

// 🔹 Создаем persistor
export const persistor = persistStore(store);

// 🔹 Типизация Redux (без изменений)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
