import { BaseResponse } from "../../../BaseResponse.ts";

//Так как класс пустой, это незачем создавать. Что-бы соблюдать типы как c# и повторять структуру, создаем просто новый тип.
export interface AddWishListProductResponse extends BaseResponse{
    isFavorite: boolean;
    productId: string;
}