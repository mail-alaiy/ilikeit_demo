import React, { useState } from "react";
import { Container, Form, Button, Card, Modal, Carousel } from "react-bootstrap";
import { ArrowRight, CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";

const AddNameScreen = () => {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [name,setName] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Update Supabase Auth user
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });

    if (error) {
      console.error("Error updating name:", error.message);
      alert("Failed to update name. Please try again.");
      return;
    }

    console.log("User updated:", data);
    setShowGuidelines(true);
  };

  const handleProceed = () => {
    setShowGuidelines(false);
    navigate("/upload-pictures");
  };

  return (
    <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} // Smooth fade-in & fade-out
          transition={{ duration: 0.5 }}
        >
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "500px", borderRadius: "12px" }}>
        <h3 className="text-center mb-3" style={{ color: "rgb(29, 53, 87)", fontWeight: "600", fontSize: "30px" }}>
          Oh hey! Let's get to know you
        </h3>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Enter Your Name</Form.Label>
            <Form.Control type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}/>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow"
              style={{ width: "50px", height: "50px" }}
              onClick={handleNext}
            >
              <ArrowRight size={20} />
            </Button>
          </div>
          <p className="text-center mt-3" style={{ fontSize: "14px", color: "gray" }}>
            Step 2 of 4
          </p>
        </Form>
      </Card>

      {/* Guidelines Modal */}
      <Modal show={showGuidelines} onHide={() => setShowGuidelines(false)} centered size="sm-md" >
        <Modal.Header closeButton>
          <Modal.Title>Image Upload Guidelines</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel controls={false} indicators={false} interval={600} pause={false}>
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
                      backgroundColor: num <= 2 ? "rgba(40, 167, 69, 0.8)" : "rgba(220, 53, 69, 0.8)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "20px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    className={num <= 2 ? "correct-label" : "wrong-label"}
                  >
                    {num <= 2 ? <CheckCircleFill className="me-2" /> : <XCircleFill className="me-2" />}
                    {num <= 2 ? "Correct" : "Wrong"}
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleProceed} className="w-100">
            Got it! Proceed
          </Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`.correct-label:hover,
          .wrong-label:hover {
            transform: scale(1.05);
          }`}
      </style>
    </Container>
    </motion.div>
  );
};

export default AddNameScreen;
