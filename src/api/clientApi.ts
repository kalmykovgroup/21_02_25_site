import axios from "axios";
import { store } from "../store/store"; // Импортируем Redux store
import { logoutThunk } from "../store/userSpace/authSlice.ts";
import {setAuthModalOpen} from "../store/uiSlice.ts";
import {addNotification} from "../store/notificationSlice.ts";
import i18n from "../i18n.ts";

const apiClient = axios.create({
    baseURL: "/api", // Автоматически проксируется через Vite
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Разрешаем отправку Cookie (нужно для авторизации в браузере)
});

// ✅ Перехватчик ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ API Error:", error);

        if (error.response?.status === 401) {
            console.warn("🔒 401 Unauthorized: Выход из системы...");

            store.dispatch(logoutThunk()); // ✅ Автоматический выход при потере авторизации
            // 2. Показываем модальное окно входа
            store.dispatch(setAuthModalOpen(true));
        }else{
            store.dispatch(addNotification({ message: error, type: "error" }));
        }


        const message =
            error.response?.status === 401
                ? i18n.t("errors.unauthorized")
                : i18n.t("errors.serverError");

        store.dispatch(addNotification({ type: "error", message: message }));

        return Promise.reject(error);
    }
);

export default apiClient;
