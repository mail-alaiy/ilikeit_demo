import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); 

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        openModal,
        closeModal,
        currentStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
