import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from "../store/slice/uiSlice";
import { updateImagesFromAPI } from "../store/slice/uiSlice";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

const Shirts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

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
          products(where: { category: "Shirt" }) {
            id
            name
            price
            category
            images {
              url
            }
            wishlist
            cart
          }
        }
      `;

      const response = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();

      const updatedProducts = data.products.map((product) => ({
        ...product,
        wishlist:
          JSON.parse(localStorage.getItem(`wishlist_${product.id}`)) ?? product.wishlist ?? false,
        cart:
          JSON.parse(localStorage.getItem(`cart_${product.id}`)) ?? product.cart ?? false,
      }));

      setProducts(updatedProducts);
    };

    fetchProducts();
  }, []);

  // Toggle Wishlist (already implemented in your code)
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
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  // Toggle Cart
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
      const response = await fetch(`${BACKEND_URL}/send-to-inference`, {
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
      dispatch(updateImagesFromAPI([data.presigned_url]));
    } catch (error) {
      console.error("Error sending to inference:", error);
    }
  };

  return (
    <section id="new-arrivals">
      <h4>Shirts</h4>
      <div className="product-grid">
        {products.map((product, index) => (
          <div
            className="product-item"
            key={product.id}
            onClick={() => navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } })}
          >
            <div className="image-container">
              <img src={product.images?.[0]?.url || "fallback-image.jpg"} alt={product.name} />
              <button
                className="heart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id, index);
                }}
              >
                {product.wishlist ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
              </button>
            </div>
            <h3>{product.name}</h3>
            <p>₹{product.price.toFixed(2)}</p>
            <div className="button-column">
              <TryTheFit
                onClick={(e) => {
                  e.stopPropagation();
                  handleTryTheFitClick(product.id, product.images?.[2]?.url);
                }}
              />
              <button
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCart(product.id, index);
                }}
              >
                {product.cart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .product-item {
          text-align: center;
          position: relative;
        }

        .image-container {
          position: relative;
          display: inline-block;
        }

        .button-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .image-container img {
          width: 100%;
          border-radius: 10px;
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
      `}</style>
    </section>
  );
};

export default Shirts;
