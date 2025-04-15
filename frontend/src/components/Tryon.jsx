import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  IoCloseOutline,
  IoHeartOutline,
  IoHeart,
  IoCartOutline,
  IoCart,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoShareOutline,
  IoGridOutline,
} from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);

  const images = useSelector((state) => {
    return state.ui.images;
  });

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

  useEffect(() => {
    const imageUrl = images[currentIndex];
    const generatedWishlist =
      JSON.parse(localStorage.getItem("generatedWishlist")) || [];
    const generatedCart =
      JSON.parse(localStorage.getItem("generatedCart")) || [];

    setIsWishlisted(generatedWishlist.includes(imageUrl));
    setIsCarted(generatedCart.includes(imageUrl));
  }, [currentIndex, images]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const addToGeneratedWishlist = () => {
    const imageUrl = images[currentIndex];
    const generatedWishlist =
      JSON.parse(localStorage.getItem("generatedWishlist")) || [];

    if (!generatedWishlist.includes(imageUrl)) {
      generatedWishlist.push(imageUrl);
      localStorage.setItem(
        "generatedWishlist",
        JSON.stringify(generatedWishlist)
      );
      setIsWishlisted(true);
    }
  };

  const addToGeneratedCart = () => {
    const imageUrl = images[currentIndex];
    const generatedCart =
      JSON.parse(localStorage.getItem("generatedCart")) || [];

    if (!generatedCart.includes(imageUrl)) {
      generatedCart.push(imageUrl);
      localStorage.setItem("generatedCart", JSON.stringify(generatedCart));
      setIsCarted(true);
    }
  };

  const shareImage = () => {
    const imageUrl = images[currentIndex];
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this image",
          url: imageUrl,
        })
        .catch((error) => console.error("Error sharing:", error));
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
        {/* Close Button */}
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
        <div
          className="position-absolute top-50 start-0 translate-middle-y"
          style={{ zIndex: 2 }}
        >
          <ArrowButton onClick={handlePrev}>
            <IoChevronBackOutline size={24} />
          </ArrowButton>
        </div>

        {/* Image */}
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
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
        <div
          className="position-absolute top-50 end-0 translate-middle-y"
          style={{ zIndex: 2 }}
        >
          <ArrowButton onClick={handleNext}>
            <IoChevronForwardOutline size={24} />
          </ArrowButton>
        </div>

        {/* Bottom Icons */}
        <div className="d-flex justify-content-around gap-3 mt-4">
          <IconButton
            icon={
              isWishlisted ? (
                <IoHeart style={{ fill: "#e91e63" }} />
              ) : (
                <IoHeartOutline />
              )
            }
            color={isWishlisted ? "#e91e63" : "#000"}
            onClick={addToGeneratedWishlist}
          />
          <IconButton
            icon={
              isCarted ? (
                <IoCart style={{ fill: "#0d6efd" }} />
              ) : (
                <IoCartOutline />
              )
            }
            color={isCarted ? "#0d6efd" : "#000"}
            onClick={addToGeneratedCart}
          />
          <IconButton
            icon={<IoShareOutline />}
            color="#ff9800"
            onClick={shareImage}
          />
          <IconButton
            icon={<IoGridOutline />}
            color="#6c757d"
            onClick={() => {
              onClose();
              navigate("/fits");
            }}
          />
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
