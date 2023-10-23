import React from "react";
import classes from "./FormHeader.module.css";
import ArrowLeft from "../../assets/ArrowLeft.png";

export const FormHeader = (props) => {
  const { title, number, prev } = props;

  return (
    <div className={classes.container}>
      <div className={classes.previous}>
        {prev && (
          <button onClick={prev}>
            <img src={ArrowLeft} alt="Arrow Left" />
          </button>
        )}
      </div>
      <div className={classes.ligneLeft}></div>
      <div className={classes.titleHolder}>
        <div className={classes.number}>
          <span>{number}</span>
        </div>
        <span className={classes.title}>{title}</span>
      </div>
      <div className={classes.ligneRight}></div>
    </div>
  );
};
