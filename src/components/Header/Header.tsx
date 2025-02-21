import styles from './Header.module.css';
import React from "react";
import Logo from "./Logo/Logo.tsx";
import Menu from "./Menu/Menu.tsx";
import CategoryMenu from "./CategoryMenu/CategoryMenu.tsx";
import {useDevice} from "../../DeviceContext.tsx";
import Orders from "./Orders/Orders.tsx";
import WishList from "./WishList/WishList.tsx";
import Cart from "./Cart/Cart.tsx";
import Profile from "./Profile/Profile.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import SearchBar from "./SearchBar/SearchBar.tsx";


const Header2: React.FC = () => {
    const { isDesktop } = useDevice();
    const {isOpenCategoryMenu} = useSelector((state: RootState) => state.categorySlice);

    return (
        <>
            {/*{ this.visBlackout}*/}

            <div className={styles.header}>
                <div /*style={{zIndex: this.state.cancelingBlackoutZIndex}}*/ className={styles.navigateContainer}>


                    <div className={styles.navigations}>

                        <Logo className={styles.logo}/>

                       <Menu className={styles.menu} />
                        <SearchBar className={styles.search}/>

                        {isDesktop && (
                            <>
                                <Orders className={styles.orders}/>
                                <WishList className={styles.favourites}/>
                                <Cart className={styles.cart}/>
                                <Profile className={styles.profile}/>
                            </>
                        )}

                    </div>

                    <div className={styles.categoryContainer} style={{"display": isOpenCategoryMenu ? "block" : "none"}}>
                        <CategoryMenu/>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Header2;