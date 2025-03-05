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
    <section className="compliments-section">
      <div className="compliments-heading">
        <h3>What Our Customers Say</h3>
      </div>

      {/* Swiper Container */}
      <div className="swiper testimonial-swiper">
        <div className="swiper-wrapper">
          {/* Testimonial Items */}
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
              <div className="testimonial-card">
                <p>“{testimonial.text}”</p>
                <div className="testimonial-author">— {testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="swiper-pagination testimonial-swiper-pagination"></div>
      </div>
    </section>
  );
};

export default Compliments;
