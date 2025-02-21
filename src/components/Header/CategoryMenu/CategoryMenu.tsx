import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store.ts";
import styles from "./CategoryMenu.module.css";
import {Link} from "react-router-dom";
import {fetchCategoriesThunk, setActiveCategory} from "../../../store/header/categoriesSlice.ts";
import arrowIcon from "../../../assets/images/category/arrow.svg";
import {useEffect, useState} from "react";
import { CategoryDto } from "../../../api/CategorySpace/CategoryService/Dtos/CategoryDto.ts";

export default function CategoryMenu() {
    const dispatch = useDispatch<AppDispatch>();
    const {categories, activeCategory} = useSelector((state: RootState) => state.categorySlice);

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategoriesThunk());
        }
    }, [dispatch, categories.length, categories]);

    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

    // Функция для переключения состояния "развернуть / свернуть"
    const toggleCategory = (categoryId: string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // Показывает список подкатегорий (максимум 5, если не развернуто)
    const showRecentSubCategories = (category: CategoryDto) => {
        const isOpen = openCategories[category.id] ?? false;
        const visibleCategories = category.subCategories.slice(0, isOpen ? category.subCategories.length : 5);

        return (
            <>
                <ul>
                    {visibleCategories.map((sub) => (
                        <li key={sub.id}>
                            <Link className={styles.titleTwoSunCategory} to={`/categories`}>
                                {sub.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                {category.subCategories.length > 5 && (
                    <button onClick={() => toggleCategory(category.id)}>
                        {isOpen ? (
                            <div className={styles.toggleButtonRollDown}>
                                <span>Свернуть</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path
                                        d="m10 8.871 4.094 4.094 1.062-1.059L10 6.75l-5.154 5.154 1.06 1.061L10 8.871z"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className={styles.toggleButtonRollUp}>
                                <span>Еще</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M19.997 10.007 12 18.004l-7.997-7.997 1.414-1.414L12 15.176l6.583-6.583z"></path>
                                </svg>
                            </div>
                        )}
                    </button>
                )}
            </>
        );
    };


    const subCategoriesTwoLevelOffset = (offset : number) => {
        return <>
            {activeCategory?.subCategories
                .filter((_, index) => (index - offset) % 3 === 0)
                .map((category) => (subCategoriesTwoLevel(category) ))}
        </>
    }

    const subCategoriesTwoLevel = (category: CategoryDto) => {
        return <>
            <div className={styles.wrapper} key={category.id}>
                <div className={styles.categoryDownList}>
                    <Link className={styles.titleOneSunCategory} to={`/categories`}>
                        {category.name}
                    </Link>
                    <ul>
                        {showRecentSubCategories(category)}
                    </ul>
                </div>
            </div>
        </>
    }


    return (
        <>
            <div className={styles.container}>


                <div className={styles.categories}>
                    <ul className={styles.leftCategoryMenu}>
                        {categories.map((category) => (
                            <li key={category.id}
                                className={`${styles.categoryItem} ${category.id === activeCategory?.id ? styles.active : ""}`}
                                onMouseEnter={() => dispatch(setActiveCategory(category))}>
                                <img src={`/src/assets/category/${category.imgUrl}`} className={`${styles.icon}`}
                                     alt=""/>
                                <span className={styles.name}>{category.name}</span>
                                <img src={arrowIcon} className={`${styles.arrowIcon}`} alt=""/>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.rightCategoryContainer}>
                        <div>
                            <Link className={`${styles.bigTitle}`} to={`/categories`}>
                                {activeCategory?.name}
                            </Link>
                        </div>
                        <div>

                            <div className={styles.categoryContainer}>
                                {subCategoriesTwoLevelOffset(0)}
                                {subCategoriesTwoLevelOffset(1)}
                                {subCategoriesTwoLevelOffset(2)}
                            </div>


                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}

