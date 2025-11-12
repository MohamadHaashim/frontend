import React, { useState } from "react";

const InputSwitch = ({ label, id, checked }) => {
  const [inputCheck, setCheck] = useState(checked ? true : false);


  const nottification = () => {
    setCheck(prevCheck => {
      const newCheck = !prevCheck;
      console.log(id, newCheck); // Log after state update
      return newCheck;
    });
  }

  return (
    <React.Fragment>
      <input
        type="checkbox"
        className="custom-control-input"
        checked={inputCheck}
        onChange={nottification}
        id={id}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </React.Fragment>
  );
};

export default InputSwitch;
