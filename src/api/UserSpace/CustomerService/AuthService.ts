import apiClient from "../../clientApi.ts";
import {LoginResponse} from "./Responses/LoginResponse.ts";
import {LogoutResponse} from "./Responses/LogoutResponse.ts";
import {VerifyPhoneCodeCommand} from "./Commands/VerifyPhoneCodeCommand.ts";
import {VerifyPhoneCodeResponse} from "./Responses/VerifyPhoneCodeResponse.ts";
import {LoginCommand} from "./Commands/LoginCommand.ts";

// ✅ Логин: отправляем номер телефона и пароль, сервер возвращает токен в Cookie
export async function login(dto : LoginCommand): Promise<LoginResponse> {
    const response =  await apiClient.post("/auth/login", dto);
    return response.data;
}

// ✅ Выход: удаляет токен из Cookie
export async function logout(): Promise<LogoutResponse> {
    const response =  await apiClient.post("/auth/logout");
    return response.data;
}


// ✅ Логин: отправляем номер телефона и пароль, сервер возвращает токен в Cookie
export async function verifyPhoneCode(dto : VerifyPhoneCodeCommand): Promise<VerifyPhoneCodeResponse> {
    const response =  await apiClient.post("/auth/verify-phone-code", dto);
    return response.data;
}

