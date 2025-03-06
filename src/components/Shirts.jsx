import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Shirts = () => {
  const [liked, setLiked] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `
        {
          products(where: { category: "Shirt" }) {
            name
            price
            category
            images {
              url
            }
          }
        }
      `;

      const response = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();
      setProducts(data.products || []);
    };

    fetchProducts();
  }, []);

  const toggleLike = (index) => {
    setLiked((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="new-arrivals">
      <h4>Shirts</h4>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-item" key={index}>
            <div className="image-container">
              <img src={product.images?.[0]?.url || "fallback-image.jpg"} alt={product.name} />
              <button className="heart-button" onClick={() => toggleLike(index)}>
                {liked[index] ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
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