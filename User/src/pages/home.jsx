import React from 'react';

import Slider from '../components/slider'

import CarSearch from "../components/car-search"
import CarOffers from '../components/car-offers';


const Home = () => {

    return (
        <div id="homepage">
            <Slider/>
           
            <CarSearch/>
            <CarOffers/>
      
         
           
        </div>
    );
};
export default Home;