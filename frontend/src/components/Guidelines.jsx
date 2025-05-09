import React from 'react';
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Carousel } from "react-bootstrap";
import './ImageUploadModal.css';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep } from "../store/slice/uiSlice";

const Guidelines = () => {
    const dispatch = useDispatch();
      const handleProceed = () => {
        dispatch(nextStep());
      };

  return (
    <div className="modal-backdrop-custom fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="upload-modal card shadow-sm p-3" style={{ aspectRatio: "3/4" }}>
        <div style={{textAlign:"center"}}>
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
