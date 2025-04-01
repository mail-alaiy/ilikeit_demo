import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from "../store/slice/uiSlice";
import { updateImagesFromAPI } from "../store/slice/uiSlice";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";

const HYGRAPH_API = process.env.REACT_APP_HYGRAPH_API;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const product = location.state?.product;
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const images = useSelector((state) => state.ui.images);

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error.message);
        return;
      }

      if (session?.user) {
        setUserId(session.user.id);
      }

      // Listen for auth changes (like page refresh restoring session)
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUserId(session.user.id);
          }
        }
      );

      return () => {
        listener?.subscription?.unsubscribe();
      };
    };

    getSessionAndUser();
  }, []);

  const [liked, setLiked] = useState(() => {
    return JSON.parse(localStorage.getItem(`wishlist_${product?.id}`)) ?? product?.wishlist ?? false;
  });

  const toggleWishlist = async () => {
    const newWishlistStatus = !liked;
    setLiked(newWishlistStatus);

    localStorage.setItem(`wishlist_${product.id}`, JSON.stringify(newWishlistStatus));

    const mutation = `
      mutation {
        updateProduct(where: { id: "${product.id}" }, data: { wishlist: ${newWishlistStatus} }) {
          id
          wishlist
        }
        publishProduct(where: { id: "${product.id}" }) {
          id
        }
      }
    `;

    try {
      const response = await fetch(HYGRAPH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ query: mutation }),
      });

      const data = await response.json();
      console.log("Updated wishlist:", data);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setLiked(!newWishlistStatus); // Revert on failure
    }
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
          <button
            className="btn-close position-absolute top-0 end-0 m-4"
            onClick={() => navigate(-1)} // This will navigate to the previous page
          ></button>
          <h5 className="fw-bold text-dark mb-3 text-uppercase">{product.name}</h5>
          <p className="text-muted mb-3">{product.description}</p>
          <span className="fs-3 fw-bold text-primary d-block mb-3">₹{product.price.toFixed(2)}</span>
          <p className="text-muted">Availability: <span className="fw-semibold text-success">In Stock</span></p>

          <button className="btn btn-lg btn-primary w-100 rounded-pill shadow-sm">Add to Cart</button>
          <button className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm" onClick={toggleWishlist}>
            {liked ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          <TryTheFit
            onClick={(e) => {
              e.stopPropagation(); // prevents navigation
              handleTryTheFitClick(product.id, product.images?.[2]?.url);
            }}
            className="btn btn-outline-dark w-100 mt-3 rounded-pill shadow-sm try-the-fit-button"
          />
        </div>
      </div>

      {/* Styles */}
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

        .swiper-button-next,
        .swiper-button-prev {
          padding: 15px !important;
          background-color: rgba(255, 255, 255, 0.7) !important;
          border-radius: 50% !important;
          width: 25px !important;
          height: 25px !important;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </section>
  );
};

export default Product;
