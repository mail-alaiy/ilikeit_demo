import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

const SelectedImage = () => {
  const [images, setImages] = useState([]);
  const [bestImage, setBestImage] = useState(null);
  const navigate = useNavigate();

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 4) {
      alert("Please upload exactly 4 images.");
      return;
    }
    setImages(files);
  };

  // Submit images to Google Gemini API
  const handleSubmit = async () => {
    if (images.length !== 4) {
      alert("Please upload 4 images.");
      return;
    }

    const apiKey = 'YOUR_GEMINI_API_KEY';

    // Prepare FormData to send images
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    // Define guidelines in the prompt
    const prompt = `
      Based on these 4 images, select the one that is best suited for virtual try-on. Criteria:
      1. Clear frontal face visibility.
      2. Good lighting and high resolution.
      3. Minimal obstructions (no glasses or shadows).
      4. Natural head position and neutral facial expression.
    `;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta2/generateContent?key=${apiKey}`,
        {
          prompt: prompt,
          images: images // This is just illustrative; Google Vision API might require specific handling for images
        }
      );
      
      // Extract the best image from response
      const bestImage = response.data.best_image; // Assuming the API returns the filename or URL of the best image
      setBestImage(bestImage);
    } catch (error) {
      console.error("Error selecting best image:", error);
    }
  };

  return (
    <div className="App">
      <h1>Virtual Try-On Image Selector</h1>

      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

      <button onClick={handleSubmit}>Submit Images</button>

      {bestImage && (
        <div>
          <h2>Best Image for Virtual Try-On:</h2>
          <img src={bestImage} alt="Best selection" />
          <p className="text-center mt-3" style={{ fontSize: "14px", color: "#6c757d" }} onClick={() => {navigate("/")}}>Step 4 of 4</p>
        </div>
      )}
    </div>
  );
};

export default SelectedImage;

