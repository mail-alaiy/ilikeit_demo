import React, { useState } from "react";
import "./Login.css";
import supabase from "../supabaseClient";
import { useDispatch} from "react-redux";
import { X } from "react-bootstrap-icons";
import { Button} from "react-bootstrap";
import {
  closeDrawer,
  nextStep,
} from "../store/slice/uiSlice";

export default function LoginSuccessNotification() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginSignup = async () => {
    setError("");
    setLoading(true);
    try {
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        let { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
      }
      setTimeout(() => {
        dispatch(nextStep());
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded-lg shadow-xl p-8 aspect-[3/4] mx-4 flex flex-col justify-between"
        style={{
          aspectRatio: "3 / 4",
          borderRadius: "20px",
          height: "580px",
          width: "340px",
          display: "flex",
          justifyContent: "center",
          position: "relative"
        }}
      >
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
    zIndex: 10,
  }}
  aria-label="Close"
>
  <X size={25} />
</button>

        <h2
          className="text-2xl font-light"
          style={{
            color: "#6f42c1",
            textAlign: "center",
            fontSize: "24px",
            marginTop: "6px",
            marginBottom: "5px",
          }}
        >
          GET STARTED
        </h2>
        <p
          className="modal-subtext block text-sm font-medium text-gray-700"
          style={{ marginBottom: "15px", textAlign: "center" }}
        >
          Login/ Signup to set up your virtual avatar
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={handleLoginSignup}
            disabled={loading}
            className="w-full continue-btn"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
