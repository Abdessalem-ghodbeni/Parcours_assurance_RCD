import React from "react";
import "./CustomLoader.css";

const CustomLoader = () => {
  return (
    <div className={"lds-ellipsis"}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CustomLoader;
