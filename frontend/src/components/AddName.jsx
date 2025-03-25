import React, { useState, useEffect } from "react";
import { Button, Alert, Spinner, Carousel, Modal } from "react-bootstrap";
import { X, CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import supabase from '../supabaseClient';
import { popupVariants, backdropStyle } from "./Helper";

const AddNameScreen = ({ show = true, onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showGuidelines, setShowGuidelines] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const postUser= async () => {
      try {
        // Step 1: Get current user from Supabase Auth
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();
    
        if (error || !user) {
          throw new Error("Failed to fetch user.");
        }

        const user_id_by_brand = user.id;
        const name = user.user_metadata?.name || user.email;
    
        // Step 3: Call FastAPI backend
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}` // brand-specific API key
          },
          body: JSON.stringify({
            name,
            user_id_by_brand
          })
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create user.");
        }
    
        const newUser = await response.json();
        console.log("User successfully created:", newUser);
        navigate("/upload-pictures")
  
      } catch (err) {
        console.error("Error during user creation:", err.message);
      }
    };

    postUser();
  },[]);

  const handleProceed = () => {
    setShowGuidelines(false);
    navigate("/upload-pictures");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={backdropStyle}
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={popupVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isMobile ? "100%" : "100vw",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: "20px",
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Close Button */}
            <Button
              variant="light"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                zIndex: 10,
              }}
              aria-label="Close"
            >
              <X size={20} />
            </Button>

            {/* Content Container */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {/* Content */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  paddingTop: "10px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5
                  className="text-center mb-1"
                  style={{
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "rgb(29,53,87)",
                    letterSpacing: "1px",
                    marginTop: "10px",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Logged in successfully!
                </h5>
                <h4 className="text-center mb-2" style={{ fontSize: "1.8rem" }}>
                  Image Upload Guidelines
                </h4>
                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                {/* Guidelines Carousel */}
                <Carousel
                  controls={false}
                  indicators={false}
                  interval={600}
                  pause={false}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Carousel.Item key={num}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={`/guidelines/guideline${num}.jpeg`}
                          alt={`Guideline ${num}`}
                          className="d-block w-100 rounded"
                          style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor:
                              num <= 2
                                ? "rgba(40, 167, 69, 0.8)"
                                : "rgba(220, 53, 69, 0.8)",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          className={num <= 2 ? "correct-label" : "wrong-label"}
                        >
                          {num <= 2 ? (
                            <CheckCircleFill className="me-2" />
                          ) : (
                            <XCircleFill className="me-2" />
                          )}
                          {num <= 2 ? "Correct" : "Wrong"}
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>

                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="primary"
                    onClick={handleProceed}
                    className="w-100"
                  >
                    Got it! Proceed
                  </Button>
                </div>

                <p
                  className="text-center mt-3"
                  style={{ fontSize: "14px", color: "gray" }}
                >
                  Step 2 of 4
                </p>
              </div>
            </div>
            <style>
              {`.correct-label:hover, .wrong-label:hover { transform: scale(1.05); }`}
            </style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddNameScreen;
