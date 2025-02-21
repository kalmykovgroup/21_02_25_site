
import noImage from "../../../assets/images/no-image.svg";
import {ShortProductDtoUiExtended} from "../../../api/ProductSpace/ProductService/UI/ShortProductDtoUiExtended.ts"; // ✅ Импорт файла
import styles from "./ProductCard.module.css";
import {useAppDispatch} from "../../../hooks/hooks.ts";
import {useState} from "react";
import loaderImg from "../../../assets/images/loader.svg"
import {toggleFavoriteThunk} from "../../../store/productSpace/wishListSlice.ts";

interface ProductCardProps {
    product: ShortProductDtoUiExtended;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useAppDispatch();

    const [isLoaderImg, setIsLoaderImg] = useState(false);

    const handleFavoriteClick = () => {
        dispatch(toggleFavoriteThunk(product));
    };


    return (

        <div className={styles.productItem}>

            <button
                className={`${styles.favoriteBtn} ${product.isFavorite ? styles.active : ""}`}
                onClick={handleFavoriteClick}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M11.9694 22C12.5756 22 12.9181 21.4709 13.8945 20.435C15.115 19.1402 16.2918 17.9336 17.1462 17.0272C19.6691 14.3511 20.661 13.3356 21.3649 12.5433C23.2357 10.4378 23.4784 7.51229 22.2097 5.29142C20.6101 2.49159 18.2247 2 16.9421 2C15.6594 2 14.7421 2.49159 13.1221 3.75703L11.9989 4.8084L10.9063 3.75703C9.1489 2.25488 7.87646 2 7.05939 2C6.37842 2 3.5339 2.00043 1.70086 5.29142C0.363371 7.6927 1.0623 10.6507 2.76628 12.5433C3.07139 12.8822 4.32884 14.1998 6.51094 16.572C7.3895 17.5272 8.63263 18.8407 9.54781 19.8382C10.0663 20.4034 11.3631 22 11.9694 22Z"/>
                </svg>
            </button>

            <div className={styles.productContent}>
                <div className={styles.imgContainer}>
                    <div className={styles.imgContainer__}>
                        <img className={styles.loaderSvg} src={loaderImg}
                             style={{display: !isLoaderImg ? "none" : undefined}} alt=""/>

                        <img className={styles.mainImg} src={product.url?.trim() ? product.url : noImage} alt="" loading={"lazy"}/>
                    </div>

                </div>


                <div className={`${styles.name}`}>

                    <div className={styles.imgIllusion}/>

                    <p>{product.name}</p>
                </div>

                <div className={styles.priceContainer}>

                    {product.discountPercentage == null ? (
                         <span className={styles.notDiscountPercentage}>
                             {product.price}₽
                         </span>
                    ) : (
                        <>
                            <span className={styles.originalPrice}>
                              {product.originalPrice}₽
                            </span>

                            <div
                                className={`${styles.price} ${product.discountPercentage && product.discountPercentage > 40 ? product.discountPercentage > 60 ? styles.percent60_80 : styles.percent40_60 : styles.percent0_40}`}>
                                {product.price}₽
                            </div>
                        </>
                    )}


                </div>


            </div>

        </div>

    )
        ;
};

export default ProductCard;
