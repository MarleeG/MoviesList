import React from "react";

import "./input.css";
const Input = (props) => {
  const { inputValue, handleInputChange, disabled } = props;
  return (
    <input
      className="mt-5"
      placeholder="Search for a movie"
      disabled={disabled}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

export default Input;
