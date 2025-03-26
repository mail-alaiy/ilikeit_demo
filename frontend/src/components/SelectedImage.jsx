import React, { useState, useEffect } from "react";
import { Card, Button, Image, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "react-bootstrap-icons";
import TryTheFit from "./TrytheFit";
import supabase from "../supabaseClient";
import { popupVariants, backdropStyle } from "./Helper";

const ImageUploadSuccessDrawer = ({ show = true, onClose }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // <- new loading state

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
    const fetchUserImage = async () => {
      try {
        setLoading(true); // <- start loading
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/try-on-image`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch image");

        const data = await response.json();
        setImageUrl(data.image);
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false); // <- stop loading
      }
    };

    if (show && userId) {
      fetchUserImage();
    }
  }, [show, userId]);

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
              width: "100%",
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

            <div style={{ overflowY: "auto", flexGrow: 1 }}>
              <Card className="p-4 text-center border-0">
                <Card.Title className="mb-4">
                  {loading
                    ? "Loading preview..."
                    : "Image Upload Successful!"}
                </Card.Title>

                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "300px", // Fixed height to center within the card
                    }}
                  >
                    <Spinner
                      animation="border"
                      variant="primary"
                      className="mb-3"
                    />
                  </div>
                ) : (
                  imageUrl && (
                    <Image
                      src={imageUrl}
                      alt="Uploaded"
                      fluid
                      rounded
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                      className="mb-4"
                    />
                  )
                )}

                {!loading && <TryTheFit onClick={() => navigate("/")} />}
              </Card>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploadSuccessDrawer;
