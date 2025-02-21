import {ShortProductDto} from "../Dtos/ShortProductDto.ts";


export interface ShortProductDtoUiExtended extends ShortProductDto {
    isFavorite: boolean;
}

// Функция-конвертер из API DTO в UI модель
export function mapShortProductUI(dto: ShortProductDto,  isFavorite: boolean = false): ShortProductDtoUiExtended {
    return {
        ...dto,
        isFavorite: isFavorite,
    };
}