import { Typography } from "antd";
import React, { useContext } from "react";
import classes from "./Home.module.css";
import LogoAsSolutions from "../../assets/Atrias.svg";
import character from "../../assets/character.svg";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../../contexts/GlobalContext";

const Success = () => {
  const { organisme, partnership_id } = useContext(GlobalContext);
  const Navigate = useNavigate();
  return (
    <div style={{ paddingBottom: "5rem" }}>
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
      <div className={classes.stepperContainer}>
        <div
          className={classes.contentStyle}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography.Text
            type="danger"
            style={{ textAlign: "center", fontSize: "24px" }}
          >
            Merci pour votre souscription
          </Typography.Text>

          <img
            src={character}
            alt="character"
            style={{ width: "300px", marginTop: "2rem", marginBottom: "2rem" }}
          />
          <Typography.Paragraph
            style={{
              fontSize: "16px",
              textAlign: "center",
              letterSpacing: "0.05em",
              color: "#444646",
            }}
          >
            Votre souscription est bien enregistrée et sera validée par les
            équipes ATRIAS PRO dans les plus brefs délais.
          </Typography.Paragraph>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          className={classes.btnNext}
          // HANDLE SUBSCRIBE
          // onClick={handleSouscription}
          onClick={() => {
            sessionStorage.clear();
            Navigate(
              "/?id_gamme=" + organisme + "/?partnership_id=" + partnership_id
            );
            window.location.reload();
          }}
        >
          Nouvelle souscription
        </button>
      </div>
    </div>
  );
};

export default Success;
