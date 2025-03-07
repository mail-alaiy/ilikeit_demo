import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <section id="new-arrival" className="new-arrival product-carousel py-5 position-relative">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Our New Arrivals</h4>
          <a href="index.html" className="btn-link">View All Products</a>
        </div>

        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          className="product-swiper"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div className="product-item" onClick={() => navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } })}>
                <div className="image-container">
                  <img src={product.images?.[0]?.url || "fallback-image.jpg"} alt={product.name} />
                  <button className="heart-button" onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id, index); }}>
                    {product.wishlist ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
                  </button>
                </div>
                <h5>{product.name}</h5>
                <span>₹{product.price}</span>
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
        }

        .image-container {
          position: relative;
          display: inline-block;
        }

        .product-image {
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

export default NewArrivals;
