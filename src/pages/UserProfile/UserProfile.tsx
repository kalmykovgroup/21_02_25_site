import React from "react";
import {useAppDispatch} from "../../hooks/hooks.ts";
import {logoutThunk} from "../../store/userSpace/authSlice.ts";

const UserProfile: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <>


            <h1>Профиль</h1>
            <button onClick={() => dispatch(logoutThunk())}>Выйти</button>
        </>
    );
};

export default UserProfile;