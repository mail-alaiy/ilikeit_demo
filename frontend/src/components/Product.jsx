import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Product = () => {
  const location = useLocation();
  const product = location.state?.product;

  const [liked, setLiked] = useState(() => {
    return JSON.parse(localStorage.getItem(`wishlist_${product?.id}`)) ?? product?.wishlist ?? false;
  });

  const toggleWishlist = async () => {
    const newWishlistStatus = !liked;
    setLiked(newWishlistStatus);

    localStorage.setItem(`wishlist_${product.id}`, JSON.stringify(newWishlistStatus));

    const mutation = `
      mutation {
        updateProduct(where: { id: "${product.id}" }, data: { wishlist: ${newWishlistStatus} }) {
          id
          wishlist
        }
        publishProduct(where: { id: "${product.id}" }) {
          id
        }
      }
    `;

    try {
      const response = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });

      const data = await response.json();
      console.log("Updated wishlist:", data);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setLiked(!newWishlistStatus); // Revert on failure
    }
  };

  if (!product) {
    return <h2 className="text-center text-danger mt-5">Product not found!</h2>;
  }

  return (
    <section className="container mt-4 p-4 bg-white shadow rounded-4 border border-light w-75" style={{ maxWidth: "900px" }}>
      <div className="row g-4 align-items-start">
        {/* Left: Product Images */}
        <div className="col-lg-6 col-md-12 position-relative">
          <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className="rounded-4 overflow-hidden shadow-sm">
            {product.images.map((image, index) => (
              <SwiperSlide key={index} className="position-relative">
                <img src={image.url} alt={`Product image ${index + 1}`} className="img-fluid rounded-3 w-100" />
                <button className="heart-button" onClick={toggleWishlist}>
                  {liked ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Product Details */}
        <div className="col-lg-6 col-md-12 text-center text-lg-start">
          <h5 className="fw-bold text-dark mb-3 text-uppercase">{product.name}</h5>
          <p className="text-muted mb-3">{product.description}</p>
          <span className="fs-3 fw-bold text-primary d-block mb-3">₹{product.price.toFixed(2)}</span>
          <p className="text-muted">Availability: <span className="fw-semibold text-success">In Stock</span></p>

          <button className="btn btn-lg btn-primary w-100 rounded-pill shadow-sm">Add to Cart</button>
          <button className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm" onClick={toggleWishlist}>
            {liked ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .heart-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
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
          /* Add this to your style section */
:root {
  --swiper-navigation-size: 20px !important; /* Smaller arrow size */
  --swiper-navigation-color: rgba(0, 0, 0, 0.5) !important;
}

.swiper-button-next,
.swiper-button-prev {
  padding: 15px !important;
  background-color: rgba(255, 255, 255, 0.7) !important;
  border-radius: 50% !important;
  width: 25px !important;
  height: 25px !important;
}
      `}</style>
    </section>
  );
};

export default Product;
