/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Billboard from "./components/Billboard";
import Compliments from "./components/Compliments";
import Footer from "./components/Footer";
import NewArrivals from "./components/NewArrivals";
import Newsletter from "./components/Newsletter";
import Shirts from "./components/Shirts";
import Tshirts from "./components/Tshirts";
import WinterComfort from "./components/WinterComfort";
import Login from "./components/Login";
import AddNameScreen from "./components/AddName";
import UploadPicturesScreen from "./components/UploadPictures";
import Product from "./components/Product";
import Wishlist from "./components/WishList";
import Layout from "./components/Layout";
import SelectedImage from "./components/SelectedImage";
/* Random changes */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes WITHOUT Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-name" element={<AddNameScreen />} />
        <Route path="/upload-pictures" element={<UploadPicturesScreen />} />
        <Route path="/selected-image" element={<SelectedImage />} />

        {/* Routes WITH Layout */}
        <Route
          path="/"
          element={
            <Layout>
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
            </Layout>
          }
        />
        <Route
          path="/product/:productName"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <Wishlist />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
