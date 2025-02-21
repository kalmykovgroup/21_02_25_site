import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {useEffect} from "react";
import { syncLocalWishListToServer} from "../../store/productSpace/wishListSlice.ts";

const WishList: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { wishList, isLoading} = useSelector((state: RootState) => state.wishListSlice);

    useEffect(() => {
        if(wishList.length == 0){
            dispatch(syncLocalWishListToServer());
        }
    }, [dispatch, wishList.length]);

    if (isLoading) return <p>Загрузка избранного...</p>;

    return (
        <div>
            <h2>Избранные товары</h2>
            <ul>
                {wishList.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default WishList;