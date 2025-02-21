import apiClient from "../../clientApi.ts";
import {AddWishListProductResponse} from "./Responses/AddWishListProductResponse.ts";
import {GetWishListResponse} from "./Responses/GetWishListResponse.ts";
import {ShortProductDtoUiExtended} from "../ProductService/UI/ShortProductDtoUiExtended.ts";

// ✅ Запрос на добавление/удаление товара из избранного
export async function toggleFavoriteBatch(batch: ShortProductDtoUiExtended[]): Promise<AddWishListProductResponse> {
    try {
        const response = await apiClient.post(`/product/add-to-wish-list`,
            batch.map(e => ({productId : e.id, isFavorite : e.isFavorite})));
        return response.data;

    } catch (error) {
        console.error("Ошибка при обновлении избранного:", error);
        throw error;
    }
}

// ✅
export async function fetchGetWishList(): Promise<GetWishListResponse> {
    try {
        const response = await apiClient.get(`/product/wish-list`);
        return response.data;

    } catch (error) {
        console.error("Ошибка при обновлении избранного:", error);
        throw error;
    }
}