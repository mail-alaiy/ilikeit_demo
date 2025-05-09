import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const Compliments = () => {
  const testimonials = [
    {
      text: "These cotton T-shirts are incredibly comfortable and fit just right. They don’t shrink after washing and feel super soft!",
      author: "Perfect Fit",
    },
    {
      text: "This dress shirt is a must-have for work. The material is breathable, and the fit is tailored but not too tight.",
      author: "Office Classic",
    },
    {
      text: "I bought this formal suit for a wedding, and the quality exceeded my expectations. It’s stylish, comfortable, and well-stitched.",
      author: "Dapper Look",
    },
    {
      text: "This winter jacket is warm yet lightweight. It keeps me cozy in freezing temperatures without feeling bulky!",
      author: "Winter Essential",
    },
  ];

  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <h5 style={{color:"#5a2d9c"}}>What Our Customers Say</h5>
        <p className="text-muted">Genuine reviews from happy customers</p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".swiper-pagination" }}
        centeredSlides={true}
        grabCursor={true}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2.2 },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div
              className="card mx-auto p-4 shadow-sm border-0"
              style={{
                borderRadius: "20px",
                background: "#fefefe",
                width: "90%",
                maxWidth: "480px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p className="text-muted fs-6 mb-3" style={{ fontStyle: "italic" }}>
                “{testimonial.text}”
                <div className="text-end fw-semibold text-primary">— {testimonial.author}</div>
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Pagination Styling */}
      <div
        className="swiper-pagination"
        style={{
          marginTop: "20px", // Move the dots down
        }}
      ></div>
    </section>
  );
};

export default Compliments;
