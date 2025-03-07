import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeartButton = () => {
  const [emojiIndex, setEmojiIndex] = useState(0);

  const emojis = ["🖤", "❤️", "💙", "💚", "🧡", "💛"];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prevEmojiIndex) => (prevEmojiIndex + 1) % emojis.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      style={{
        bottom: "20px",
        right: "20px",
        width: "50px",
        height: "50px",
        backgroundColor: "white",
        border: "2px solid white",
        borderRadius: "50%",
        fontSize: "24px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "black 4px 4px 0px",
        cursor: "pointer",
        transition: "0.3s ease-in-out",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "red")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
      onClick={() => navigate("/wishlist")}
    >
      <span>{emojis[emojiIndex]}</span>
    </button>
  );
};

export default HeartButton;