import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ArrowRight, Plus, Trash, X } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../supabaseClient";
import { popupVariants, backdropStyle } from "./Helper";
import preset1 from "../images/option1.jpeg";
import preset2 from "../images/option2.jpg";
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer, nextStep } from "../store/slice/uiSlice";

const UploadPicturesScreen = ({ show = true, onClose }) => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    setImage({ file, preview: imageUrl });
  };

  const handleUpload = async () => {
    if (!image || !image.file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image.file);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      alert("Failed to fetch user.");
      setIsUploading(false);
      return;
    }

    const userId = user.id;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      dispatch(nextStep());
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Failed to upload image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  useEffect(() => {
    return () => image && URL.revokeObjectURL(image.preview);
  }, [image]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={backdropStyle}
          onClick={() => dispatch(closeDrawer())}
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
            <Button
              variant="light"
              onClick={() => dispatch(closeDrawer())}
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

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  paddingTop: "10px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  className="text-center mb-3"
                  style={{
                    color: "#1D3557",
                    fontWeight: "600",
                    fontSize: "30px",
                  }}
                >
                  Upload Your Best Shot!
                </h3>

                <div className="d-flex justify-content-center">
                  <Dropzone
                    onDrop={handleDrop}
                    accept="image/*"
                    multiple={false}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="position-relative d-flex align-items-center justify-content-center border border-dashed"
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "10px",
                          backgroundColor: "#f8f9fa",
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <input {...getInputProps()} />
                        {image ? (
                          <>
                            <img
                              src={image.preview}
                              alt="Uploaded"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                            <Button
                              variant="dark"
                              size="sm"
                              className="position-absolute d-flex align-items-center justify-content-center"
                              style={{
                                top: "5px",
                                right: "5px",
                                borderRadius: "50%",
                                padding: "3px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                            >
                              <Trash size={12} />
                            </Button>
                          </>
                        ) : (
                          <Plus size={32} color="gray" />
                        )}
                      </div>
                    )}
                  </Dropzone>
                </div>

                <h6
                  className="text-center mt-4 mb-2"
                  style={{ color: "#1D3557" }}
                >
                  Or choose from these:
                </h6>

                <div className="d-flex justify-content-center gap-3">
                  {[preset1, preset2].map((localImg, idx) => (
                    <img
                      key={idx}
                      src={localImg}
                      alt={`Preset ${idx + 1}`}
                      onClick={async () => {
                        const res = await fetch(localImg);
                        const blob = await res.blob();
                        const file = new File([blob], `preset-${idx + 1}.jpg`, {
                          type: blob.type,
                        });
                        const preview = URL.createObjectURL(file);
                        setImage({ file, preview });
                      }}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        cursor: "pointer",
                        border:
                          image?.preview === localImg
                            ? "3px solid #1D3557"
                            : "1px solid #ccc",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ))}
                </div>

                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="primary"
                    className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow-lg"
                    style={{ width: "55px", height: "55px" }}
                    disabled={!image || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      ></div>
                    ) : (
                      <ArrowRight size={22} />
                    )}
                  </Button>
                </div>

                <p
                  className="text-center mt-3"
                  style={{ fontSize: "14px", color: "#6c757d" }}
                >
                  Step 3 of 4
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadPicturesScreen;
