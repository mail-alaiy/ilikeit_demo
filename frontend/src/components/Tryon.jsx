import React, { useState, useEffect, useRef } from "react";
import { Tooltip, Overlay } from "react-bootstrap";
import { Modal, Button, Spinner } from "react-bootstrap";
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
  
  // Loading states
  const [imageLoading, setImageLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    wishlist: false,
    cart: false,
    share: false
  });
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const images = useSelector((state) => state.ui.images);
  const navigate = useNavigate();

  // Check queue state
  const selectedGarmentUrl = localStorage.getItem("selected_garment_url");
  const hasQueuedItem = selectedGarmentUrl && selectedGarmentUrl.trim() !== "";
  const hasGeneratedImages = images && images.length > 0;

  // Determine current state
  const getQueueState = () => {
    if (!hasQueuedItem) {
      return 'empty'; // No garment selected
    } else if (hasQueuedItem && !hasGeneratedImages) {
      return 'generating'; // Garment selected but no images generated yet
    } else {
      return 'ready'; // Images are available
    }
  };

  const queueState = getQueueState();

  // Preload images for better UX
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((image, index) => {
        const img = new Image();
        img.onload = () => {
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: false
          }));
        };
        img.onerror = () => {
          setImageLoadingStates(prev => ({
            ...prev,
            [index]: 'error'
          }));
        };
        img.src = image?.inference_image_url;
        
        // Set initial loading state
        setImageLoadingStates(prev => ({
          ...prev,
          [index]: true
        }));
      });
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images]);

  useEffect(() => {
    const getUser = async () => {
      setUserLoading(true);
      try {
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
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setUserLoading(false);
      }
    };
    getUser();
  }, [onClose]);

  useEffect(() => {
    if (queueState === 'ready') {
      const currentImage = images[currentIndex];
      const generatedWishlist =
        JSON.parse(localStorage.getItem("generatedWishlist")) || [];
      const generatedCart =
        JSON.parse(localStorage.getItem("generatedCart")) || [];

      setIsWishlisted(
        generatedWishlist.some(
          (img) => img.inference_image_url === currentImage?.inference_image_url
        )
      );

      setIsCarted(
        generatedCart.some(
          (img) => img.inference_image_url === currentImage?.inference_image_url
        )
      );
    }
  }, [currentIndex, images, queueState]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const addToGeneratedWishlist = async () => {
    setActionLoading(prev => ({ ...prev, wishlist: true }));
    
    try {
      const currentImage = images[currentIndex];
      const wishlist = JSON.parse(localStorage.getItem("generatedWishlist")) || [];

      const alreadyExists = wishlist.some(
        (img) => img.inference_image_url === currentImage?.inference_image_url
      );

      if (!alreadyExists) {
        wishlist.push(currentImage);
        localStorage.setItem("generatedWishlist", JSON.stringify(wishlist));
        setIsWishlisted(true);
      }
      
      // Simulate API delay for demo (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, wishlist: false }));
    }
  };

  const addToGeneratedCart = async () => {
    setActionLoading(prev => ({ ...prev, cart: true }));
    
    try {
      const currentImage = images[currentIndex];
      const cart = JSON.parse(localStorage.getItem("generatedCart")) || [];

      const alreadyExists = cart.some(
        (img) => img.inference_image_url === currentImage?.inference_image_url
      );

      if (!alreadyExists) {
        cart.push(currentImage);
        localStorage.setItem("generatedCart", JSON.stringify(cart));
        setIsCarted(true);
      }
      
      // Simulate API delay for demo (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const shareImage = async () => {
    setActionLoading(prev => ({ ...prev, share: true }));
    
    try {
      const imageUrl = images[currentIndex]?.inference_image_url;
      
      if (navigator.share) {
        await navigator.share({ 
          title: "Check this out", 
          url: imageUrl 
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        alert("Link copied");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, share: false }));
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  // Show loading spinner if user is still loading
  if (userLoading) {
    return (
      <Modal show={show} onHide={onClose} centered size="md">
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Loading...</span>
        </div>
      </Modal>
    );
  }

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

        {/* Main Content Area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
            minHeight: "300px", // Prevent layout shift
          }}
        >
          {/* Empty State - No garment selected */}
          {queueState === 'empty' && (
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
              No try-ons yet!
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
              Looks like you haven't tried anything on. Select a garment from our collection to see it on you!
            </p>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                navigate("/");
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4a258a';
                e.currentTarget.style.borderColor = '#4a258a';
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
                e.currentTarget.style.borderColor = themeColor;
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              Browse
            </Button>
            </div>
          )}

          {/* Generating State - Garment selected but no images yet */}
          {queueState === 'generating' && (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                padding: "2rem",
              }}
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <Spinner 
                  animation="border" 
                  variant="primary" 
                  style={{ width: "3rem", height: "3rem" }}
                />
              </div>
              <h5 style={{ marginBottom: "0.5rem" }}>Loading your try-on</h5>
              <p style={{ fontSize: "0.9rem", color: "#888" }}>
                We're generating your virtual outfit...
              </p>
              <div style={{ marginTop: "1rem" }}>
                <div 
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: "100%",
                      backgroundColor: themeColor,
                      borderRadius: "2px",
                      animation: "loading-bar 2s ease-in-out infinite",
                    }}
                  />
                </div>
                <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
                  This usually takes 10-15 seconds
                </p>
              </div>
            </div>
          )}

          {/* Ready State - Images available */}
          {queueState === 'ready' && (
            <>
              {/* Loading spinner for current image */}
              {imageLoadingStates[currentIndex] === true && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                  }}
                >
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              {/* Error state */}
              {imageLoadingStates[currentIndex] === 'error' && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <p>Failed to load image</p>
                  <Button 
                    size="sm" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              <img
                src={images[currentIndex]?.inference_image_url}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "50vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                  opacity: imageLoadingStates[currentIndex] === true ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />

              {/* Navigation arrows - only show when image is loaded */}
              {imageLoadingStates[currentIndex] !== true && images.length > 1 && (
                <>
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
              )}
            </>
          )}
        </div>

        {/* Image counter - only show when ready */}
        {queueState === 'ready' && images.length > 1 && (
          <div
            className="d-flex justify-content-center gap-2 mb-3"
            style={{ marginTop: "-0.5rem" }} // Pull dots slightly closer to the image
          >
            {images.map((_, index) => (
              <span
                key={index}
                style={{
                  height: "6px",
                  width: currentIndex === index ? "24px" : "8px", // Highlight current
                  backgroundColor:
                    currentIndex === index ? themeColor : "rgba(255, 255, 255, 0.7)",
                  borderRadius: "3px",
                  transition: "width 0.3s ease, background-color 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Actions - only show when ready */}
        {queueState === 'ready' && (
          <div className="d-flex justify-content-center gap-3 mt-2">
            <IconButton
              icon={isWishlisted ? <IoHeart /> : <IoHeartOutline />}
              onClick={addToGeneratedWishlist}
              color={isWishlisted ? themeColor : "#666"}
              tooltip="Add to Wishlist"
              loading={actionLoading.wishlist}
              disabled={actionLoading.wishlist}
            />
            <IconButton
              icon={isCarted ? <IoCart /> : <IoCartOutline />}
              onClick={addToGeneratedCart}
              color={isCarted ? themeColor : "#666"}
              tooltip="Add to Cart"
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
                onClose();
                navigate("/fits");
              }}
              color="#666"
              tooltip="View All"
            />
          </div>
        )}

        {/* Add CSS for loading bar animation */}
        <style>
          {`
            @keyframes loading-bar {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
      </div>
    </Modal>
  );
};

const IconButton = ({ icon, onClick, color, tooltip, loading = false, disabled = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  const handleMouseEnter = () => !disabled && setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleClick = () => {
    if (!disabled) {
      setShowTooltip(false);
      onClick();
    }
  };

  return (
    <>
      <button
        ref={target}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          backgroundColor: disabled ? "#e0e0e0" : "#f5f5f5",
          color: disabled ? "#999" : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {loading ? (
          <Spinner animation="border" size="sm" style={{ width: 16, height: 16 }} />
        ) : (
          icon
        )}
      </button>

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

const ArrowButton = ({ onClick, children, style, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      border: "none",
      color: disabled ? "#ccc" : "#888",
      padding: 8,
      borderRadius: "50%",
      backgroundColor: "transparent",
      transition: "background-color 0.2s, color 0.2s",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style,
    }}
  >
    {children}
  </button>
);

export default ImageSliderModal;