import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Overlay } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import {
  IoHeartOutline,
  IoHeart,
  IoCartOutline,
  IoCart,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoShareOutline,
  IoGridOutline,
} from "react-icons/io5";
import { X } from "react-bootstrap-icons";
import supabase from "../supabaseClient";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const themeColor = "#5a2d9c";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);

  const images = useSelector((state) => state.ui.images);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Failed to get user:", error?.message);
        onClose();
        return;
      }
      setUserId(user?.id);
    };
    getUser();
  }, [onClose]);

  useEffect(() => {
    const imageUrl = images[currentIndex];
    const generatedWishlist =
      JSON.parse(localStorage.getItem("generatedWishlist")) || [];
    const generatedCart =
      JSON.parse(localStorage.getItem("generatedCart")) || [];

    setIsWishlisted(generatedWishlist.includes(imageUrl));
    setIsCarted(generatedCart.includes(imageUrl));
  }, [currentIndex, images]);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const addToGeneratedWishlist = () => {
    const imageUrl = images[currentIndex];
    const wishlist =
      JSON.parse(localStorage.getItem("generatedWishlist")) || [];
    if (!wishlist.includes(imageUrl)) {
      wishlist.push(imageUrl);
      localStorage.setItem("generatedWishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  const addToGeneratedCart = () => {
    const imageUrl = images[currentIndex];
    const cart = JSON.parse(localStorage.getItem("generatedCart")) || [];
    if (!cart.includes(imageUrl)) {
      cart.push(imageUrl);
      localStorage.setItem("generatedCart", JSON.stringify(cart));
      setIsCarted(true);
    }
  };

  const shareImage = () => {
    const imageUrl = images[currentIndex];
    if (navigator.share) {
      navigator.share({ title: "Check this out", url: imageUrl });
    } else {
      navigator.clipboard.writeText(imageUrl).then(() => alert("Link copied"));
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      backdrop="static"
      keyboard
      className="border-0"
      style={{ maxWidth: '100%' }}
    >
      <Modal.Body
        style={{
          padding: "1rem",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#333",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        {/* Image + Arrows */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <ArrowButton onClick={handlePrev}>
            <IoChevronBackOutline size={20} />
          </ArrowButton>
          {images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "50vh", // Adjust maxHeight for better responsiveness
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div className="text-muted">No images</div>
          )}
          <ArrowButton onClick={handleNext}>
            <IoChevronForwardOutline size={20} />
          </ArrowButton>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-center gap-3 mt-2">
          <IconButton
            icon={isWishlisted ? <IoHeart /> : <IoHeartOutline />}
            onClick={addToGeneratedWishlist}
            color={isWishlisted ? themeColor : "#666"}
            tooltip="Add to Wishlist"
          />
          <IconButton
            icon={isCarted ? <IoCart /> : <IoCartOutline />}
            onClick={addToGeneratedCart}
            color={isCarted ? themeColor : "#666"}
            tooltip="Add to Cart"
          />
          <IconButton
            icon={<IoShareOutline />}
            onClick={shareImage}
            color="#666"
            tooltip="Share"
          />
          <IconButton
            icon={<IoGridOutline />}
            onClick={() => {
              onClose();
              navigate("/fits");
            }}
            color="#666"
            tooltip="View All"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

const IconButton = ({ icon, onClick, color, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleClick = () => {
    setShowTooltip(false);
    onClick();
  };

  return (
    <>
      <button
        ref={target}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: 40, // Slightly larger for mobile
          height: 40,
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#f5f5f5",
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s",
        }}
      >
        {icon}
      </button>

      <Overlay target={target.current} show={showTooltip} placement="top">
        {(props) => (
          <Tooltip id="button-tooltip" {...props}>
            {tooltip}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

const ArrowButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      border: "none",
      backgroundColor: "transparent",
      color: "#888",
      padding: 8,
      borderRadius: "50%",
      transition: "background-color 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
    onMouseLeave={(e) =>
      (e.currentTarget.style.backgroundColor = "transparent")
    }
  >
    {children}
  </button>
);

export default ImageSliderModal;
