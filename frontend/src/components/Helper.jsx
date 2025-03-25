
export const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 1050,
  };
  
  export const popupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        type: "tween",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        type: "tween",
      },
    },
  };