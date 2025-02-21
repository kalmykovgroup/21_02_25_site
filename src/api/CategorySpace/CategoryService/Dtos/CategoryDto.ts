export interface CategoryDto {
    id: string;
    parentCategoryId: string | null;
    imgUrl: string | null;
    name: string;
    description: string | null;
    level: number;
    fullPath: string; //Полный путь категории в иерархии

    subCategories: CategoryDto[]
}