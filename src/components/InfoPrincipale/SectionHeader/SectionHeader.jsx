import React from "react";
import classes from "./SectionHeader.module.css";

function SectionHeader(props) {
  const { icon, title } = props;
  return (
    <div className={classes.headerContainer}>
      <div>
        <span>
          <img src={icon} alt="Section title" />
        </span>
      </div>
      <div className={classes.title}>
        <span>{title}</span>
      </div>
    </div>
  );
}

export default SectionHeader;
