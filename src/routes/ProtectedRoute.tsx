 
import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from "../hooks/hooks.ts";
import {setAuthModalOpen} from "../store/uiSlice.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { customer } = useAppSelector((state) => state.authSlice);
    const dispatch = useAppDispatch();
    
    // Если пользователь не авторизован, показываем LoginModal
    useEffect(() => {
        if (!customer) {
            dispatch(setAuthModalOpen(true));
        }
    }, [customer, dispatch]);

    return customer && (
        <>{children}</>
    );
};

export default ProtectedRoute;
