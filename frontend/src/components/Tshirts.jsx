import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer, updateImagesFromAPI } from "../store/slice/uiSlice";

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

const Tshirts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
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
    const fetchProducts = async () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const selectedGarments = JSON.parse(localStorage.getItem("selected_garment_url")) || [];
      
      const query = `
        {
          products(where: { category: "T-Shirt" }) {
            id
            name
            price
            category
            images {
              url
            }
          }
        }
      `;

      const response = await fetch(process.env.REACT_APP_HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();

      const updatedProducts = data.products.map((product) => ({
        ...product,
        wishlist: wishlist.includes(product.id),
        cart: cart.includes(product.id),
        addedToQueue: selectedGarments.includes(product.images?.[2]?.url),
      }));

      setProducts(updatedProducts);
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, wishlist: !product.wishlist } : product
      )
    );
  };

  const toggleCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.includes(productId)
      ? cart.filter((id) => id !== productId)
      : [...cart, productId];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, cart: !product.cart } : product
      )
    );
    
  };

  const handleTryTheFitClick = async (garmentId, garmentUrl) => {
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
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === garmentId ? { ...product, addedToQueue: true } : product
      );
      console.log("Updated products:", updatedProducts); // Debugging log
      return updatedProducts;
    });

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
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, // Assuming you use the same token
          },
          body: JSON.stringify(payload),
        }
      );

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
      <h4>T-Shirts</h4>
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
                isAddedToQueue={product.addedToQueue}
              />
              <button
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation(); // prevents navigation
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
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .product-item {
          text-align: center;
          position: relative;
        }

        .image-container {
          position: relative;
          display: inline-block;
        }

        .image-container img {
          width: 100%;
          border-radius: 10px;
        }

        .heart-button {
  position: absolute;
  top: 5px;          /* Reduced from 10px to position it higher */
  right: 5px;        /* Reduced from 10px to position it more to the right */
  background: none;
  border: none;
  font-size: 18px;   /* Reduced from 24px to make the icon smaller */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding: 0;        /* Remove any padding to make the clickable area match the icon size */
  line-height: 1;    /* Ensure consistent height */
  display: flex;     /* Helps with proper centering of the icon */
  align-items: center;
  justify-content: center;
}

        .heart-button:hover {
          transform: scale(1.1);
        }

        .outlined-heart {
          color: #777; 
        }
.button-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

        .filled-heart {
          color: red;
        }

        h3, p {
          margin: 5px 0;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          h3, p {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Tshirts;
