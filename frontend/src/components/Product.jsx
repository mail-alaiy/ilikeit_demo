import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer, updateImagesFromAPI } from "../store/slice/uiSlice";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const images = useSelector((state) => state.ui.images);
  const [product, setProduct] = useState(location.state?.product);
  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedGarments =
      JSON.parse(localStorage.getItem("selected_garment_url")) || [];

    setProduct((prevProduct) => ({
      ...prevProduct,
      wishlist: wishlist.includes(prevProduct.id),
      cart: cart.includes(prevProduct.id),
      addedToQueue: selectedGarments.includes(prevProduct.images?.[2]?.url),
    }));
    setLiked(wishlist.includes(product.id));
  }, [product]);

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to get session:", error.message);
        return;
      }

      if (session?.user) setUserId(session.user.id);

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) setUserId(session.user.id);
        }
      );

      return () => {
        listener?.subscription?.unsubscribe();
      };
    };

    getSessionAndUser();
  }, []);

  const toggleWishlist = () => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = liked
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setLiked(!liked);
    setProduct((prevProduct) => ({
      ...prevProduct,
      wishlist: !prevProduct.wishlist,
    }));
  };

  const toggleCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = product.cart
      ? cart.filter((id) => id !== product.id)
      : [...cart, product.id];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setProduct((prevProduct) => ({
      ...prevProduct,
      cart: !prevProduct.cart,
    }));
  };
  const handleTryTheFitClick = async (garmentId, garmentUrl) => {
    if (!userId) {
      console.warn("User ID not available.");
      dispatch(openDrawer());
      return;
    }

    const existingUrls =
      JSON.parse(localStorage.getItem("selected_garment_url")) || [];

    // Add new URL if not already present
    if (!existingUrls.includes(garmentUrl)) {
      existingUrls.push(garmentUrl);
      localStorage.setItem(
        "selected_garment_url",
        JSON.stringify(existingUrls)
      );
    }

    // Dispatch custom event
    window.dispatchEvent(new Event("garmentUrlUpdated"));
    setProduct((prevProduct) => ({
      ...prevProduct,
      addedToQueue: true,
    }));

    const payload = {
      user_id: userId,
      garment_id: garmentId,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/send-to-inference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send to inference");
      }

      const data = await response.json();
      console.log("Inference triggered successfully:", data);
      dispatch(updateImagesFromAPI([data.presigned_url]));
      console.log(images, "Images");
    } catch (error) {
      console.error("Error sending to inference:", error);
    }
  };


  if (!product) {
    return <h2 className="text-center text-danger mt-5">Product not found!</h2>;
  }

  return (
    <section className="container mt-4 p-4 bg-white shadow rounded-4 border border-light w-75" style={{ maxWidth: "900px" }}>
      <div className="row g-4 align-items-start">
        {/* Left: Product Images */}
        <div className="col-lg-6 col-md-12 position-relative">
          <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className="rounded-4 overflow-hidden shadow-sm">
            {product.images.map((image, index) => (
              <SwiperSlide key={index} className="position-relative">
                <img src={image.url} alt={`Product image ${index + 1}`} className="img-fluid rounded-3 w-100" />
                <button className="heart-button" onClick={toggleWishlist}>
                  {liked ? <FaHeart className="filled-heart" /> : <FaRegHeart className="outlined-heart" />}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Product Details */}
        <div className="col-lg-6 col-md-12 text-center text-lg-start">
          <button className="btn-close position-absolute top-0 end-0 m-4" onClick={() => navigate(-1)}></button>
          <h5 className="fw-bold text-dark mb-3 text-uppercase">{product.name}</h5>
          <span className="fs-3 fw-bold text-primary d-block mb-3">₹{product.price.toFixed(2)}</span>
          <p className="text-muted">Availability: <span className="fw-semibold text-success">In Stock</span></p>

          <button className="btn btn-primary w-100 rounded-pill shadow-sm" onClick={toggleCart} style={{backgroundColor:"#5a2d9c"}}>
            {product.cart ? "Remove from Cart" : "Add to Cart"}
          </button>
          <button className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm" onClick={toggleWishlist} style={{padding:"2px"}}>
            {liked ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          <TryTheFit
            onClick={(e) => {
              e.stopPropagation(); // prevents navigation
              handleTryTheFitClick(product.id, product.images?.[2]?.url);
            }}
            isAddedToQueue={product.addedToQueue}
            className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm try-the-fit-button"
          />
        </div>
      </div>

      <style>{`
      .try-the-fit-button {
          background-color: #f8f9fa;
          color: #333;
          border: 2px solid #6c757d;
          padding: 12px 18px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 1px;
          width: 100%;
          border-radius: 50px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .try-the-fit-button:hover {
          background-color: #6c757d;
          color: white;
          transform: scale(1.05);
        }

        .try-the-fit-button:focus {
          outline: none;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .heart-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        .heart-button:hover {
          transform: scale(1.1);
        }
        .outlined-heart {
          color: #777; 
        }
        .filled-heart {
          color: red;
        }
        :root {
          --swiper-navigation-size: 20px !important;
          --swiper-navigation-color: rgba(0, 0, 0, 0.5) !important;
        }
        .swiper-button-next, .swiper-button-prev {
          padding: 15px !important;
          background-color: rgba(255, 255, 255, 0.7) !important;
          border-radius: 50% !important;
          width: 25px !important;
          height: 25px !important;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </section>
  );
};

export default Product;
