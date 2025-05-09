import React, {useEffect, useState} from 'react';
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Carousel } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import './ImageUploadModal.css';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer,nextStep } from "../store/slice/uiSlice";
import supabase from '../supabaseClient';

const Guidelines = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    useEffect(() => {
        const postUser = async () => {
          try {
            const {
              data: { user },
              error
            } = await supabase.auth.getUser();
    
            if (error || !user) {
              throw new Error("Failed to fetch user.");
            }
    
            const user_id_by_brand = user.id;
            const name = user.user_metadata?.name || user.email;
    
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`
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
    
          } catch (err) {
            console.error("Error during user creation:", err.message);
            setError(err.message);
          }
        };
    
        postUser();
      }, []);

      const handleProceed = () => {
        dispatch(nextStep());
      };

  return (
    <div className="modal-backdrop-custom fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="upload-modal card shadow-sm p-3" style={{ aspectRatio: "3/4" }}>
        <div style={{textAlign:"center", position:"relative"}}>
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
        <h2 className="text-2xl font-light text-center mb-1" style={{ color: "#6f42c1", textAlign:"center", fontSize:"24px", marginTop:"20px", marginBottom:"10px" }}>
          GUIDELINES
        </h2>
        </div>

        <p className="modal-subtext block text-sm font-medium text-gray-700 mb-2">
        Get the perfect fit with these quick tips.
        </p>

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

        <div className="text-center">
          <button className="btn continue-btn" onClick={handleProceed}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
