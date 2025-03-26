import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  IoCloseOutline,
  IoHeartOutline,
  IoCartOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";
import { useSelector } from "react-redux";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const images = useSelector((state) => state.ui.images);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to get user:", error.message);
        return;
      }

      setUserId(user?.id);
    };

    getUser();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
          <div className="my-5 text-muted">Loading images...</div>
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

        {/* Bottom Buttons */}
        <div className="d-flex justify-content-around gap-4 mt-4">
          <IconButton icon={<IoCloseOutline />} color="#f44336" onClick={onClose} />
          <IconButton icon={<IoHeartOutline />} color="#e91e63" />
          <IconButton icon={<IoCartOutline />} color="#0d6efd" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

// Icon Button
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
