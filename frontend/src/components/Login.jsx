import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For smooth transitions
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../supabaseClient";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSignup = async () => {
    setError("");  
    setLoading(true);  // Start loading state

    try {
      let { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        let { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) throw signupError;
      }

      setTimeout(() => {
        navigate("/add-name");
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);  // Stop loading if error occurs
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} // Smooth fade-in & fade-out
      transition={{ duration: 0.5 }}
    >
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}>
          <h3 className="text-center mb-3" style={{ color: "rgb(29, 53, 87)", fontWeight: "600", fontSize: "28px" }}>Signup / Login</h3>
          
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button 
                variant="primary" 
                className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow"
                style={{ width: "50px", height: "50px" }} 
                onClick={handleLoginSignup}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : <ArrowRight size={20} />}
              </Button>
            </div>

            <p className="text-center mt-3" style={{ fontSize: "14px", color: "gray" }}>Step 1 of 4</p>
          </Form>
        </Card>
      </Container>
    </motion.div>
  );
};

export default LoginSignup;
