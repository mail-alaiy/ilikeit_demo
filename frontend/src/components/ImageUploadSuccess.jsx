import React, { useState, useEffect } from 'react';
import preset1 from "../images/option1.jpeg";
import './ImageUploadModal.css';
import { useDispatch } from "react-redux";
import supabase from '../supabaseClient';
import { closeDrawer } from "../store/slice/uiSlice";
import { X } from "react-bootstrap-icons";

const ImageUploadSuccess = () => {
  const dispatch = useDispatch();
    const [imageUrl, setImageUrl] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

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
    
        if (userId) {
          fetchUserImage();
        }
      }, [userId]);

  return (
    <div className="modal-backdrop-custom fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="upload-modal card shadow-sm p-3" style={{ aspectRatio: "3/4", height:"580px", position:"relative" }}>
        <div style={{textAlign:"left"}}>
        <h2 className="text-2xl font-light mb-1" style={{ color: "#6f42c1", textAlign:"left", fontSize:"24px"
         }}>
          ALL SET
        </h2>
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
        <p className="modal-subtext block text-sm font-medium text-gray-700 mb-2" style={{textAlign:"left"}}>
      We'll use this image for your try-ons.
        </p>

        <div className="image-placeholder d-flex justify-content-center align-items-center mb-3">
          <img src={imageUrl} alt="Uploaded" className="img-fluid rounded place" style={{
    border: "2px dotted #6f42c1",}}/>
        </div>

        <div className="text-center">
          <button className="btn continue-btn" onClick={() => dispatch(closeDrawer())}>
            Try the Look
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSuccess;
