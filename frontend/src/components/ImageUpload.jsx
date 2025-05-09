import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { UploadCloud, RotateCw, Trash2 } from "lucide-react";
import preset1 from "../images/option1.jpeg";
import preset2 from "../images/option2.jpg";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer, nextStep } from "../store/slice/uiSlice";
import EXIF from "exif-js";
import { X } from "react-bootstrap-icons";
import supabase from "../supabaseClient";

const demoImages = [
  preset1,preset2
];

const ImageUploadComponent = ({ onClose, onUpload, visible = true }) => {
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const dispatch = useDispatch();
   const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    EXIF.getData(file, function () {
      const orientation = EXIF.getTag(this, "Orientation");

      let correctedRotation = 0;
      switch (orientation) {
        case 3:
          correctedRotation = 180;
          break;
        case 6:
          correctedRotation = 90;
          break;
        case 8:
          correctedRotation = 270;
          break;
        default:
          correctedRotation = 0;
          break;
      }
      setImage({ file, preview: imageUrl });
      setRotation(correctedRotation);
    });
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90));
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
    setRotation(0);
  };

  const handleUpload = async () => {
    if (!image || !image.file) return;
    setIsUploading(true);

    // Correct image rotation using canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image.preview;

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply the rotation to the canvas context
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Convert the canvas back to a file
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "rotated-image.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("file", file);

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
      }, "image/jpeg");
    };
  };

  const handleDemoClick = (url) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "demo-image.jpg", { type: blob.type });
        const preview = URL.createObjectURL(file);
        setImage({ file, preview });
        setRotation(0);
      });
  };

    useEffect(() => {
      return () => image && URL.revokeObjectURL(image.preview);
    }, [image]);

  if (!visible) {
    return null;
  }

  return (
    <div className="image-upload-overlay">
      <div className="image-upload-container">
        <div className="image-upload-header">
          <h2 className="image-upload-title">UPLOAD IMAGE</h2>
        </div>
        <button
  onClick={() => dispatch(closeDrawer())}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    zIndex: 10,
  }}
  aria-label="Close"
>
  <X size={25} />
</button>
        <div className="image-upload-body">
          <Dropzone
            onDrop={handleDrop}
            accept={{ "image/jpeg": [], "image/png": [] }}
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="upload-box"
              >
                <input {...getInputProps()} />
                {!image?.preview ? (
                  <div className="upload-placeholder">
                    <UploadCloud size={24} className="upload-icon" />
                    <p className="upload-text">Choose or capture a photo</p>
                    <small className="upload-note">Maximum file: 50MB</small>
                    <br />
                    <small className="upload-note-italic">Supported formats: JPEG, PNG</small>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <div className="image-wrapper" style={{
                        transform: `rotate(${rotation}deg)`,
                      }}>
                      <img
                        src={image.preview}
                        alt="preview"
                        className="preview-image"
                      />
                    </div>
                    <div className="image-actions">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        rotateImage();
                      }} className="image-action-button">
                        <RotateCw size={18} />
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }} className="image-action-button">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dropzone>

          {/* Demo Image Thumbnails */}
          <div className="demo-images-section">
            <h6>Or try with a demo image:</h6>
            <div className="demo-images-container">
              {demoImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`demo-${index}`}
                  onClick={() => handleDemoClick(url)}
                  className="demo-image-thumbnail"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="image-upload-footer">
          <button
            onClick={handleUpload}
            disabled={!image || isUploading}
            className="upload-button"
          >
            Upload
          </button>
        </div>
      </div>

      <style jsx>{`
        .image-upload-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .image-upload-container {
          background-color: white;
          width: 340px;
          height: 580px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position:relative;
        }

        .image-upload-header {
          padding-top: 20px;
          padding-bottom:10px;
        }

        .image-upload-title {
          color: #6f42c1;
          font-size: 24px;
          font-weight: 300;
          margin: 0;
          text-align:center;
        }

        .image-upload-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          flex: 1;
          overflow-y: auto;
        }

        .upload-box {
          width: 100%;
          height: 40vh;
          aspect-ratio: 3/4;
          background-color: #f9f9f9;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .upload-icon {
          margin: 0;
          padding: 0;
          color: black;
        }

        .upload-text {
          font-size: 16px;
          color: #333;
          margin-bottom: 4px;
        }

        .upload-note {
          font-size: 12px;
          color: #777;
        }

        .upload-note-italic {
          font-size: 12px;
          color: #777;
          font-style: italic;
        }

        .image-preview-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9f9f9;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: cover;
        }

        .image-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
          z-index: 5;
        }

        .image-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
          max-height: 100%;
          transition: transform 0.3s ease;
        }

        .image-action-button {
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6f42c1;
          transition: all 0.2s;
          padding: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .image-action-button:hover {
          background-color: #fff;
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .demo-images-section {
          width: 100%;
          margin-top: 12px;
          text-align:center;
        }

        .demo-images-container {
          display: flex;
          gap: 8px;
          align-items:center;
          justify-content:center;
        }

        .demo-image-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 2px solid #eee;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .demo-image-thumbnail:hover {
          transform: scale(1.05);
          border-color: #6f42c1;
        }

        .image-upload-footer {
          padding: 16px 20px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .upload-button {
          background-color: #6f42c1;
          color: white;
          border: none;
          width: 100%;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .upload-button:disabled {
          background-color: #a896c9;
          cursor: not-allowed;
        }

        .upload-button:hover:not(:disabled) {
          background-color: #5a319b;
        }
      `}</style>
    </div>
  );
};

export default ImageUploadComponent;