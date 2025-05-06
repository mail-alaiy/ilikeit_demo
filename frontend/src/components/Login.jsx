import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { ArrowRight, X } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../supabaseClient";
import { backdropStyle } from "./Helper";
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDrawer,
  nextStep,
} from "../store/slice/uiSlice";

const popupVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.3 },
  },
};

const LoginSignupModal = ({ show = true}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.ui.drawer);
  console.log(drawer);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginSignup = async () => {
    setError("");
    setLoading(true);
    try {
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let { error: signupError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signupError) throw signupError;
      }

      setTimeout(() => {
        dispatch(nextStep());
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "",
        },
      });
  
      if (error) throw error;

      console.log(data);
  
      if (data?.user) {
        console.log("Google login successful:", data.user);
  
        dispatch(nextStep());
  
      }
    } catch (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };
  

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={backdropStyle}
          onClick={() => dispatch(closeDrawer())}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={popupVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isMobile ? "100%" : "100vw", // Full viewport width on tablets/desktop
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: "20px",
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Close Button */}
            <Button
              variant="light"
              onClick={() => dispatch(closeDrawer())}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                zIndex: 10,
              }}
              aria-label="Close"
            >
              <X size={20} />
            </Button>

            {/* Form Container - centered on larger screens */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {/* Actual Form - constrained width on larger screens */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "450px", // Comfortable reading width
                  paddingTop: "10px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5
                  className="text-center mb-3"
                  style={{
                    fontWeight: "600",
                    color: "#1d3557",
                    marginTop: "10px",
                  }}
                >
                  Login / Signup
                </h5>

                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                <Form className="d-flex flex-column">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  {/* Google Sign In Button 
                  <Button
                    variant="light"
                    size="sm"
                    className="mt-3 mb-3 d-flex align-items-center justify-content-center mx-auto shadow-sm"
                    style={{
                      width: "220px",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      transition: "all 0.2s ease",
                    }}
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {googleLoading ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 48 48"
                        className="me-2"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                        <path fill="none" d="M0 0h48v48H0z" />
                      </svg>
                    )}
                    <span style={{ fontWeight: "500", color: "#444" }}>
                      Continue with Google
                    </span>
                  </Button>
                  */}
                  <div className="d-flex justify-content-center mb-2">
                    <Button
                      variant="primary"
                      className="rounded-circle d-flex justify-content-center align-items-center p-3 shadow"
                      style={{ width: "50px", height: "50px" }}
                      onClick={handleLoginSignup}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </Button>
                  </div>
                  <p
                    className="text-center mt-1 mb-1"
                    style={{ fontSize: "13px", color: "gray" }}
                  >
                    Step 1 of 4
                  </p>
                </Form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginSignupModal;
