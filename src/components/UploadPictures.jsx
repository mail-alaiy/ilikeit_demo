import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ArrowRight, Plus } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";

const UploadPicturesScreen = () => {
  const [images, setImages] = useState(Array(4).fill(null));
  const navigate = useNavigate();

  const handleDrop = (acceptedFiles, index) => {
    const newImages = [...images];
    newImages[index] = Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) });
    setImages(newImages);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg border-0 text-center" style={{ width: "500px", borderRadius: "16px" }}>
        <h3 className="text-center mb-3" style={{ color: "rgb(29, 53, 87)", fontWeight: "600", fontSize: "30px" }}>Upload Your Best Shots!</h3>
        <p style={{ fontSize: "14px", color: "#6c757d" }}>Add at least two images to move forward.</p>

        <div className="d-flex flex-wrap justify-content-center gap-2">
          {images.map((file, index) => (
            <Dropzone key={index} onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index)} accept="image/*" multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="d-flex align-items-center justify-content-center border border-dashed"
                  style={{ width: "100px", height: "100px", borderRadius: "8px", backgroundColor: "#eef2f7", cursor: "pointer", position: "relative" }}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <img src={file.preview} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    <Plus size={32} color="gray" />
                  )}
                </div>
              )}
            </Dropzone>
          ))}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow-lg"
            style={{ width: "55px", height: "55px" }}
            disabled={images.filter(img => img !== null).length < 2}
            onClick={() => {navigate("/selected-image")}}
          >
            <ArrowRight size={22} />
          </Button>
        </div>

        <p className="text-center mt-3" style={{ fontSize: "14px", color: "#6c757d" }}>Step 3 of 4</p>
      </Card>
    </Container>
  );
};

export default UploadPicturesScreen;
