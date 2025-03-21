import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Tshirts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
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
            <button className="add-to-cart">Add to Cart</button>
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
