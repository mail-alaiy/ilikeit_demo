import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import ImageSliderModal from "./Tryon";
import { useDispatch } from 'react-redux';
import { openDrawer } from "../store/slice/uiSlice";
import supabase from "../supabaseClient";

const QueueBar = () => {
  const [garmentUrls, setGarmentUrls] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
  
      if (error) {
        console.error("Failed to get session:", error.message);
        return;
      }
  
      if (session?.user) {
        setUserId(session.user.id);
      }
  
      // Listen for auth changes (like page refresh restoring session)
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUserId(session.user.id);
          }
        }
      );
  
      return () => {
        listener?.subscription?.unsubscribe();
      };
    };
  
    getSessionAndUser();
  }, []);

  const fetchUrls = () => {
    const urls = JSON.parse(localStorage.getItem("selected_garment_url")) || [];
    const lastFive = urls.slice(-5);
    setGarmentUrls(lastFive);
  };

  useEffect(() => {
    fetchUrls();
    const handleUpdate = () => {
      fetchUrls();
    };

    window.addEventListener("garmentUrlUpdated", handleUpdate);

    return () => {
      window.removeEventListener("garmentUrlUpdated", handleUpdate);
    };
  }, []);

  const totalSlots = 5;
  const emptySlots = totalSlots - garmentUrls.length;
  const placeholders = Array(emptySlots).fill(null);

  const handleQueueItemClick = () => {
    if (!userId) {
      dispatch(openDrawer());
    } 
    setShowSlider(true); // Open the modal on click
  };

  return (
    <div
      style={{
        backgroundColor: "#d3d3d3",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <span style={{ fontSize: "12px", fontWeight: "700", color: "black" }}>
        Your fits are in the queue
      </span>

      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={handleQueueItemClick} // Trigger modal open on click
      >
        {/* Filled image circles (latest first) */}
        {[...garmentUrls].reverse().map((url, index) => (
          <div
            key={`url-${index}`}
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginLeft: index === 0 ? "0" : "5px",
            }}
          />
        ))}

        {/* Empty placeholders go to the right */}
        {placeholders.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              backgroundColor: "#808080",
              marginLeft: garmentUrls.length === 0 && index === 0 ? "0" : "5px",
            }}
          />
        ))}

        <ChevronRight size={20} style={{ marginLeft: "10px" }} />
      </div>

      {/* Modal component */}
      <ImageSliderModal
        show={showSlider}
        onClose={() => { setShowSlider(false)}} // Close the modal when requested
      />
    </div>
  );
};

export default QueueBar;
