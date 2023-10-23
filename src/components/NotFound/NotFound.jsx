import React from "react";
import svg from "../../assets/notfound.svg";
import LogoAsSolutions from "../../assets/Atrias.svg";
import classes from "../../pages/Home/Home.module.css";
import { Typography } from "antd";
function NotFound() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Typography.Text style={{ color: "white" }}>RCD</Typography.Text>
        </div>
        <div className={classes.topBar}>
          <img
            src={LogoAsSolutions}
            alt="logo AsSolutions"
            className={classes.logoStyle}
          />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={svg}
          alt="404"
          style={{ width: "100%", height: "100%" }}
          height={925}
          width={925}
        />{" "}
      </div>
    </div>
  );
}

export default NotFound;
