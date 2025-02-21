import React from "react";
import styles from "../../Header/Menu/Menu.module.css";
import {toggleOpenCategoryMenu} from "../../../store/header/categoriesSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";

interface MenuProps {
    className?: string
}

const Menu: React.FC<MenuProps> = ({className}: MenuProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const {isOpenCategoryMenu} = useSelector((state: RootState) => state.categorySlice);

    return (
            <button className={`${styles.menu} ${className || ''}`} onClick={() => dispatch(toggleOpenCategoryMenu())}
                   /* onMouseEnter={() => this.setState({
                        colorIcon: "#ffffff"
                    })}
                    onMouseLeave={() => this.setState({
                        colorIcon: "#000000"
                    })}*/>


                <svg id={styles['hamburger']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path className={`${styles.l1} ${isOpenCategoryMenu ? styles.l1Transform : ""}`}
                          d="M3 6h18v2H3z"></path>
                    <path className={`${styles.l2} ${isOpenCategoryMenu ? styles.l2Transform : ""}`}
                          d="M3 11h18v2H3z"></path>
                    <path className={`${styles.l3} ${isOpenCategoryMenu ? styles.l3Transform : ""}`}
                          d="M3 16h18v2H3z"></path>
                </svg>

                <div className={`${styles.label}`}>Каталог</div>

            </button>

    )
}

export default Menu;