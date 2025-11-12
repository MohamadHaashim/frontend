import React from "react";


export default function Spinner(props) {
  const {style} = props
  return (
    <div className="spinner-container" style={style}>
      <div className="loading-spinner">
      </div>
    </div>
  );
}