import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from "react-dropzone";
import supabase from "../supabaseClient";
import preset1 from "../images/option1.jpeg";
import preset2 from "../images/option2.jpg";
import { X, Upload, Trash2, Check, Plus } from "lucide-react";

const Profile = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isUploading, setIsUploading] = useState(false);
  const [initialImage, setInitialImage] = useState(null);

  useEffect(() => {
    const fetchExistingImage = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Failed to fetch user.");
        return;
      }

      const userId = user.id;

      const { data, error: storageError } = await supabase.storage
        .from("user-images")
        .getPublicUrl(`${userId}/profile`);

      if (!storageError && data && data.publicUrl) {
        setInitialImage(data.publicUrl);
      } else if (storageError) {
        console.error("Error fetching existing image:", storageError);
      }
    };

    fetchExistingImage();
  }, []);

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    setImage({ file, preview: imageUrl });
  }, []);

  const handleUpload = async () => {
    if (!image && !initialImage) return;

    setIsUploading(true);

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
    const formData = new FormData();

    if (image?.file) {
      formData.append("file", image.file);
    } else if (initialImage && !image) {
      setIsUploading(false);
      onClose?.();
      return;
    }

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
      onClose?.();
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Failed to update image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = useCallback(() => {
    if (image) URL.revokeObjectURL(image.preview);
    setImage(null);
  }, [image]);

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

  const handlePresetSelect = useCallback(async (localImg) => {
    const res = await fetch(localImg);
    const blob = await res.blob();
    const file = new File([blob], `preset.jpg`, { type: blob.type });
    const preview = URL.createObjectURL(file);
    setImage({ file, preview });
  }, []);

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px", // Slightly more rounded
    padding: "24px",
    maxWidth: "400px", // Adjusted max width
    width: "90%",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "4px",
    opacity: 0.6,
  };

  const titleStyle = {
    color: "#222",
    fontWeight: "600",
    fontSize: "22px",
    textAlign: "center",
    marginBottom: "24px",
  };

  const uploadAreaStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
    borderRadius: "50%", // Make it a circle
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderWidth: "2px",
    width: "120px", // Set a fixed width and height for the circle
    height: "120px",
    margin: "0 auto 20px",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.2s ease",
  };

  const uploadAreaHoverStyle = {
    backgroundColor: "#f0f0f0",
    borderColor: "#aaa",
  };

  const uploadedImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%", // Ensure the image is also a circle
  };

  const initialImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  };

  const uploadIconOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const removeImageButtonStyle = {
    position: "absolute",
    bottom: "-8px",
    right: "-8px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
  };

  const presetTitleStyle = {
    color: "#555",
    fontWeight: "500",
    marginBottom: "12px",
    textAlign: "center",
  };

  const presetsContainerStyle = {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "24px",
  };

  const presetImageContainerStyle = {
    width: "70px",
    height: "70px",
    cursor: "pointer",
    position: "relative",
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid #ddd",
  };

  const presetImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const presetCheckmarkStyle = {
    position: "absolute",
    top: "4px",
    right: "4px",
    backgroundColor: "#3498db",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  };

  const handleRemoveImageClick = (event) => {
    event.stopPropagation(); // Prevent the modal's onClick from triggering
    removeImage();
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
          <X size={24} color="#444" />
        </button>

        <h3 style={titleStyle}>Update Your Profile Picture</h3>

        <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
          {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
            <div
              {...getRootProps()}
              style={{
                ...uploadAreaStyle,
                ...(isDragActive || isDragAccept || isDragReject) && uploadAreaHoverStyle,
              }}
            >
              <input {...getInputProps()} />
              {image ? (
                <img src={image.preview} alt="Uploaded" style={uploadedImageStyle} />
              ) : initialImage ? (
                <>
                  <img src={initialImage} alt="Current Profile" style={initialImageStyle} />
                  <div style={uploadIconOverlayStyle}>
                    <Upload size={28} />
                    <p className="mt-2 mb-0" style={{ fontSize: "14px" }}>Upload New</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted">
                  <Plus size={32} />
                  <p className="mt-2 mb-0" style={{ fontSize: "14px" }}>Upload</p>
                </div>
              )}
              {image && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-circle position-absolute bottom-0 end-0 translate-middle"
                  onClick={handleRemoveImageClick}
                  aria-label="Remove uploaded image"
                  style={{ marginBottom: "-8px", marginRight: "-8px" }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </Dropzone>

        <div className="mb-4 text-center">
          {!image && initialImage && (
            <Button variant="outline-danger" size="sm" onClick={() => setImage(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={16} /> Remove Current
            </Button>
          )}
        </div>

        <h6 style={presetTitleStyle}>Or choose from these:</h6>
        <div style={presetsContainerStyle}>
          {[preset1, preset2].map((localImg, idx) => (
            <div
              key={idx}
              onClick={() => handlePresetSelect(localImg)}
              style={presetImageContainerStyle}
            >
              <img src={localImg} alt={`Preset ${idx + 1}`} style={presetImageStyle} />
              {image?.preview === localImg && (
                <div style={presetCheckmarkStyle}>
                  <Check size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={buttonContainerStyle}>
          <Button variant="secondary" onClick={onClose} style={{ fontWeight: "500" }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading || (!image && !initialImage)}
            style={{ fontWeight: "500", backgroundColor: "#1D3557", border: "none" }}
          >
            {isUploading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;