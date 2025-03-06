import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation } from "react-router-dom";

const Product = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <h2 className="text-center text-danger mt-5">Product not found!</h2>;
  }

  return (
    <section className="container mt-4 p-4 bg-white shadow rounded-4 border border-light w-75" style={{ maxWidth: "900px" }}>
      <div className="row g-4 align-items-start">
        {/* Left: Product Images */}
        <div className="col-lg-6 col-md-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-4 overflow-hidden shadow-sm"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="img-fluid rounded-3 w-100"
                />
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
          
          <button className="btn btn-lg btn-primary w-100 rounded-pill shadow-sm" >Add to Cart</button>
          <button className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm">Wishlist</button>
        </div>
      </div>
    </section>
  );
};

export default Product;
