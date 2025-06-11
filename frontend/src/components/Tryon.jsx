import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Overlay, Modal, Button, Spinner } from "react-bootstrap";
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
import supabase from "../supabaseClient"; // Assuming you have this configured
import { useSelector } from "react-redux"; // For accessing Redux state
import { useNavigate } from "react-router-dom"; // For navigation

// Define a consistent theme color
const themeColor = "#5a2d9c";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);
  const [isCurrentLoading, setIsCurrentLoading] = useState(true); // Tracks if the current image is loading
  const [isCurrentError, setIsCurrentError] = useState(false); // Tracks if the current image failed to load

  const [actionLoading, setActionLoading] = useState({
    wishlist: false,
    cart: false,
    share: false,
  });

  // Get images from Redux store
  const images = useSelector((state) => state.ui.images);
  const navigate = useNavigate();

  // Effect to get the current user from Supabase on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("Failed to get user:", error?.message);
          // If user cannot be fetched, you might want to handle it (e.g., redirect to login)
          return;
        }
        setUserId(user?.id);
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUser();
  }, []); // Run only once on mount

  // Effect to reset image loading/error states and current index when images change or modal visibility changes
  useEffect(() => {
    if (images.length > 0) {
      // Ensure currentIndex is within bounds if images are available
      if (currentIndex >= images.length) {
        setCurrentIndex(0);
      }
    } else {
      // If images array becomes empty, reset index
      setCurrentIndex(0);
    }
    // Always reset loading and error state for the new current image
    setIsCurrentLoading(true); // Assume loading for the new image
    setIsCurrentError(false);
  }, [images, currentIndex, show]); // Re-run if images array changes, current index changes, or modal visibility changes

  // Effect to update wishlist and cart status based on the current image
  useEffect(() => {
    if (images.length > 0) {
      const currentImage = images[currentIndex];
      const currentImageUrl =
        typeof currentImage === "string"
          ? currentImage
          : currentImage?.inference_image_url;

      const generatedWishlist =
        JSON.parse(localStorage.getItem("generatedWishlist")) || [];
      const generatedCart =
        JSON.parse(localStorage.getItem("generatedCart")) || [];

      // Check if the current image URL is present in localStorage arrays
      setIsWishlisted(
        generatedWishlist.some((img) => img.inference_image_url === currentImageUrl)
      );
      setIsCarted(
        generatedCart.some((img) => img.inference_image_url === currentImageUrl)
      );
    } else {
      // If no images, reset wishlist/cart status
      setIsWishlisted(false);
      setIsCarted(false);
    }
  }, [currentIndex, images]); // Re-run when current image changes

  // Handler for navigating to the next image
  const handleNext = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  // Handler for navigating to the previous image
  const handlePrev = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Handler for toggling wishlist status
  const toggleWishlist = async () => {
    setActionLoading((prev) => ({ ...prev, wishlist: true }));
    try {
      const currentImage = images[currentIndex];
      console.log(currentImage, "image to be oushed");
      const currentImageUrl =
        typeof currentImage === "string"
          ? currentImage
          : currentImage?.inference_image_url;

      let wishlist = JSON.parse(localStorage.getItem("generatedWishlist")) || [];

      const indexInWishlist = wishlist.findIndex(
        (img) => img.inference_image_url === currentImageUrl
      );

      if (indexInWishlist !== -1) {
        // Image is already in wishlist, remove it
        wishlist.splice(indexInWishlist, 1);
        setIsWishlisted(false);
      } else {
        // Image is not in wishlist, add it
        wishlist.push(currentImage);
        setIsWishlisted(true);
      }
      localStorage.setItem("generatedWishlist", JSON.stringify(wishlist));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, wishlist: false }));
    }
  };

  // Handler for toggling cart status
  const toggleCart = async () => {
    setActionLoading((prev) => ({ ...prev, cart: true }));
    try {
      const currentImage = images[currentIndex];
      const currentImageUrl =
        typeof currentImage === "string"
          ? currentImage
          : currentImage?.inference_image_url;

      let cart = JSON.parse(localStorage.getItem("generatedCart")) || [];

      const indexInCart = cart.findIndex(
        (img) => img.inference_image_url === currentImageUrl
      );

      if (indexInCart !== -1) {
        // Image is already in cart, remove it
        cart.splice(indexInCart, 1);
        setIsCarted(false);
      } else {
        // Image is not in cart, add it
        cart.push(currentImage);
        setIsCarted(true);
      }
      localStorage.setItem("generatedCart", JSON.stringify(cart));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error toggling cart:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  // Handler for sharing the image
  const shareImage = async () => {
    setActionLoading((prev) => ({ ...prev, share: true }));

    try {
      const imageUrl =
        typeof images[currentIndex] === "string"
          ? images[currentIndex]
          : images[currentIndex]?.inference_image_url;

      if (navigator.share) {
        await navigator.share({
          title: "Check out this image!",
          url: imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, share: false }));
    }
  };

  // Determine the URL of the current image, handling both string and object formats
  const currentImageUrl = images[currentIndex]
    ? typeof images[currentIndex] === "string"
      ? images[currentIndex]
      : images[currentIndex].inference_image_url
    : null;
  // Check if there are any images available
  const hasImages = images && images.length > 0;

  // Render a loading spinner for user data while Supabase is fetching
  if (userId === null) {
    return (
      <Modal show={show} onHide={onClose} centered size="md">
        <Modal.Body className="d-flex justify-content-center align-items-center p-5">
          <Spinner
            animation="border"
            variant="primary"
            style={{ color: themeColor }}
          />
          <span className="ms-2" style={{ color: "#333" }}>
            Loading user data...
          </span>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      backdrop="static" // Modal won't close when clicking outside
      keyboard // Allows closing with Escape key
      className="border-0" // Remove default modal border
    >
      <div
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
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            padding: 0,
            cursor: "pointer",
            zIndex: 10, // Ensure it's above other content
          }}
        >
          <X size={20} />
        </button>

        {/* Main Content Area: Image Display / Empty State */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
            minHeight: "300px", // Maintain minimum height to prevent layout shifts
            overflow: "hidden", // Ensure image stays within bounds
          }}
        >
          {/* Conditional Rendering for Empty State */}
          {!hasImages && (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                padding: "2rem",
              }}
            >
              <h5
                style={{
                  marginBottom: "0.75rem",
                  color: "#333",
                  fontWeight: "600",
                }}
              >
                No images to display!
              </h5>
              <p
                style={{
                  fontSize: "1rem",
                  marginBottom: "2rem",
                  color: "#777",
                  maxWidth: "300px",
                  lineHeight: "1.5",
                }}
              >
                It looks like there are no images available to show. Generate
                some or browse existing content.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  onClose(); // Close modal first
                  navigate("/"); // Then navigate to home or generation page
                }}
                style={{
                  backgroundColor: themeColor,
                  borderColor: themeColor,
                  color: "#fff",
                  padding: "0.75rem 2rem",
                  borderRadius: "25px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                // Add hover effects for a more interactive button
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a258a";
                  e.currentTarget.style.borderColor = "#4a258a";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                  e.currentTarget.style.borderColor = themeColor;
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                Browse
              </Button>
            </div>
          )}

          {/* Conditional Rendering for Image Display (only if images exist) */}
          {hasImages && (
            <>
              {/* Loading spinner for the current image */}
              {isCurrentLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2, // Above the image space but below controls
                  }}
                >
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{ color: themeColor }}
                  />
                </div>
              )}

              {/* Error message for current image */}
              {isCurrentError && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "#666",
                    zIndex: 2,
                  }}
                >
                  <p>Failed to load image</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsCurrentLoading(true); // Try loading again
                      setIsCurrentError(false);
                    }}
                    style={{
                      backgroundColor: themeColor,
                      borderColor: themeColor,
                    }}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* The image itself */}
              {currentImageUrl && (
                <img
                  src={currentImageUrl}
                  alt={`Display ${currentIndex + 1}`}
                  onLoad={() => {
                    setIsCurrentLoading(false); // Image loaded successfully
                    setIsCurrentError(false);
                  }}
                  onError={() => {
                    setIsCurrentLoading(false); // Image failed to load
                    setIsCurrentError(true);
                  }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "50vh", // Responsive height
                    objectFit: "contain",
                    borderRadius: "8px",
                    // Hide image if loading or error to prevent broken image icon flash
                    visibility:
                      isCurrentLoading || isCurrentError ? "hidden" : "visible",
                    transition: "opacity 0.3s ease", // Smooth transition when image appears
                  }}
                />
              )}

              {/* Navigation arrows - only shown when images are loaded, no error, and there's more than one image */}
              {!isCurrentLoading && !isCurrentError && images.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <ArrowButton
                    onClick={handlePrev}
                    // Disable arrows if any action is loading
                    disabled={
                      actionLoading.wishlist ||
                      actionLoading.cart ||
                      actionLoading.share
                    }
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "12px",
                      transform: "translateY(-50%)",
                      background: "rgba(255, 255, 255, 0.9)", // Slightly transparent background
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <IoChevronBackOutline size={20} />
                  </ArrowButton>

                  {/* Right Arrow */}
                  <ArrowButton
                    onClick={handleNext}
                    // Disable arrows if any action is loading
                    disabled={
                      actionLoading.wishlist ||
                      actionLoading.cart ||
                      actionLoading.share
                    }
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
              )}
            </>
          )}
        </div>

        {/* Image Counter (dots) - only shown if images exist and there's more than one */}
        {hasImages && images.length > 1 && (
          <div
            className="d-flex justify-content-center gap-2 mb-3"
            style={{ marginTop: "-0.5rem" }} // Pull slightly up for better alignment
          >
            {images.map((_, index) => (
              <span
                key={index}
                style={{
                  height: "6px",
                  width: currentIndex === index ? "24px" : "8px", // Active dot is wider
                  backgroundColor:
                    currentIndex === index ? themeColor : "#ccc", // Active dot has theme color
                  borderRadius: "3px",
                  transition: "width 0.3s ease, background-color 0.3s ease", // Smooth transition for dot size/color
                  cursor: "pointer",
                }}
                onClick={() => setCurrentIndex(index)} // Clicking dot changes image
              />
            ))}
          </div>
        )}

        {/* Action Buttons - only shown if images are available and the current image is loaded/no error */}
        {hasImages && !isCurrentLoading && !isCurrentError && (
          <div className="d-flex justify-content-center gap-3 mt-2">
            <IconButton
              icon={isWishlisted ? <IoHeart /> : <IoHeartOutline />} // Filled heart if wishlisted
              onClick={toggleWishlist}
              color={isWishlisted ? themeColor : "#666"}
              tooltip={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              loading={actionLoading.wishlist} // Pass loading state to disable button and show spinner
              disabled={actionLoading.wishlist}
            />
            <IconButton
              icon={isCarted ? <IoCart /> : <IoCartOutline />} // Filled cart if carted
              onClick={toggleCart}
              color={isCarted ? themeColor : "#666"}
              tooltip={isCarted ? "Remove from Cart" : "Add to Cart"}
              loading={actionLoading.cart}
              disabled={actionLoading.cart}
            />
            <IconButton
              icon={<IoShareOutline />}
              onClick={shareImage}
              color="#666"
              tooltip="Share"
              loading={actionLoading.share}
              disabled={actionLoading.share}
            />
            <IconButton
              icon={<IoGridOutline />}
              onClick={() => {
                onClose(); // Close modal
                navigate("/fits"); // Navigate to "/fits" route
              }}
              color="#666"
              tooltip="View All"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

// Helper component for action buttons with tooltips
const IconButton = ({
  icon,
  onClick,
  color,
  tooltip,
  loading = false,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null); // Ref to attach the tooltip to

  const handleMouseEnter = () => !disabled && setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleClick = () => {
    if (!disabled) {
      setShowTooltip(false); // Hide tooltip on click
      onClick();
    }
  };

  return (
    <>
      <button
        ref={target} // Attach ref here
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled} // Disable button if `disabled` prop is true
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          backgroundColor: disabled ? "#e0e0e0" : "#f5f5f5", // Greyed out if disabled
          color: disabled ? "#999" : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s, color 0.2s, opacity 0.2s", // Added opacity to transition
          cursor: disabled ? "not-allowed" : "pointer", // Change cursor for disabled state
          opacity: disabled ? 0.6 : 1, // Reduce opacity if disabled
        }}
      >
        {loading ? (
          // Show spinner if loading
          <Spinner
            animation="border"
            size="sm"
            style={{ width: 16, height: 16, color: themeColor }}
          />
        ) : (
          // Otherwise, show the icon
          icon
        )}
      </button>

      {/* Bootstrap Overlay for Tooltip */}
      <Overlay target={target.current} show={showTooltip && !disabled} placement="top">
        {(props) => (
          <Tooltip id="button-tooltip" {...props}>
            {tooltip}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

// Helper component for navigation arrows
const ArrowButton = ({ onClick, children, style, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled} // Disable button if `disabled` prop is true
    style={{
      border: "none",
      color: disabled ? "#ccc" : "#888", // Greyed out color if disabled
      padding: 8,
      borderRadius: "50%",
      backgroundColor: "transparent",
      transition: "background-color 0.2s, color 0.2s, opacity 0.2s", // Added opacity to transition
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style, // Allow additional inline styles to be passed
    }}
  >
    {children}
  </button>
);

export default ImageSliderModal;