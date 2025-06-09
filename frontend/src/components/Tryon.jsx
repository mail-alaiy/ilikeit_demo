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
    >
      <div
        style={{
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
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
            top: 6,
            right: 6,
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <X size={18} />
        </button>

        {/* Image + Arrows */}
        {/* Image with overlaid arrows */}
<div
  style={{
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
  }}
>
  {images.length > 0 ? (
    <>
      <img
        src={images[currentIndex]}
        alt="preview"
        style={{
          maxWidth: "100%",
          maxHeight: "50vh",
          objectFit: "contain",
          borderRadius: "8px",
        }}
      />
      {/* Left Arrow */}
      <ArrowButton
        onClick={handlePrev}
        style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <IoChevronBackOutline size={20} />
      </ArrowButton>

      {/* Right Arrow */}
      <ArrowButton
        onClick={handleNext}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <IoChevronForwardOutline size={20} />
      </ArrowButton>
    </>
  ) : (
    <div className="text-muted">No images</div>
  )}
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
      </div>
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

const ArrowButton = ({ onClick, children, style }) => (
  <button
    onClick={onClick}
    style={{
      border: "none",
      color: "#888",
      padding: 2,
      borderRadius: "50%",
      backgroundColor: "transparent",
      transition: "background-color 0.2s",
      ...style,
    }}
  >
    {children}
  </button>
);

export default ImageSliderModal;
