import {WishListItemDto} from "../Dtos/WishListItemDto.ts";
import {BaseResponse} from "../../../BaseResponse.ts";

export interface GetWishListResponse extends BaseResponse {
    wishList: WishListItemDto[];
}