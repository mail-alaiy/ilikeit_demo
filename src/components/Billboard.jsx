import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();


const Billboard = () => {
  return (
    <section id="billboard" className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <h1 className="section-title text-center mt-4 font-bold" data-aos="fade-up">Featured Categories</h1>
          <div className="col-md-6 text-center" data-aos="fade-up" data-aos-delay="300">
            <p>Explore our curated collection of stylish and comfortable clothing</p>
          </div>
        </div>
        <div className="row">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            className="main-swiper py-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <SwiperSlide>
              <div className="banner-item image-zoom-effect">
                <div className="image-holder">
                  <a href="#">
                    <img src="https://img.abercrombie.com/is/image/anf/KIC_122-5371-00840-200_model1.jpg?policy=product-large" alt="Women's Long Coat" className="img-fluid"/>
                  </a>
                </div>
                <div className="banner-content py-4">
                  <h5 className="element-title text-uppercase">
                    <a href="#" className="item-anchor">Winter Wear</a>
                  </h5>
                  <p>Stay warm and stylish with our premium collection of cozy wear for the chilly season.</p>
                  <div className="btn-left">
                    <a href="#" className="btn-link fs-6 text-uppercase item-anchor text-decoration-none">Shop Now</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="banner-item image-zoom-effect">
                <div className="image-holder">
                  <a href="#">
                    <img src="https://img.abercrombie.com/is/image/anf/KIC_125-5475-00227-301_model1.jpg?policy=product-large" alt="Men's Long Coat" className="img-fluid"/>
                  </a>
                </div>
                <div className="banner-content py-4">
                  <h5 className="element-title text-uppercase">
                    <a href="#" className="item-anchor">Shirts</a>
                  </h5>
                  <p>Elevate your wardrobe with our collection of trendy and comfortable shirts for every occasion.</p>
                  <div className="btn-left">
                    <a href="#" className="btn-link fs-6 text-uppercase item-anchor text-decoration-none">Shop Now</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="banner-item image-zoom-effect">
                <div className="image-holder">
                  <a href="#">
                    <img src="https://img.abercrombie.com/is/image/anf/KIC_124-5294-00481-200_model1.jpg?policy=product-large" alt="Women's Sweat" className="img-fluid"/>
                  </a>
                </div>
                <div className="banner-content py-4">
                  <h5 className="element-title text-uppercase">
                    <a href="#" className="item-anchor">T-Shirts</a>
                  </h5>
                  <p>Casual yet stylish, our t-shirts offer the perfect blend of comfort and fashion</p>
                  <div className="btn-left">
                    <a href="#" className="btn-link fs-6 text-uppercase item-anchor text-decoration-none">Shop Now</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="banner-item image-zoom-effect">
                <div className="image-holder">
                  <a href="#">
                    <img src="https://img.abercrombie.com/is/image/anf/KIC_132-4097-00145-208_model1.jpg?policy=product-large" alt="Men's Jacket" className="img-fluid"/>
                  </a>
                </div>
                <div className="banner-content py-4">
                  <h5 className="element-title text-uppercase">
                    <a href="#" className="item-anchor">Jackets</a>
                  </h5>
                  <p>Explore our range of versatile jackets designed to keep you warm and fashionable.</p>
                  <div className="btn-left">
                    <a href="#" className="btn-link fs-6 text-uppercase item-anchor text-decoration-none">Shop Now</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="banner-item image-zoom-effect">
                <div className="image-holder">
                  <a href="#">
                    <img src="https://img.abercrombie.com/is/image/anf/KIC_132-5022-00093-212_model3.jpg?policy=product-large" alt="Formal Wear" className="img-fluid"/>
                  </a>
                </div>
                <div className="banner-content py-4">
                  <h5 className="element-title text-uppercase">
                    <a href="#" className="item-anchor">Formal Wear</a>
                  </h5>
                  <p>Dress to impress with our sophisticated formal wear, tailored for elegance and comfort.</p>
                  <div className="btn-left">
                    <a href="#" className="btn-link fs-6 text-uppercase item-anchor text-decoration-none">Shop Now</a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default Billboard;