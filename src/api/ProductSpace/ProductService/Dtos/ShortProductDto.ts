export interface ShortProductDto {
    id: string;
    url: string;
    name: string;
    rating: number;
    numberOfReviews: number;
    price: number;
    originalPrice: number | null;
    discountPercentage: number | null;
    isDiscount: boolean;
}

