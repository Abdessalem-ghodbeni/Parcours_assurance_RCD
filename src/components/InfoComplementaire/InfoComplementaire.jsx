import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
  message,
} from "antd";
import BreifCase from "../../assets/briefcase.png";
import CheckMark from "../../assets/shieldtick.png";
import axios from "axios";
import React, { useEffect } from "react";
import {
  PercentageOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { FormHeader } from "../FormHeader/FormHeader";
import classes from "./InfoComplementaire.module.css";
import GlobalContext from "../../contexts/GlobalContext";
import SectionHeader from "../InfoPrincipale/SectionHeader/SectionHeader";

function InfoComplementaire(props) {
  const { prev, form, garantieOptions, get_code_activities } = props;
  const { globalData, setGlobalData, activities, setActivitiesSecondaire } =
    useContext(GlobalContext);

  const URL_MRP = import.meta.env.VITE_API_URL_AS;

  // useEffect(() => {
  //   axios
  //     .get(`${URL_MRP}/code_naf/liste_all_code_activite`)
  //     .then((res) => {
  //       setActivitiesSecondaire(res.data?.codes_activites);
  //     })
  //     .catch((err) => message.error(err.response.data.message));
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     get_code_activities(form.getFieldsValue()['code_naf']);
  //   }, [500]);
  // }, []);

  // React.useEffect(() => {
  //   if (form.getFieldsValue()?.capital_protege) {
  //     setCapitalprotege(form.getFieldsValue()?.capital_protege);
  //     setDisabled(false);
  //     setSliderValue(form.getFieldsValue());
  //   }
  // }, []);

  return (
    <div>
      <FormHeader title="Informations complémentaires" number="2" prev={prev} />
      {/* ************ Section Activité ************** */}
      <div className={classes.formContainer}>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={BreifCase} title={"Activité"} />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Code NAF</label>}
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir ce champ.",
                },
              ]}
              name="code_naf"
            >
              <Input
                placeholder="Exp: 2351Z"
                size="large"
                // onBlur={(e) => get_code_activities(e.target.value)}
              />
            </Form.Item>
          </Col>

          {/* ACTIVITé PRINCIPALE */}
          <Col lg={15} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}>Activité Principale</label>
              }
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir ce champ.",
                },
              ]}
              name="code_activite_principale"
              style={{ width: "100%" }}
            >
              {/* {activities.length ? (
                <Select
                  placeholder='Code activité principale'
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  size='large'
                  style={{
                    width: '100%',
                  }}
                  options={activities}
                  onSelect={(e) => {
                    const val = activities.find((ac) => ac.value === e);
                    form.setFieldsValue({
                      ...form.getFieldsValue(),
                      label_activite_principale: val.label,
                    });
                    setGlobalData({
                      ...globalData,
                      label_activite_principale: val.label,
                    });
                  }}
                />
              ) : (
                <Skeleton.Input active={true} size={'large'} block={true} />
              )} */}
              <Input size="large" />
            </Form.Item>
          </Col>
          {/* Dénomination */}
          <Col lg={15} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Dénomination</label>}
              name="denom_principale"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
              ]}
            >
              <Input
                placeholder="Dénomination"
                size="large"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Pourcentage du CA</label>}
              name="pourcentage_ca_principale"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
                () => ({
                  validator(_, value) {
                    if (0 <= value && value <= 100) {
                      return Promise.resolve();
                    } else if (value != null) {
                      return Promise.reject(
                        new Error(`La valeur doit être comprise entre 0 et 100`)
                      );
                    } else {
                      return Promise.reject(new Error());
                    }
                  },
                }),
              ]}
            >
              <InputNumber
                type="number"
                controls={false}
                placeholder="Exp: 23"
                style={{ width: "100%" }}
                size="large"
                addonAfter={<PercentageOutlined style={{ color: "black" }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="activities">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item required={true} key={field.key}>
                  <div className={classes.darkBlock}>
                    <Row gutter={24} className={classes.rowContainer}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          width: "100%",
                        }}
                      >
                        {fields.length > 0 ? (
                          <Tooltip color="red" title="Supprimer l'activité">
                            <MinusCircleOutlined
                              className={classes.minusButton}
                              onClick={() => remove(field.name)}
                            />
                          </Tooltip>
                        ) : null}
                      </div>
                      <Col lg={24} md={12} xs={24}>
                        <Form.Item
                          {...field}
                          name={[field.name, "code_activite_secondaire"]}
                          rules={[
                            {
                              required: true,
                              message: "Veuillez remplir le champ.",
                            },
                          ]}
                          label={
                            <label
                              className={classes.label}
                              style={{ color: "#0D5259" }}
                            >
                              Activité secondaire
                            </label>
                          }
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                      <Col lg={15} md={12} xs={24}>
                        <Form.Item
                          {...field}
                          name={[field.name, "denom_secondaire"]}
                          label={
                            <label
                              className={classes.label}
                              style={{ color: "#0D5259" }}
                            >
                              Dénomination
                            </label>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Veuillez remplir le champ.",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Dénomination"
                            size="large"
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col lg={7} md={12} xs={24}>
                        <Form.Item
                          {...field}
                          name={[field.name, "pourcentage_ca_secondaire"]}
                          label={
                            <label
                              className={classes.label}
                              style={{ color: "#0D5259" }}
                            >
                              Pourcentage du CA
                            </label>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Veuillez remplir le champ.",
                            },
                            () => ({
                              validator(_, value) {
                                if (0 <= value && value <= 100) {
                                  return Promise.resolve();
                                } else if (value != null) {
                                  return Promise.reject(
                                    new Error(
                                      `La valeur doit être comprise entre 0 et 100`
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
                          type="number"
                          controls={false}
                            style={{ width: "100%" }}
                            placeholder="Exp: 23"
                            size="large"
                            addonAfter={
                              <PercentageOutlined style={{ color: "black" }} />
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form.Item>
              ))}
              <Row
                gutter={24}
                className={classes.rowContainer}
                style={{ marginTop: "1.5rem", alignItems: "center" }}
              >
                <Col lg={7} md={12} xs={24}></Col>
                <Col lg={7} md={12} xs={24} style={{ textAlign: "center" }}>
                  <Typography.Text type="danger">
                    Total Pourcentage du % CA : 100%
                  </Typography.Text>
                </Col>
                <Col
                  lg={7}
                  md={12}
                  xs={24}
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "14px",
                  }}
                >
                  {" "}
                  <Form.Item style={{ display: "flex", justifyContent: "end" }}>
                    <Button size="large" type="primary" onClick={() => add()}>
                      <PlusOutlined /> Ajouter Activité
                    </Button>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form.List>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={9} md={12} xs={24}>
            <SectionHeader
              icon={CheckMark}
              title={"Éléments de validation du risque"}
            />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label className={classes.cardLabel}>
              <span style={{ color: "#E00000" }}>*</span> Êtes-vous
              sous-traitant ?
            </label>
            <Form.Item
              style={{ padding: "0" }}
              name="treat_precentage"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
                () => ({
                  validator(_, value) {
                    if (0 <= value && value <= 100) {
                      return Promise.resolve();
                    } else if (value != null) {
                      return Promise.reject(
                        new Error(`La valeur doit être comprise entre 0 et 100`)
                      );
                    } else {
                      return Promise.reject(new Error());
                    }
                  },
                }),
              ]}
            >
              <InputNumber
                size="large"
                type="number"
                controls={false}
                addonAfter={<PercentageOutlined style={{ color: "black" }} />}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <div className={classes.cardTip}>Si non mettre 0</div>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <span style={{ color: "#E00000" }}>* </span> Sous traitez-vous des
              marches ?
            </div>
            <Form.Item
              name="marches_precentage"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
                () => ({
                  validator(_, value) {
                    if (0 <= value && value <= 100) {
                      return Promise.resolve();
                    } else if (value != null) {
                      return Promise.reject(
                        new Error(`La valeur doit être comprise entre 0 et 100`)
                      );
                    } else {
                      return Promise.reject(new Error());
                    }
                  },
                }),
              ]}
            >
              <InputNumber
              type="number"
              controls={false}
                addonAfter={<PercentageOutlined style={{ color: "black" }} />}
                size="large"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <div className={classes.cardTip}>Si non mettre 0</div>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label className={classes.cardLabel}>Jamais assuré ?</label>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="jamais_assure"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["jamais_assure"]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={24}
          className={classes.rowContainer}
          style={{ margin: "2rem 0" }}
        >
          <Col lg={3} md={12} xs={24}></Col>
          <Col lg={18} md={24} xs={24} className={classes.card}>
            <div>
              <label className={classes.cardLabel}>
                Êtes-vous déjà assuré ?
              </label>
              <Form.Item
                style={{ display: "flex", justifyContent: "center" }}
                name="deja_assure"
              >
                <Switch
                  checkedChildren="Oui"
                  unCheckedChildren="Non"
                  defaultChecked={garantieOptions["deja_assure"]}
                />
              </Form.Item>
            </div>
            <Row gutter={24} className={classes.rowContainer}>
              <Col lg={11} md={12} xs={24}>
                <div style={{ margin: ".5rem 0" }}>
                  <span
                    style={
                      garantieOptions["deja_assure"]
                        ? { opacity: "1" }
                        : { opacity: "0.5", cursor: "not-allowed" }
                    }
                  >
                    <span style={{ color: "#E00000" }}>*</span> Depuis combien
                    d'année ?
                  </span>
                </div>
                <Form.Item
                  name="depuis_combien_ans"
                  rules={[
                    {
                      required: garantieOptions["deja_assure"],
                      message: "Veuillez remplir ce champ.",
                    },
                    () => ({
                      validator(_, value) {
                        if (garantieOptions["deja_assure"]) {
                          if (0 <= value && value <= 100) {
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
                        } else {
                          return Promise.resolve();
                        }
                      },
                    }),
                  ]}
                >
                  <Input
                    disabled={!garantieOptions["deja_assure"]}
                    onChange={(e) => {
                      form.setFieldsValue({
                        depuis_combien_ans: e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        ),
                      });
                    }}
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={11} md={12} xs={24}>
                <div style={{ margin: ".5rem 0" }}>
                  <span
                    style={
                      garantieOptions["deja_assure"]
                        ? { opacity: "1" }
                        : { opacity: "0.5", cursor: "not-allowed" }
                    }
                  >
                    <span style={{ color: "#E00000" }}>*</span> ID Assureur
                    précédent
                  </span>
                </div>
                <Form.Item
                  name="id_ssureur_precedent"
                  rules={[
                    {
                      required: garantieOptions["deja_assure"],
                      message: "Veuillez remplir le champ.",
                    },
                  ]}
                >
                  <Input
                    disabled={!garantieOptions["deja_assure"]}
                    placeholder=""
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col lg={3} md={12} xs={24}></Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label
              className={classes.cardLabel}
              style={{ textAlign: "center" }}
            >
              <div style={{ textAlign: "center" }}>
                Avez-vous un contrat en cours ?
              </div>
            </label>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="contrat_cours"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["contrat_cours"]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div>Avez-vous fait l'objet d'une résiliation ?</div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="resiliation_object"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["resiliation_object"]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div>
                {" "}
                <span style={{ color: "#E00000" }}>* </span>Marché privé ?
              </div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="marche_prive"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ.",
                },
                () => ({
                  validator(_, value) {
                    if (1000 <= value && value <= 15000) {
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
              type="number"
              controls={false}
                style={{ width: "100%" }}
                size="large"
                addonAfter={"€"}
              />
            </Form.Item>
            <span className={classes.cardTip}>Entre 1000 et 15000</span>
          </Col>
        </Row>
        <Row
          gutter={24}
          className={classes.rowContainer}
          style={{ marginTop: "2rem" }}
        >
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label className={classes.cardLabel}>
              <div style={{ textAlign: "center" }}>
                Travaux techniques courantes ?
              </div>
            </label>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="travaux_techniques_courantes"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["travaux_techniques_courantes"]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div style={{ textAlign: "center" }}>
                CMI (Constructeur de Maisons Individuelles) ?
              </div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="CMI"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["CMI"]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div>Contractant général ?</div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="contractant_general"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["contractant_general"]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={24}
          className={classes.rowContainer}
          style={{ marginTop: "2rem" }}
        >
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label className={classes.cardLabel}>
              <div>Négoce ?</div>
            </label>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="negoce"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={garantieOptions["negoce"]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div style={{ textAlign: "center" }}>
                Promotion immobilière logements /bureaux/autres ?
              </div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="promotion_immobilière_logements"
            >
              <Switch
                checkedChildren="Oui"
                unCheckedChildren="Non"
                defaultChecked={
                  garantieOptions["promotion_immobilière_logements"]
                }
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div>
                <span style={{ color: "#E00000" }}>*</span> Expérience ?
              </div>
            </div>
            <Form.Item
              style={{ display: "flex", justifyContent: "center" }}
              name="experience"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
              ]}
            >
              <Input
                onChange={(e) => {
                  form.setFieldsValue({
                    experience: e.target.value.replace(/[^0-9]/g, ""),
                  });
                }}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={24}
          className={classes.rowContainerJustified}
          style={{ marginTop: "2rem" }}
        >
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <label className={classes.cardLabel}>
              <div>
                <span style={{ color: "#E00000" }}>*</span> Qualification ?
              </div>
            </label>
            <Form.Item
              name="qualification"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                size="large"
                placeholder="Nomenclature des qualifications"
                options={[
                  {
                    value: "Nomenclature des qualifications",
                    label: "Nomenclature des qualifications",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.card}>
            <div className={classes.cardLabel}>
              <div>
                <span style={{ color: "#E00000" }}>*</span> Diplôme ?
              </div>
            </div>
            <Form.Item
              name="diplome"
              rules={[
                { required: true, message: "Veuillez remplir le champ." },
              ]}
            >
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder="Titre et diplôme"
                options={[
                  { value: "CAP", label: "CAP" },
                  { value: "BEP", label: "BEP" },
                  { value: "Baccalauréat", label: "Baccalauréat" },
                  { value: "DEUG", label: "DEUG" },
                  { value: "DEUST", label: "DEUST" },
                  { value: "Licence", label: "Licence" },
                  {
                    value: "Licence Professionnelle",
                    label: "Licence Professionnelle",
                  },
                  { value: "Maîtrise", label: "Maîtrise" },

                  { value: "Master", label: "Master" },
                  {
                    value: "Diplôme d'études approfondies",
                    label: "Diplôme d'études approfondies",
                  },
                  {
                    value: "Diplôme d'études spécialisées",
                    label: "Diplôme d'études spécialisées",
                  },

                  { value: "Diplôme d'igénieur", label: "Diplôme d'igénieur" },
                  { value: "Doctorat", label: "Doctorat" },
                  {
                    value: "Titre RNCP niveau IV",
                    label: "Titre RNCP niveau IV",
                  },
                  {
                    value: "Titre RNCP niveau V",
                    label: "Titre RNCP niveau V",
                  },
                  {
                    value: "Titre RNCP niveau VI",
                    label: "Titre RNCP niveau VI",
                  },
                  {
                    value: "Titre RNCP niveau VII",
                    label: "Titre RNCP niveau VII",
                  },
                  {
                    value: "Titre RNCP niveau VIII",
                    label: "Titre RNCP niveau VIII",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default InfoComplementaire;
