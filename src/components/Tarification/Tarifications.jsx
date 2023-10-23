import { Col, Form, InputNumber, Radio, Row } from "antd";

import React, { useContext, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { FormHeader } from "../FormHeader/FormHeader";

import SliderComponent from "../SliderComponent/SliderComponent";
import classes from "./Tarifications.module.css";

const marksFranchise = {
  500: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>500€</strong>,
  },
  1000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>1000€</strong>,
  },
  1500: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>1500€</strong>,
  },
  2000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>2000€</strong>,
  },
  2500: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>2500€</strong>,
  },
};

function Tarifications(props) {
  const { prev, form } = props;
  const { globalData } = useContext(GlobalContext);

  const convertFranchise = (franchise) => {
    switch (franchise) {
      case 500:
        return 500;
      case 1000:
        return 1000;
      case 1500:
        return 1500;
      case 2000:
        return 2000;
      case 2500:
        return 2500;
      default:
        return 500;
    }
  };

  return (
    <div className={classes.container}>
      <FormHeader title="Tarifications" number="3" prev={prev} />

      <div className={classes.container}>
        <div className={classes.headerBlock}>
          <div className={classes.primaryTitle}>Franchise</div>
          <label>
            Un montant minimum à payer en cas de sinistre couvert par votre
            assurance, qui est déduit de l'indemnité versée par l'assureur.
          </label>
          <div className={classes.sliderContainer}>
            <SliderComponent
              marks={marksFranchise}
              defValue={convertFranchise(globalData.franchise)}
              max={2500}
              min={500}
              fieldName="franchise"
            />
          </div>
        </div>
        <div className={classes.darkBlock} style={{ marginTop: "2rem" }}>
          <Form.Item
            name={"fractionnement"}
            rules={[
              {
                required: true,
                message: "Le fractionnement est obligatoire.",
              },
            ]}
          >
            <Radio.Group
              style={{ display: "flex", justifyContent: "space-between" }}
              defaultValue={"Fractionnement par Mois"}
            >
              <Radio value="Fractionnement par Mois">
                Fractionnement par Mois
              </Radio>
              <Radio value="Fractionnement par Trimestre">
                Fractionnement par Trimestre
              </Radio>
              <Radio value="Fractionnement par Semestre">
                Fractionnement par Semestre
              </Radio>
              <Radio value="Fractionnement par An">Fractionnement par An</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Row
          gutter={24}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <Col lg={12} md={12} xs={24} className={classes.darkBlock}>
            <div style={{ padding: "0 3rem" }}>
              <div className={classes.cardLabel}>
                <div>
                  <span style={{ color: "#E00000" }}>*</span> Frais de dossier
                </div>
              </div>
              <Form.Item
                name="frais_dossier"
                rules={[
                  { required: true, message: "Veuillez remplir ce champ." },
                  () => ({
                    validator(_, value) {
                      if (50 <= value && value <= 300) {
                        return Promise.resolve();
                      } else if (value != null) {
                        return Promise.reject(
                          new Error(
                            `${
                              value === undefined ? "Valeur" : value
                            } est incorrecte`
                          )
                        );
                      } else {
                        return Promise.reject(new Error());
                      }
                    },
                  }),
                ]}
              >
                <InputNumber
                  defaultValue={50}
                  size="large"
                  type="number"
                  controls={false}
                  style={{ width: "100%" }}
                  addonAfter={
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      €
                    </span>
                  }
                />
              </Form.Item>
              <div className={classes.cardTip}>De 50 à 300€.</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Tarifications;
