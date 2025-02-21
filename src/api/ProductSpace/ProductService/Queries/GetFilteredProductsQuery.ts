

export interface GetFilteredProductsQuery {
    page: number;
    categoryId?: string;  // Фильтр по категории
    search?: string;      // Поиск по названию
}
