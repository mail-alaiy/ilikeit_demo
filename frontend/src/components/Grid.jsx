import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Grid = () => {
  const images = useSelector((state) => state.ui.images);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="container py-5">
      {/* Back Button */}
      <div className="mb-4">
        <button 
          onClick={handleBack} 
          className="btn btn-link p-0 bg-transparent d-flex align-items-center"
          style={{
            fontSize: "1rem", 
            color: "#6c757d",
            transition: "transform 0.2s ease", 
            paddingLeft: "0"
          }}
        >
          <i 
            className="bi bi-arrow-left-circle" 
            style={{ fontSize: "1.5rem" }} 
          />
          <span 
            className="ms-2" 
            style={{ fontSize: "1rem", fontWeight: "500" }}
          >
            Back
          </span>
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-5 fw-bold text-primary mb-0">My Images</h1>
            <div className="badge bg-light text-secondary px-3 py-2 rounded-pill">
              {images.length} {images.length === 1 ? "item" : "items"}
            </div>
          </div>
          <hr className="mt-3 mb-4" />
        </div>
      </div>

      {images.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {images.map((img, index) => (
            <div key={index} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
                <div className="position-absolute top-0 end-0 m-3 z-index-1"></div>

                <img
                  src={images[index]}
                  alt={`Image ${index + 1}`}
                  className="card-img-top img-fluid"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 my-4 bg-light bg-opacity-50 rounded-3">
          <h4 className="text-muted mb-2">Your list is empty</h4>
          <p className="text-muted mb-4">
            Browse our catalog and try on items you love
          </p>
          <button className="btn btn-primary rounded-pill px-4 py-2">
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Grid;
