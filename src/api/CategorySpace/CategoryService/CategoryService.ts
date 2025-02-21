

// ✅ Функция для запроса списка товаров с фильтрацией и пагинацией
import {CategoryDto} from "./Dtos/CategoryDto.ts";
import apiClient from "../../clientApi.ts";

export async function fetchCategories(): Promise<CategoryDto[]> {


    const response = await apiClient.get<CategoryDto[]>(`/categories`);

    return response.data
}