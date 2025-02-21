import React from "react";

import styles from "./Profile.module.css"
import {Link} from "react-router-dom";
import common from "../Common.module.css";
import profileIcon from "../../../assets/images/profile.svg";
import {setAuthModalOpen} from "../../../store/uiSlice.ts";
import {useAppDispatch, useAppSelector} from "../../../hooks/hooks.ts";

interface ProfileProps {
    className?: string
}

const Profile: React.FC<ProfileProps> = ({className}: ProfileProps) => {
    const dispatch = useAppDispatch();
    const customer = useAppSelector((state) => state.authSlice.customer);

    return <>
        {customer != null ? (

            <Link className={`${className} ${styles.profile} ${common.header_right_item}`} to={`/profile`}>
                <img src={profileIcon} className={styles.profileIcon} alt="profile"/>
                <span className={styles.label}>Аккаунт</span>
            </Link>
        ) : (
            <div className={styles.btnContainer}>
                <button onClick={() => dispatch(setAuthModalOpen(true))}>Войти</button>
            </div>
        )}
    </>
}

export default Profile;