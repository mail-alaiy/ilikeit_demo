import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IoCloseOutline, IoHeartOutline, IoCartOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import 'bootstrap/dist/css/bootstrap.min.css';
import supabase from "../supabaseClient";

const ImageSliderModal = ({ show = true, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/generated-images`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const imageUrls = data.map(img => img.inference_image_url);
        setImages(imageUrls);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    if (userId) {
      fetchImages();
    }
  }, [userId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}  // Hook up onClose to close the modal
      centered
      size="md"
      backdrop="static"
      keyboard={true}
      className="image-slider-modal"
      style={{ borderRadius: '1rem' }}
    >
      <Modal.Body className="p-0 bg-white position-relative d-flex flex-column align-items-center">
        {/* Left Arrow */}
        <div className="position-absolute top-50 start-0 translate-middle-y" style={{ zIndex: 1 }}>
          <Button
            variant="light"
            onClick={handlePrev}
            className="rounded-circle shadow d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              color: '#000',
              backgroundColor: 'white',
              border: 'none',
            }}
          >
            <IoChevronBackOutline size={24} />
          </Button>
        </div>

        {/* Card Image */}
        {images.length > 0 ? (
          <div className="d-flex justify-content-center align-items-center p-4" style={{ height: '70vh' }}>
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        ) : (
          <div>Loading images...</div> // Display a loading message if no images are loaded
        )}

        {/* Right Arrow */}
        <div className="position-absolute top-50 end-0 translate-middle-y" style={{ zIndex: 1 }}>
          <Button
            variant="light"
            onClick={handleNext}
            className="rounded-circle shadow d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              color: '#000',
              backgroundColor: 'white',
              border: 'none',
            }}
          >
            <IoChevronForwardOutline size={24} />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-around w-50 mt-3 mb-4">
          <IconButton icon={<IoCloseOutline />} color="#f44336" onClick={onClose} /> {/* Red for ❌ */}
          <IconButton icon={<IoHeartOutline />} color="#e91e63" /> {/* Pink for ❤️ */}
          <IconButton icon={<IoCartOutline />} color="#0d6efd" /> {/* Blue for 🛒 */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const IconButton = ({ icon, color, onClick }) => {
  return (
    <Button
      variant="light"
      className="rounded-circle shadow d-flex align-items-center justify-content-center"
      style={{
        width: '50px',
        height: '50px',
        color,
        backgroundColor: 'white',
        border: 'none',
      }}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

export default ImageSliderModal;
