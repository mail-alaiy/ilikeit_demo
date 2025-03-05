import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay } from "swiper/modules";

const Compliments = () => {
  useEffect(() => {
    new Swiper(".testimonial-swiper", {
      modules: [Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".testimonial-swiper-pagination", clickable: true },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1440: { slidesPerView: 3 },
      },
    });
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="text-center mb-5">
        <h3 className="display-6 text-dark">What Our Customers Say</h3>
      </div>

      {/* Swiper Container */}
      <div className="swiper testimonial-swiper overflow-hidden mt-4 px-3">
        <div className="swiper-wrapper d-flex">
          {/* Testimonial Items */}
          {[{
            text: "These cotton T-shirts are incredibly comfortable and fit just right. They don’t shrink after washing and feel super soft!",
            author: "Perfect Fit"
          }, {
            text: "This dress shirt is a must-have for work. The material is breathable, and the fit is tailored but not too tight.",
            author: "Office Classic"
          }, {
            text: "I bought this formal suit for a wedding, and the quality exceeded my expectations. It’s stylish, comfortable, and well-stitched.",
            author: "Dapper Look"
          }, {
            text: "This winter jacket is warm yet lightweight. It keeps me cozy in freezing temperatures without feeling bulky!",
            author: "Winter Essential"
          }].map((testimonial, index) => (
            <div key={index} className="swiper-slide">
              <div className="bg-white p-4 shadow-lg rounded text-center mx-auto d-flex flex-column align-items-center justify-content-center" style={{ width: '24rem', height: '15rem' }}>
                <p className="fs-5 text-muted">“{testimonial.text}”</p>
                <div className="mt-3 fw-bold text-primary">— {testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Compliments;
