import React from "react";
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
      <section id="winter-comfort">
        <WinterComfort />
      </section>
      <section id="shirts">
        <Shirts />
      </section>
      <section id="tshirts">
        <Tshirts />
      </section>
      <Compliments />
      <section id="newArrivals">
        <NewArrivals/>
      </section>
      <section id="footer">
      <Newsletter />
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
