import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const SelectedImage = () => {
const navigate = useNavigate();
  return (
  <div>
    <p>Selected Image</p>
        <p className="text-center mt-3" style={{ fontSize: "14px", color: "#6c757d" }} onClick={() => {navigate("/")}}>Step 4 of 4</p>
        </div>

  );
};

export default SelectedImage;
