
import ProductsContainer from "../../components/ProductsContainer/Container/ProductsContainer.tsx";
import Header from "../../components/Header/Header.tsx";
import Advertisement from "../../components/Header/Advertisement/Advertisement.tsx";
import React from "react";


const Home: React.FC = () => {

    return (
        <>

            <Advertisement />
            <Header/>
            <ProductsContainer/>
        </>
    );
};

export default Home;
