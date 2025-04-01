import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import TryTheFit from "./TrytheFit"; // Import the TryTheFit component
import supabase from "../supabaseClient";
import { useDispatch } from 'react-redux';
import { openDrawer } from "../store/slice/uiSlice";
import { updateImagesFromAPI } from "../store/slice/uiSlice";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error.message);
        return;
      }

      if (session?.user) {
        setUserId(session.user.id);
      }

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
    const fetchProducts = async () => {
      const query = `
        {
          products(where: { category: "NewArrivals" }) {
            id
            name
            price
            category
            images {
              url
            }
            wishlist
          }
        }
      `;

      const response = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();
      const updatedProducts = data.products.map((product) => ({
        ...product,
        wishlist: JSON.parse(localStorage.getItem(`wishlist_${product.id}`)) ?? product.wishlist ?? false,
      }));
      setProducts(updatedProducts);
    };

    fetchProducts();
  }, []);

  const toggleWishlist = async (productId, index) => {
    const updatedWishlist = !products[index].wishlist;

    setProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      newProducts[index].wishlist = updatedWishlist;
      return newProducts;
    });

    localStorage.setItem(`wishlist_${productId}`, JSON.stringify(updatedWishlist));

    const mutation = `
      mutation {
        updateProduct(where: { id: "${productId}" }, data: { wishlist: ${updatedWishlist} }) {
          id
          wishlist
        }
        publishProduct(where: { id: "${productId}" }) {
          id
        }
      }
    `;

    try {
      await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const toggleCart = async (productId, index) => {
    const updatedCart = !products[index].cart;

    setProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      newProducts[index].cart = updatedCart;
      return newProducts;
    });

    localStorage.setItem(`cart_${productId}`, JSON.stringify(updatedCart));

    // Call backend API to update cart (if necessary)
    const mutation = `
      mutation {
        updateProduct(where: { id: "${productId}" }, data: { cart: ${updatedCart} }) {
          id
          cart
        }
        publishProduct(where: { id: "${productId}" }) {
          id
        }
      }
    `;

    try {
      await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleTryTheFitClick = async (garmentId, garmentUrl) => {
    if (!userId) {
      console.warn("User ID not available.");
      dispatch(openDrawer());
      return;
    }

    const existingUrls = JSON.parse(localStorage.getItem("selected_garment_url")) || [];

    if (!existingUrls.includes(garmentUrl)) {
      existingUrls.push(garmentUrl);
      localStorage.setItem("selected_garment_url", JSON.stringify(existingUrls));
    }

    window.dispatchEvent(new Event("garmentUrlUpdated"));

    const payload = {
      user_id: userId,
      garment_id: garmentId,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/send-to-inference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send to inference");
      }

      const data = await response.json();
      console.log("Inference triggered successfully:", data);
      dispatch(updateImagesFromAPI([data.presigned_url]));
    } catch (error) {
      console.error("Error sending to inference:", error);
    }
  };

  return (
    <section id="new-arrival" className="new-arrival product-carousel py-5 position-relative">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Our New Arrivals</h4>
          <a href="index.html" className="btn-link">View All Products</a>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            576: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            }
          }}
          className="product-swiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div className="product-item" onClick={() => navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } })}>
                <div className="image-container">
                  <img 
                    src={product.images?.[0]?.url || "fallback-image.jpg"} 
                    alt={product.name} 
                    className="img-fluid" 
                  />
                  <button 
                    className="heart-button" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleWishlist(product.id, index); 
                    }}
                    aria-label={product.wishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {product.wishlist ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
                  </button>
                </div>
                <h5>{product.name}</h5>
                <span>₹{product.price}</span>
                <div className="button-column">
                  <TryTheFit
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the navigation
                      handleTryTheFitClick(product.id, product.images?.[2]?.url);
                    }}
                  />
                  <button className="add-to-cart" onClick={(e) => {
                  e.stopPropagation(); // prevents navigation
                  toggleCart(product.id, index);
                }}>
                  {product.cart ? "Remove from Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Styles */}
      <style>{`
        .product-item {
          text-align: center;
          position: relative;
          cursor: pointer;
        }

        .image-container {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .image-container img {
          width: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .heart-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
          z-index: 10;
          padding: 8px;
        }

        .heart-button:hover {
          transform: scale(1.1);
        }

        .outlined-heart {
          color: #777;
        }

        .filled-heart {
          color: red;
        }

        .button-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

      `}</style>
    </section>
  );
};

export default NewArrivals;
