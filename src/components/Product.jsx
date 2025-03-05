import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Product = ({ product }) => {
  return (
    <section className="container mt-5 p-4 bg-white shadow-lg rounded-3 border border-light">
      <div className="row g-4 align-items-center">
        {/* Left: Product Images */}
        <div className="col-md-6">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-3 overflow-hidden"
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="img-fluid rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* Right: Product Details */}
        <div className="col-md-6 text-center text-md-start">
          <h2 className="fw-bold text-dark mb-3">{product.name}</h2>
          <p className="text-muted mb-4">{product.description}</p>
          <span className="fs-4 fw-semibold text-primary mb-4 d-block">${product.price.toFixed(2)}</span>
          <button className="btn btn-lg" style={{ backgroundColor: "rgb(29, 53, 87)", color: "white" }}>Add to Cart</button>
        </div>
      </div>
    </section>
  );
};

export default Product;
