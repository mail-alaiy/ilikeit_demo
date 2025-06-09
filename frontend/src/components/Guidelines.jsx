import React, { useEffect, useState } from "react";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Carousel } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import "./ImageUploadModal.css";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer, nextStep } from "../store/slice/uiSlice";
import supabase from "../supabaseClient";

const Guidelines = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  useEffect(() => {
    const postUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          throw new Error("Failed to fetch user.");
        }

        const user_id_by_brand = user.id;
        const name = user.user_metadata?.name || user.email;

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
            body: JSON.stringify({
              name,
              user_id_by_brand,
            }),
          }
        );

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
    <div
      className="upload-modal card shadow-sm"
      style={{
        position: "relative",
        aspectRatio: "3/4",
        height: "580px",
        padding: "0px",
        border: "1px solid rgba(200, 200, 200, 1)",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      {/* Close Button */}
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
          zIndex: 20,
        }}
        aria-label="Close"
      >
        <X size={25} />
      </button>

      {/* Carousel: Images and "Correct/Wrong" only */}
      <Carousel
        controls={false}
        indicators={false}
        interval={600}
        pause={false}
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[1, 2, 3, 4].map((num) => (
          <Carousel.Item key={num}>
            <div style={{ position: "relative", height: "580px" }}>
              <img
                src={`/guidelines/guideline${num}.jpeg`}
                alt={`Guideline ${num}`}
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "8px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    num <= 2
                      ? "rgba(40, 167, 69, 0.9)"
                      : "rgba(220, 53, 69, 0.9)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  fontSize: "14px",
                  fontWeight: "600",
                  zIndex: 5,
                }}
              >
                {num <= 2 ? (
                  <CheckCircleFill className="me-2" size={16} />
                ) : (
                  <XCircleFill className="me-2" size={16} />
                )}
                {num <= 2 ? "Correct" : "Wrong"}
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ✅ STATIC Overlay at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "20px 16px",
          background:
            "linear-gradient(to top, rgba(255, 249, 240, 0.7), rgba(255, 249, 240, 0.3), rgba(255, 255, 255, 0))",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          zIndex: 10,
        }}
      >
        <h5
          style={{
            fontWeight: "bold",
            textAlign: "left",
            fontSize: "20px",
            lineHeight: "1.3",
            marginBottom: "4px",
            color: "#240B3F",
          }}
        >
          How to set-up <br />
          the Virtual Try-on
        </h5>
        <p
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            color: "black",
            textAlign: "left",
          }}
        >
          See how the outfit looks on you.
        </p>
        <button
          style={{
            backgroundColor: "#4B1C7C",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            borderRadius: "9999px",
            border: "none",
            width: "100%",
            padding: "16px 14px",
          }}
          onClick={handleProceed}
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

};

export default Guidelines;
