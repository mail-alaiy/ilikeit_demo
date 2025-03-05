import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const NewArrivals = () => {
  return (
    <section id="new-arrival" className="new-arrival product-carousel py-5 position-relative">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Our New Arrivals</h4>
          <a href="index.html" className="btn-link">View All Products</a>
        </div>

        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          className="product-swiper"
        >
          {/* Product Slides */}
          <SwiperSlide>
            <div className="product-itemss">
              <img
                src="https://assets.ajio.com/medias/sys_master/root/20241223/U3HN/676926550f47f80c87197358/-473Wx593H-700966953-white-MODEL.jpg"
                alt="Graphic Hoodie"
                className="product-image"
              />
              <h5>Graphic Hoodie</h5>
              <span>$95.00</span>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="product-itemss">
              <img
                src="https://img.abercrombie.com/is/image/anf/KIC_122-4163-00282-906_prod1.jpg"
                alt="Half Zip Sweatshirt"
                className="product-image"
              />
              <h5>Essential Half Zip Sweatshirt</h5>
              <span>$55.00</span>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="product-itemss">
              <img
                src="https://img.abercrombie.com/is/image/anf/KIC_122-5293-00752-305_prod1.jpg?policy=product-large"
                alt="Cropped Essential Rugby Polo Sweatshirt"
                className="product-image"
              />
              <h5>Cropped Essential Rugby Polo Sweatshirt</h5>
              <span>$70.00</span>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="product-itemss">
              <img
                src="https://img.abercrombie.com/is/image/anf/KIC_120-5049-00371-200_prod1.jpg?policy=product-large"
                alt="Crochet-Style Diamond Button-Through Sweater Polo"
                className="product-image"
              />
              <h5>Crochet-Style Diamond Button-Through Sweater Polo</h5>
              <span>$50.00</span>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="product-itemss">
              <img
                src="https://img.abercrombie.com/is/image/anf/KIC_122-5163-00816-200_prod1.jpg?policy=product-large"
                alt="Golf Graphic Popover Hoodie"
                className="product-image"
              />
              <h5>Golf Graphic Popover Hoodie</h5>
              <span>$65.00</span>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default NewArrivals;
