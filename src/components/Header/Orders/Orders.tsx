import React from "react";

import styles from "./Orders.module.css"
import common from "../../Header/Common.module.css";
import {Link} from "react-router-dom";
import ordersIcon from "../../../assets/images/orders.svg";

interface OrdersProps {
    className?: string
}

const Orders: React.FC<OrdersProps> = ({className}: OrdersProps) => {

    return <>
        <Link className={`${className} ${styles.orders} ${common.header_right_item}`} to={`/orders`}>
            <img src={ordersIcon} className={styles.ordersIcon} alt="orders"/>
            <span>Заказы</span>
        </Link>
    </>
}

export default Orders;