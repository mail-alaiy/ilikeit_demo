import React from 'react';

const TryTheFit = ({ onClick, className }) => {
  const buttonStyle = {
    position: 'relative',
    backgroundColor: 'grey',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8em',
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
      Try the Fit
      <span style={sparkleStyle}>✨</span>
    </button>
  );
};

export default TryTheFit;
