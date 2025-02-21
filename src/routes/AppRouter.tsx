import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home.tsx";
import UserProfile from "../pages/UserProfile/UserProfile.tsx";
import Cart from "../pages/Cart/Cart.tsx";
import Orders from "../pages/Orders/Orders.tsx";
import WishList from "../pages/WishList/WishList.tsx";
import ProtectedRoute from "./ProtectedRoute";
import {NotificationCenter} from "../components/NotificationCenter/NotificationCenter.tsx";
import MainLayout from "../layouts/Main/MainLayout.tsx";
import LoginModal from "../components/Auth/LoginModal.tsx";

const AppRouter = () => {
    return (
        <Router>
            <LoginModal/>
            <NotificationCenter/>
            <Routes>
                <Route path="/" element={<MainLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<WishList />} />

                    {/* Доступ к Orders только для авторизованных пользователей */}
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                </Route>


                {/* Если страница не найдена, редирект на Home */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </Router>
    );
};

export default AppRouter;
