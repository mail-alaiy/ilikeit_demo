import React from "react";
import QueueBar from "./Queue";
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const drawer = useSelector((state) => state.ui.drawer);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <main style={{ paddingBottom: "80px" }}>
        {children}
      </main>

      {/* Only show QueueBar if drawer.state !== 1 */}
      {!drawer.isOpen && (
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
      )}
    </div>
  );
};

export default Layout;
