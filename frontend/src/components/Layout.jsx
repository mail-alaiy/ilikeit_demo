import React, {useState} from "react";
import QueueBar from "./Queue";

const Layout = ({ children }) => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <main style={{ paddingBottom: "80px" }}>{children}</main>
      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
          zIndex: 1060,
        }}
      >
        <QueueBar />
      </div>
    </div>
  );
};

export default Layout;
