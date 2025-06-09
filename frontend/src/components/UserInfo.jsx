import React, { useState } from "react";
import { useDispatch } from "react-redux";
import supabase from "../supabaseClient";
import { nextStep, closeDrawer } from "../store/slice/uiSlice";
import { X } from "lucide-react";

const UserInfo = () => {
  const dispatch = useDispatch();
  const containerStyle = {
    position: "relative",
    width: "10rem", // 40 x 4px = 160px = 10rem
    height: "10rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 10px 15px -3px rgba(124, 58, 237, 0.5), 0 4px 6px -2px rgba(124, 58, 237, 0.3)", // approximate shadow-lg in purple
    ring: "4px solid rgba(139, 92, 246, 0.5)", // Tailwind ring-4 ring-purple-400 ring-opacity-50
    // Since 'ring' is not CSS, we use boxShadow to simulate it below
    boxShadow: `
      0 0 0 4px rgba(139, 92, 246, 0.5), /* outer ring */
      0 10px 15px -3px rgba(124, 58, 237, 0.5),
      0 4px 6px -2px rgba(124, 58, 237, 0.3)
    `,
  };

  const innerCircleStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 8px rgba(88, 21, 142, 0.7)", // ring-8 ring-purple-600 ring-opacity-70
  };

  const avatarStyle = {
    width: "8rem", // 32 x 4px = 128px = 8rem
    height: "8rem",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid rgba(255, 255, 255, 0.7)",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="rounded-xl shadow-2xl p-8 mx-4 flex flex-col items-center text-white"
        style={{
          height: "580px",
          width: "340px",
          background: "linear-gradient(180deg, #330867 0%, #6a1b9a 100%)",
          position: "relative",
          borderRadius: "20px",
          justifyContent: "center", // center vertically
          alignItems: "center",
        }}
      >
        <button
          onClick={() => dispatch(closeDrawer())}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            zIndex: 10,
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div
          className="flex flex-col items-center mt-8"
          style={{ width: "300px" }}
        >
          <p className="text-sm font-medium text-white mb-2">
            LOGIN SUCCESSFUL!
          </p>
          <h2 className="text-2xl font-semibold mb-6">LET’S GET STARTED</h2>

          <div style={containerStyle}>
            <div style={innerCircleStyle}>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlFY2-Xjzv6RkZTu8No2DYkLUjo8Ioy_e2zQ&s"
                }
                alt="User Avatar"
                style={avatarStyle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/150x150/663399/FFFFFF?text=Error";
                }}
              />
            </div>
          </div>

          <p
            className="text-md text-white mb-4 text-center"
            style={{ fontSize: "15px", marginTop: "10px" }}
          >
            Set up your virtual avatar
          </p>

          <button
            onClick={() => dispatch(nextStep())}
            style={{
              backgroundColor: "#BC92CF",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: "50px",
              border: "none",
              transition: "all 0.3s ease",
              width: "100%",
            }}
          >
            Continue
          </button>

          <div
            onClick={() => dispatch(closeDrawer())}
            style={{ marginTop: "13px", fontSize: "15px", textAlign: "center" }}
          >
            Skip for now
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
