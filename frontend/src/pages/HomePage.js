import React from 'react';
import Navbar from "../components/Navbar";
import Billboard from "../components/Billboard";
import Compliments from "../components/Compliments";
import Footer from "../components/Footer";
import NewArrivals from "../components/NewArrivals";
import Newsletter from "../components/Newsletter";
import Shirts from "../components/Shirts";
import Tshirts from "../components/Tshirts";
import WinterComfort from "../components/WinterComfort";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Billboard />
      <NewArrivals />
      <WinterComfort />
      <Compliments />
      <Shirts />
      <Tshirts />
      <Newsletter />
      <Footer />
    </>
  );
};

export default HomePage; 