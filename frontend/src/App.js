/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";
import Layout from "./components/Layout";
import DrawerOverlay from "./components/Drawer";
import { useDispatch, useSelector } from "react-redux";
import { setInitialImages } from "./store/slice/uiSlice";
import supabase from "./supabaseClient";

// Import pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import FitsPage from "./pages/FitsPage";
import CartPage from "./pages/CartPage";

const App = () => {
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const images = useSelector((state) => state.ui.images);

  useEffect(() => {
    const getSessionAndUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error.message);
        return;
      }

      if (session?.user) {
        setUserId(session.user.id);
      }

      // Listen for auth changes (like page refresh restoring session)
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUserId(session.user.id);
          }
        }
      );

      return () => {
        listener?.subscription?.unsubscribe();
      };
    };

    getSessionAndUser();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/generated-images`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const imageUrls = data.map((img) => img.inference_image_url).reverse();
        dispatch(setInitialImages(imageUrls));
        console.log(images);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };
    fetchImages();
  }, [userId, dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/product/:productName"
          element={
            <Layout>
              <ProductPage />
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <WishlistPage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
        <Route
          path="/fits"
          element={
            <Layout>
              <FitsPage />
            </Layout>
          }
        />
      </Routes>
      <DrawerOverlay />
    </Router>
  );
};

export default App;
