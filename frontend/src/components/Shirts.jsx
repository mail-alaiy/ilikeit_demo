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
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL

const Shirts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const images = useSelector((state) => state.ui.images);

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
  

  console.log(userId, "userId");

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

      // Sync wishlist state with localStorage
      const updatedProducts = data.products.map((product) => ({
        ...product,
        wishlist:
          JSON.parse(localStorage.getItem(`wishlist_${product.id}`)) ??
          product.wishlist ??
          false,
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

    localStorage.setItem(
      `wishlist_${productId}`,
      JSON.stringify(updatedWishlist)
    );

    // Update backend
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

  const handleTryTheFitClick = async (garmentId, garmentUrl) => {
    console.log(userId);
    if (!userId) {
      console.warn("User ID not available.");
      dispatch(openDrawer());
      return;
    }

    const existingUrls =
      JSON.parse(localStorage.getItem("selected_garment_url")) || [];

    // Add new URL if not already present
    if (!existingUrls.includes(garmentUrl)) {
      existingUrls.push(garmentUrl);
      localStorage.setItem(
        "selected_garment_url",
        JSON.stringify(existingUrls)
      );
    }

    // Dispatch custom event
    window.dispatchEvent(new Event("garmentUrlUpdated"));

    const payload = {
      user_id: userId,
      garment_id: garmentId,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/send-to-inference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
              throw new Error("Failed to send to inference");
            }
          
            const data = await response.json();
            console.log("Inference triggered successfully:", data);
            dispatch(updateImagesFromAPI([data.presigned_url
            ]));
            console.log(images,"Images");
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
            onClick={() =>
              navigate(`/product/${encodeURIComponent(product.name)}`, {
                state: { product },
              })
            }
          >
            <div className="image-container">
              <img
                src={product.images?.[0]?.url || "fallback-image.jpg"}
                alt={product.name}
              />
              <button
                className="heart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id, index);
                }}
              >
                {product.wishlist ? (
                  <FaHeart className="filled-heart" />
                ) : (
                  <FaRegHeart className="outlined-heart" />
                )}
              </button>
            </div>
            <h3>{product.name}</h3>
            <p>₹{product.price.toFixed(2)}</p>
            <div className="button-column">
              <TryTheFit
                onClick={(e) => {
                  e.stopPropagation(); // prevents navigation
                  handleTryTheFitClick(product.id, product.images?.[2]?.url);
                }}
              />
              <button className="add-to-cart">Add to Cart</button>
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
