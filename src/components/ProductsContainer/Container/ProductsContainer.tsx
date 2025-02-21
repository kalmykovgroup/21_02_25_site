import React, {
    useEffect,
    useCallback,
    useRef
} from "react";
import ProductCard from "../Card/ProductCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
    fetchProductsThunk,
    setPage
} from "../../../store/productSpace/productsSlice.ts";
import styles from "./ProductsContainer.module.css";

/**
 * Компонент со списком товаров, подгружающихся "бесконечно" (infinite scroll).
 */
const ProductsContainer: React.FC = () => {
    const dispatch = useAppDispatch();

    // Достаём из Redux нужные значения
    const {
        items: products,
        page,
        totalPages,
        loading,
        search
    } = useAppSelector((state) => state.productsSlice);

    // При изменении `page` или `search` (и т.д.) подтягиваем данные
    useEffect(() => {
        dispatch(fetchProductsThunk({ page, search }));
    }, [dispatch, page, search]);

    // Реализация IntersectionObserver, чтобы подгружать следующую страницу,
    // когда последний элемент списка появляется в зоне видимости
    const observer = useRef<IntersectionObserver | null>(null);

    /**
     * Колбэк, который привязываем к "последнему" элементу списка.
     * Когда этот элемент "на виду" — подгружаем следующую страницу (если она есть).
     */
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        // Если сейчас идёт загрузка, не надо дёргать запрос снова
        if (loading) return;

        // Если уже создавали observer — отключаем его от предыдущего элемента
        if (observer.current) {
            observer.current.disconnect();
        }

        // Создаём новый IntersectionObserver
        observer.current = new IntersectionObserver((entries) => {
            // Проверяем, что элемент появился в зоне видимости
            if (entries[0].isIntersecting && page < totalPages) {
                dispatch(setPage(page + 1));
            }
        });

        // Если есть DOM-элемент, начинаем его "наблюдать"
        if (node) observer.current.observe(node);

    }, [loading, page, totalPages, dispatch]);



    return (
        <div className={styles.productsContainer}>

            {/* Рендерим все товары */}
            {products.map((product, index) => {
                // Для последней карточки в списке вешаем ref, чтобы ловить «конец» списка
                if (index === products.length - 1) {
                    return (
                        <div ref={lastElementRef} key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    );
                } else {
                    return (
                        <ProductCard key={product.id} product={product} />
                    );
                }
            })}

            {/* Если идёт загрузка — можем показать спиннер или лоадер */}
            {loading && <div className={styles.loading}>Загрузка...</div>}
        </div>
    );
};

export default ProductsContainer;
