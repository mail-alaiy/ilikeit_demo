import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  IoCloseOutline,
  IoHeartOutline,
  IoCartOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoShareOutline,
} from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";
import { useSelector } from "react-redux";
import { IoGridOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const images = useSelector((state) => state.ui.images);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to get user:", error.message);
        onClose();
        return;
      }

      if (!user) {
        onClose();
        return;
      }

      setUserId(user?.id);
    };

    getUser();
  }, [onClose]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const addToGeneratedWishlist = () => {
    const generatedWishlist = JSON.parse(localStorage.getItem("generatedWishlist")) || [];
    const imageUrl = images[currentIndex];
    if (!generatedWishlist.includes(imageUrl)) {
      generatedWishlist.push(imageUrl);
      localStorage.setItem("generatedWishlist", JSON.stringify(generatedWishlist));
    }
  };

  const addToGeneratedCart = () => {
    const generatedCart = JSON.parse(localStorage.getItem("generatedCart")) || [];
    const imageUrl = images[currentIndex];
    if (!generatedCart.includes(imageUrl)) {
      generatedCart.push(imageUrl);
      localStorage.setItem("generatedCart", JSON.stringify(generatedCart));
    }
  };

  const shareImage = () => {
    const imageUrl = images[currentIndex];
    if (navigator.share) {
      navigator.share({
        title: "Check out this image",
        url: imageUrl,
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(imageUrl).then(() => {
        alert("Image link copied to clipboard!");
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      backdrop="static"
      keyboard={true}
      className="image-slider-modal"
    >
      <Modal.Body
        className="bg-white position-relative d-flex flex-column align-items-center justify-content-center"
        style={{
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close Button (Top Right) */}
        <Button
          variant="light"
          onClick={onClose}
          className="position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "36px",
            height: "36px",
            color: "#000",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <IoCloseOutline size={20} />
        </Button>

        {/* Left Arrow */}
        <div className="position-absolute top-50 start-0 translate-middle-y" style={{ zIndex: 2 }}>
          <ArrowButton onClick={handlePrev}>
            <IoChevronBackOutline size={24} />
          </ArrowButton>
        </div>

        {/* Image */}
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            onLoad={handleImageLoad}
            style={{
              maxHeight: "70vh",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "1rem",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          />
        ) : (
          <div className="my-5 text-muted">Start trying on images</div>
        )}

        {/* Right Arrow */}
        <div className="position-absolute top-50 end-0 translate-middle-y" style={{ zIndex: 2 }}>
          <ArrowButton onClick={handleNext}>
            <IoChevronForwardOutline size={24} />
          </ArrowButton>
        </div>

        {/* Bottom Buttons */}
        <div className="d-flex justify-content-around gap-3 mt-4">
          <IconButton icon={<IoHeartOutline />} color="#e91e63" onClick={addToGeneratedWishlist} />
          <IconButton icon={<IoCartOutline />} color="#0d6efd" onClick={addToGeneratedCart} />
          <IconButton icon={<IoShareOutline />} color="#ff9800" onClick={shareImage} />
          <IconButton icon={<IoGridOutline />} color="#6c757d" onClick={() => { onClose(); navigate("/fits"); }} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

const IconButton = ({ icon, color, onClick }) => (
  <Button
    variant="light"
    onClick={onClick}
    className="rounded-circle d-flex align-items-center justify-content-center"
    style={{
      width: "52px",
      height: "52px",
      color,
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease-in-out",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    {icon}
  </Button>
);

// Arrow Button
const ArrowButton = ({ onClick, children }) => (
  <Button
    variant="light"
    onClick={onClick}
    className="rounded-circle d-flex align-items-center justify-content-center"
    style={{
      width: "44px",
      height: "44px",
      color: "#000",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease-in-out",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    {children}
  </Button>
);

export default ImageSliderModal;
