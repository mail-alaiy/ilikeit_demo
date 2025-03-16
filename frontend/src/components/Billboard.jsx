import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
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
    <section id="billboard" className="bg-light py-3 py-md-5">
      <div className="container px-3">
        <h1 className="section-title text-center mt-3 mt-md-4 font-bold text-xl md:text-2xl">Featured Categories</h1>
        <p className="text-center text-sm md:text-base mb-4">Explore our curated collection of stylish and comfortable clothing</p>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            576: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            }
          }}
          navigation
          pagination={{ clickable: true }}
          className="main-swiper py-2 py-md-4"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="banner-item rounded shadow-sm overflow-hidden h-full">
                <div className="image-container">
                  <img 
                    src={category.img} 
                    alt={category.name} 
                    className="img-fluid w-full h-auto object-cover aspect-ratio-1"
                  />
                </div>
                <div className="banner-content p-3 p-md-4 text-center">
                  <h5 className="element-title text-uppercase font-bold mb-2">{category.name}</h5>
                  <p className="text-sm md:text-base text-gray-600 mb-3">{category.description}</p>
                  <a href="#" className="btn-link text-sm md:text-base text-uppercase text-decoration-none font-semibold hover:text-primary transition-colors">Shop Now</a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .image-container {
          position: relative;
          overflow: hidden;
        }
        .image-container img {
          transition: transform 0.3s ease;
          width: 100%;
          height: auto;
          display: block;
        }
        .banner-item:hover .image-container img {
          transform: scale(1.05);
        }
        .banner-content {
          background: white;
        }
        .banner-item {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: white;
          transition: box-shadow 0.3s ease;
        }
        .banner-item:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .btn-link {
          color: #333;
          position: relative;
          padding-bottom: 2px;
        }
        .btn-link:after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        .btn-link:hover:after {
          width: 100%;
        }
        
        /* Enhanced navigation arrows for all devices */
        .swiper-button-next,
        .swiper-button-prev {
          display: flex !important;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px !important;
          color: #333;
          font-weight: bold;
        }
        
        /* Mobile-specific navigation adjustments */
        @media (max-width: 767px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 30px;
            height: 30px;
          }
          
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 14px !important;
          }
          
          .swiper-pagination {
            display: block !important;
            margin-top: 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default Billboard;