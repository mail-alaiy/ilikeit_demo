import React, { useState, useEffect } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import { ArrowRight, Plus, Trash, X } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UploadPicturesScreen = () => {
  const [images, setImages] = useState(Array(4).fill(null));
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleDrop = (acceptedFiles, index) => {
    const newImages = [...images];
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    newImages[index] = { file, preview: imageUrl };
    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    if (newImages[index]) URL.revokeObjectURL(newImages[index].preview);
    newImages[index] = null;
    setImages(newImages);
  };

  useEffect(() => {
    return () => images.forEach((img) => img && URL.revokeObjectURL(img.preview));
  }, [images]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-lg border-0 text-center" style={{ width: "500px", borderRadius: "16px" }}>
          <h3 className="text-center mb-3" style={{ color: "#1D3557", fontWeight: "600", fontSize: "30px" }}>
            Upload Your Best Shots!
          </h3>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>Add at least two images to move forward</p>

          <div className="d-flex flex-wrap justify-content-between" style={{ gap: "10px" }}>
            {images.map((file, index) => (
              <Dropzone key={index} onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index)} accept="image/*" multiple={false}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="position-relative d-flex align-items-center justify-content-center border border-dashed"
                    style={{
                      width: "calc(50% - 5px)",
                      height: "130px",
                      borderRadius: "10px",
                      backgroundColor: "#f8f9fa",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <input {...getInputProps()} />
                    {file ? (
                      <>
                        <img
                          src={file.preview}
                          alt="Uploaded"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(file.preview);
                          }}
                        />
                        <Button
                          variant="dark"
                          size="sm"
                          className="position-absolute d-flex align-items-center justify-content-center"
                          style={{ top: "5px", right: "5px", borderRadius: "50%", padding: "3px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
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
            ))}
          </div>

          <p className="mt-2" style={{ fontSize: "11px", color: "#6c757d" }}>
            Tap to preview your images before uploading
          </p>

          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="primary"
              className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow-lg"
              style={{ width: "55px", height: "55px" }}
              disabled={images.filter((img) => img !== null).length < 2}
              onClick={() => navigate("/selected-image")}
            >
              <ArrowRight size={22} />
            </Button>
          </div>

          <p className="text-center mt-3" style={{ fontSize: "14px", color: "#6c757d" }}>Step 3 of 4</p>
        </Card>
      </Container>

      {/* Full Image Preview Modal with Better Transition */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <motion.img 
                  src={previewImage} 
                  alt="Full Preview" 
                  style={{ width: "100%", borderRadius: "10px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                />
              </Modal.Body>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadPicturesScreen;
