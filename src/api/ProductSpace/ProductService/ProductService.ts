import apiClient from "../../clientApi.ts";
import { LongProductDto } from "./Dtos/LongProductDto.ts";
import {ProductPagedResult} from "./Responses/ProductPagedResult.ts";
import {mapShortProductUI, ShortProductDtoUiExtended} from "./UI/ShortProductDtoUiExtended.ts";
import {ShortProductDto} from "./Dtos/ShortProductDto.ts";
import {GetFilteredProductsQuery} from "./Queries/GetFilteredProductsQuery.ts";


// ✅ Функция для запроса списка товаров с фильтрацией и пагинацией
export async function fetchProducts({ page, search, categoryId }: GetFilteredProductsQuery): Promise<ProductPagedResult<ShortProductDtoUiExtended>> {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append("search", search);
    if (categoryId) params.append("categoryId", categoryId);

    const response = await apiClient.get<ProductPagedResult<ShortProductDto>>(`/products?${params.toString()}`);

    return {
        ...response.data,
        items: response.data.items.map(dto => mapShortProductUI(dto, false)),
    };
}

// Запрос конкретного продукта (Query)
export async function fetchProductById(id: string): Promise<LongProductDto> {
    const response = await apiClient.get<LongProductDto>(`/product/${id}`);
    return response.data;
}




