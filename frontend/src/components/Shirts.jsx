import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer } from "../store/slice/uiSlice";
import { updateImagesFromAPI } from "../store/slice/uiSlice";

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

const Shirts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

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
      const selectedGarments =
        JSON.parse(localStorage.getItem("selected_garment_url")) || [];

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
        product.id === productId
          ? { ...product, wishlist: !product.wishlist }
          : product
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

    if (!existingUrls.includes(garmentUrl)) {
      existingUrls.push(garmentUrl);
      localStorage.setItem(
        "selected_garment_url",
        JSON.stringify(existingUrls)
      );
    }

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
        {products.map((product) => (
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
                  toggleWishlist(product.id);
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
                  e.stopPropagation();
                  handleTryTheFitClick(product.id, product.images?.[2]?.url);
                }}
                isAddedToQueue={product.addedToQueue}
              />
              <button
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCart(product.id);
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
  #new-arrivals {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  h4 {
    font-size: 2rem;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }

  .product-item {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    padding: 16px;
    cursor: pointer;
  }

  .product-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

 .image-container {
  width: 100%;
  height: 300px; /* Default height for desktop */
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 12px;
  position: relative;
}

@media (max-width: 768px) {
  .image-container {
    height: 250px; /* Smaller height for tablet and mobile */
  }
}

@media (max-width: 480px) {
  .image-container {
    height: 200px; /* Even smaller height for very small screens */
  }
}


  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 10px;
  }

  .heart-button {
  position: absolute;
  top: 10px; /* Adjust this value to get closer/further from the top */
  right: 10px; /* Adjust this value to get closer/further from the right */
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 2; /* Ensures it stays on top of the image */
}

  .heart-button:hover {
    transform: scale(1.1);
  }

  .outlined-heart {
    color: #999;
  }

  .filled-heart {
    color: #e60023;
  }

  .button-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .add-to-cart {
    padding: 10px;
    border: none;
    border-radius: 6px;
    background-color: #5a2d9c;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .add-to-cart:hover {
    background-color: #444;
  }

  h3 {
    font-size: 1.1rem;
    margin: 8px 0 4px;
    color: #333;
  }

  p {
    margin: 0;
    color: #111;
  }
`}</style>

    </section>
  );
};

export default Shirts;
