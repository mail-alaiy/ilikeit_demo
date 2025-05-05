import React from 'react';


const TryTheFit = ({ onClick, isAddedToQueue, className }) => {

  const buttonStyle = {
    position: 'relative',
    backgroundColor: 'white',
    color: '#1D3557',
    padding: '6px 10px',
    border: '1px solid #1D3557',
    borderRadius: '8px',
    fontSize: '0.7em',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    lineHeight: 1,
  };

  const sparkleStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '1em',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      className={className}
    >
      {isAddedToQueue ? "Added to Queue" : "Try The Look"}
    </button>
  );
};

export default TryTheFit;
