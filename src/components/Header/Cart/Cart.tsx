import React from "react";

import styles from "./Cart.module.css"
import {Link} from "react-router-dom";
import common from "../../Header/Common.module.css";
import cartIcon from "../../../assets/images/cart.svg";

interface CartProps {
    className?: string
}

const Cart: React.FC<CartProps> = ({className}: CartProps) => {

    return <>
        <Link className={`${className} ${styles.cart} ${common.header_right_item}`} to={`/cart`}>
            <img src={cartIcon} className={styles.cartIcon} alt="cart"/>
            <span>Корзина</span>
        </Link>
    </>
}

export default Cart;