// Layout.js
import React from "react";
import HeartButton from "./HeartButton"; // Adjust the path as needed

const Layout = ({ children }) => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <main style={{ paddingBottom: "80px" }}>{children}</main> {/* Adjust padding */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <HeartButton />
      </div>
    </div>
  );
};

export default Layout;