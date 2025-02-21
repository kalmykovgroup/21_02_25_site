import React, {useState, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {resetError} from "../../store/userSpace/authSlice.ts";

import styles from "./LoginModal.module.css";
import {setAuthModalOpen} from "../../store/uiSlice.ts";
import LoginContainer from "./LoginContainer/LoginContainer.tsx";

const LoginModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.uiSlice.authModalOpen);

    // Достаём из Redux нужные значения
    const customer = useAppSelector((state) => state.authSlice.customer);

    const [scrollbarWidth, setScrollbarWidth] = useState(0);


    useEffect(() => {
        if(customer != null){
            closeModal()
        }
    })

    const closeModal = () => {
        dispatch(resetError());  // Очистка ошибки в Auth
        dispatch(setAuthModalOpen(false)); // Закрытие модалки в UI

    };

    //Это нужно для корректного отображения
    useEffect(() => {
        const updateScrollbarWidth = () => {
            const width = window.innerWidth - document.documentElement.clientWidth;

            setScrollbarWidth(width);
        };

        if (isOpen) {
            updateScrollbarWidth();
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;

        } else {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        };
    }, [isOpen, scrollbarWidth]);


    if (!isOpen) return null;

    return (
        <>
            <div style={{width: scrollbarWidth}} className={styles.scrollbarPlaceholder}></div>

            <div className={styles.backdrop} onClick={closeModal}>
                <LoginContainer/>
            </div>

        </>

    );
};

export default LoginModal;

