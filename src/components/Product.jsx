import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Product = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [liked, setLiked] = useState(false); // Track heart state

  if (!product) {
    return <h2 className="text-center text-danger mt-5">Product not found!</h2>;
  }

  return (
    <section className="container mt-4 p-4 bg-white shadow rounded-4 border border-light w-75" style={{ maxWidth: "900px" }}>
      <div className="row g-4 align-items-start">
        {/* Left: Product Images */}
        <div className="col-lg-6 col-md-12 position-relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-4 overflow-hidden shadow-sm"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index} className="position-relative">
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="img-fluid rounded-3 w-100"
                />
                {/* Heart Icon for Wishlist */}
                <button
                  className="heart-button"
                  onClick={() => setLiked(!liked)}
                >
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

          {/* Additional Product Info */}
          <p className="text-muted">Availability: <span className="fw-semibold text-success">In Stock</span></p>

          {/* Quantity Selector */}
          <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-4">
            <label className="me-2 fw-semibold">Quantity:</label>
            <input type="number" min="1" defaultValue="1" className="form-control w-25 text-center" />
          </div>

          <button className="btn btn-lg btn-primary w-100 rounded-pill shadow-sm">Add to Cart</button>
          <button className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm">Wishlist</button>
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
      `}</style>
    </section>
  );
};

export default Product;
