import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, logout, verifyPhoneCode } from "../../api/UserSpace/CustomerService/AuthService";
import { LoginCommand } from "../../api/UserSpace/CustomerService/Commands/LoginCommand";
import { VerifyPhoneCodeCommand } from "../../api/UserSpace/CustomerService/Commands/VerifyPhoneCodeCommand";
import { LoginResponse } from "../../api/UserSpace/CustomerService/Responses/LoginResponse";
import { VerifyPhoneCodeResponse } from "../../api/UserSpace/CustomerService/Responses/VerifyPhoneCodeResponse";
import { LogoutResponse } from "../../api/UserSpace/CustomerService/Responses/LogoutResponse";
import { CustomerDto } from "../../api/UserSpace/CustomerService/Dtos/CustomerDto";
import {addNotification} from "../notificationSlice.ts";

interface UnblockingPair {
    unblockingTime: number;
    phoneNumber: string;
}

// Интерфейс состояния AuthSlice
interface AuthState {
    isLoading: boolean;
    unblockingPairs: UnblockingPair[];
    isSentCode: boolean;
    isOneSendCode: boolean;
    customer: CustomerDto | null;
    error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
    isLoading: false,
    unblockingPairs: [],
    isSentCode: false,
    isOneSendCode: false,
    customer: null,
    error: null,
};


// ✅ Логин: отправка номера телефона (получение кода)
export const loginThunk = createAsyncThunk<
    LoginResponse,
    LoginCommand,
    { rejectValue: string }>(
    "auth/login",
    async (command, { dispatch }) => {
        const response =  await login(command);

        if (response.success && response.messageInformation != null) {
            dispatch(addNotification({ message: response.messageInformation, type: "success" })); // ✅ Добавляем уведомление
        }
        return response;
    }
);

// ✅ Подтверждение кода и авторизация пользователя
export const verifyPhoneCodeThunk = createAsyncThunk<
    VerifyPhoneCodeResponse,
    VerifyPhoneCodeCommand,
    { rejectValue: string }>(
    "auth/verifyPhoneCode",
    async (command,  { dispatch }) => {

        const response = await verifyPhoneCode(command);
        if (response.success && response.messageInformation != null) {
            dispatch(addNotification({ message: response.messageInformation, type: "success" })); // ✅ Добавляем уведомление
        }
        return response
    }
);

// ✅ Выход (очистка данных)
export const logoutThunk = createAsyncThunk<LogoutResponse, void, { rejectValue: string }>(
    "auth/logout",
    async () => {
        const response = await logout();
        resetAuthState();
        return response;
    }
);

// ✅ AuthSlice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.isLoading = false;
            state.unblockingPairs = [];
            state.isSentCode = false;
            state.customer = null;
            state.error = null;
        },

        resetError : (state) => {
            state.error = null;
        },
        setIsSentCode : (state, action: PayloadAction<boolean>) => {
            state.isSentCode = action.payload;
        },

        back : (state) => {
            state.error = null;
            state.isLoading = false;
            state.isSentCode = false;
        },

    },
    extraReducers: (builder) => {
        builder

            // --- Логин ---
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action : PayloadAction<LoginResponse>) => {
                state.isLoading = false;

                if(action.payload.success){
                    state.error = action.payload.error;
                    state.isSentCode = true;
                    state.isOneSendCode = true;

                    // Обновляем массив блокировок (если есть новая)
                    const { unblockingTime, phoneNumber } = action.payload;
                    const existingIndex = state.unblockingPairs?.findIndex(
                        (pair) => pair.phoneNumber === phoneNumber
                    );

                    if (existingIndex !== -1) {
                        // Обновляем существующую запись
                        state.unblockingPairs[existingIndex].unblockingTime = unblockingTime;
                    } else {
                        // Добавляем новую запись
                        state.unblockingPairs.push({ unblockingTime, phoneNumber });
                    }

                }else{
                    state.error = action.payload.error;
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Ошибка при login";
            })

            // --- Подтверждение кода ---
            .addCase(verifyPhoneCodeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyPhoneCodeThunk.fulfilled, (state, action: PayloadAction<VerifyPhoneCodeResponse>) => {
                state.isLoading = false;
                if(action.payload.success){
                    state.customer = action.payload.customerDto!;
                }else{
                    state.error = action.payload.error || "Не удалось выполнить вход, сервер ничего не ответил.";
                }
               
            })
            .addCase(verifyPhoneCodeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Ошибка при проверке кода";
            })

            // --- Выход ---
            .addCase(logoutThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.customer = null;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Ошибка при logout";
            });
    },
});

export const { resetAuthState, resetError, back, setIsSentCode } = authSlice.actions;
export default authSlice.reducer;
