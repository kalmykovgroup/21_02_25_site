import {Outlet} from "react-router-dom";

const MainLayout = () => {
    //const { isMobile, isTablet, isDesktop } = useDevice();

    return (
        <main>

            <Outlet /> {/* Здесь рендерятся дочерние маршруты */}
        </main>
    );
};

export default MainLayout;