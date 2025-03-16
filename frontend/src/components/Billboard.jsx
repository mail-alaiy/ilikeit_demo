import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Billboard = () => {

  const categories = [
    {
      img: "https://img.abercrombie.com/is/image/anf/KIC_122-5371-00840-200_model1.jpg?policy=product-large",
      name: "Winter Wear",
      description: "Stay warm and stylish with our premium collection of cozy wear for the chilly season.",
    },
    {
      img: "https://img.abercrombie.com/is/image/anf/KIC_125-5475-00227-301_model1.jpg?policy=product-large",
      name: "Shirts",
      description: "Elevate your wardrobe with our collection of trendy and comfortable shirts for every occasion.",
    },
    {
      img: "https://img.abercrombie.com/is/image/anf/KIC_124-5294-00481-200_model1.jpg?policy=product-large",
      name: "T-Shirts",
      description: "Casual yet stylish, our t-shirts offer the perfect blend of comfort and fashion.",
    },
    {
      img: "https://img.abercrombie.com/is/image/anf/KIC_132-4097-00145-208_model1.jpg?policy=product-large",
      name: "Jackets",
      description: "Explore our range of versatile jackets designed to keep you warm and fashionable.",
    },
    {
      img: "https://img.abercrombie.com/is/image/anf/KIC_132-5022-00093-212_model3.jpg?policy=product-large",
      name: "Formal Wear",
      description: "Dress to impress with our sophisticated formal wear, tailored for elegance and comfort.",
    },
  ];

  return (
    <section id="billboard" className="bg-light py-5">
      <div className="container">
        <h1 className="section-title text-center mt-4 font-bold">Featured Categories</h1>
        <p className="text-center">Explore our curated collection of stylish and comfortable clothing</p>

        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true}}
          className="main-swiper py-4"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="banner-item">
                <div className="image-container">
                  <img src={category.img} alt={category.name} className="img-fluid" />
                </div>
                <div className="banner-content py-4 text-center">
                  <h5 className="element-title text-uppercase">{category.name}</h5>
                  <p>{category.description}</p>
                  <a href="#" className="btn-link fs-6 text-uppercase text-decoration-none">Shop Now</a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .image-container {
          position: relative;
        }
        .heart-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .outlined-heart {
          color: #777;
        }
        .filled-heart {
          color: red;
        }
        .swiper-pagination {
  display: none !important;
}

      `}</style>
    </section>
  );
};

export default Billboard;