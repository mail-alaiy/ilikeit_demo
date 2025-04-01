import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination, Autoplay } from "swiper/modules";

const Compliments = () => {
  useEffect(() => {
    new Swiper(".testimonial-swiper", {
      modules: [Pagination, Autoplay],
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".testimonial-swiper-pagination", clickable: true },
    });
  }, []);

  return (
    <section className="container py-5">
      <div className="text-center mb-4">
        <h3 className="fw-bold">What Our Customers Say</h3>
      </div>

      {/* Swiper Container */}
      <div className="swiper testimonial-swiper d-flex justify-content-center align-items-center">
        <div className="swiper-wrapper">
          {[
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
          ].map((testimonial, index) => (
            <div key={index} className="swiper-slide">
              <div
                className="card text-center shadow-lg border-0 mx-2"
                style={{
                  width: "100%",
                  maxWidth: "22rem",
                  padding: "20px",
                  borderRadius: "15px",
                  height: "auto", // ensure height adjusts
                }}
              >
                <p className="fs-5 text-muted">“{testimonial.text}”</p>
                <div className="fw-bold text-primary">— {testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination (if needed) */}
      <div className="testimonial-swiper-pagination d-flex justify-content-center mt-3"></div>
    </section>
  );
};

export default Compliments;
