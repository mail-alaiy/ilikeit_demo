import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ArrowRight, Upload } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from "react-dropzone";

const UploadPicturesScreen = () => {
  const [images, setImages] = useState([]);

  const handleDrop = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setImages([...images, ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg border-0 text-center" style={{ width: "500px", borderRadius: "16px" }}>
        <h3 className="text-center mb-3" style={{ color: "rgb(29, 53, 87)", fontWeight: "600", fontSize: "30px" }}>Upload Your Best Shots!</h3>
        <p style={{ fontSize: "14px", color: "#6c757d" }}>Add at least two images to move forward.</p>
        
        <Dropzone onDrop={handleDrop} accept="image/*" multiple>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="d-flex flex-column align-items-center justify-content-center border border-dashed p-4 mt-3"
              style={{ cursor: "pointer", borderRadius: "12px", minHeight: "200px", backgroundColor: "#eef2f7" }}
            >
              <input {...getInputProps()} />
              <Upload size={40} color="gray" />
              <p className="mt-2 text-muted">Drag & drop or tap to upload</p>
            </div>
          )}
        </Dropzone>

        <div className="d-flex flex-wrap justify-content-center mt-3">
          {images.map((file, index) => (
            <img key={index} src={file.preview} alt="Uploaded" className="m-2" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
          ))}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow-lg"
            style={{ width: "55px", height: "55px" }}
            disabled={images.length < 2}
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