import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  IoCloseOutline,
  IoHeartOutline,
  IoCartOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userError, setUserError] = useState(false);
  const intervalRef = useRef(null);

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not found or error:", error?.message);
        setUserError(true);

        setTimeout(() => {
          window.location.href = "/login"; // adjust to your login route
        }, 2500);

        return;
      }

      setUserId(user.id);
    };

    getUser();
  }, []);

  // Fetch images
  const fetchImages = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/generated-images`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const imageUrls = data.map((img) => img.inference_image_url).reverse();
      setImages(imageUrls);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  // Poll for images
  useEffect(() => {
    if (show && userId) {
      fetchImages();
      intervalRef.current = setInterval(fetchImages, 5000);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [show, userId]);

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
      style={{ borderRadius: "1rem" }}
    >
      <Modal.Body className="p-0 bg-white position-relative d-flex flex-column align-items-center">

        {/* Left Arrow */}
        {!userError && images.length > 0 && (
          <div
            className="position-absolute top-50 start-0 translate-middle-y"
            style={{ zIndex: 1 }}
          >
            <ArrowButton onClick={handlePrev}>
              <IoChevronBackOutline size={24} />
            </ArrowButton>
          </div>
        )}

        {/* Main Content */}
        <div
          className="d-flex justify-content-center align-items-center text-center px-4"
          style={{ height: "70vh" }}
        >
          {userError ? (
            <div className="text-center">
              <div
                className="fw-bold text-danger mb-3"
                style={{ fontSize: "1.2rem" }}
              >
                User not found
              </div>
              <div style={{ fontSize: "1rem", color: "#6c757d" }}>
                Please login first!
              </div>
            </div>
          ) : images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "1rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            />
          ) : (
            <div className="text-center">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <div className="text-muted">Loading your latest fits...</div>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {!userError && images.length > 0 && (
          <div
            className="position-absolute top-50 end-0 translate-middle-y"
            style={{ zIndex: 1 }}
          >
            <ArrowButton onClick={handleNext}>
              <IoChevronForwardOutline size={24} />
            </ArrowButton>
          </div>
        )}

        {/* Bottom Buttons */}
        {!userError && (
          <div className="d-flex justify-content-around w-50 mt-3 mb-4">
            <IconButton
              icon={<IoCloseOutline />}
              color="#f44336"
              onClick={onClose}
            />
            <IconButton icon={<IoHeartOutline />} color="#e91e63" />
            <IconButton icon={<IoCartOutline />} color="#0d6efd" />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

// Reusable Buttons
const IconButton = ({ icon, color, onClick }) => (
  <Button
    variant="light"
    className="rounded-circle shadow d-flex align-items-center justify-content-center"
    style={{
      width: "50px",
      height: "50px",
      color,
      backgroundColor: "white",
      border: "none",
    }}
    onClick={onClick}
  >
    {icon}
  </Button>
);

const ArrowButton = ({ onClick, children }) => (
  <Button
    variant="light"
    onClick={onClick}
    className="rounded-circle shadow d-flex align-items-center justify-content-center"
    style={{
      width: "40px",
      height: "40px",
      color: "#000",
      backgroundColor: "white",
      border: "none",
    }}
  >
    {children}
  </Button>
);

export default ImageSliderModal;
