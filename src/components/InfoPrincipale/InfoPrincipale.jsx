import classes from "./InfoPrincipale.module.css";
import Societe from "../../assets/Societe.png";
import Location from "../../assets/location.png";
import Souscripteur from "../../assets/souscripteur.png";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Col,
  Row,
  Select,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import { FormHeader } from "../FormHeader/FormHeader";
import SectionHeader from "./SectionHeader/SectionHeader";
import axios from "axios";
import { useState } from "react";
import { useContext, useEffect } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { PhoneOutlined } from "@ant-design/icons";

const { Search } = Input;

const dateFormatList = ["DD-MM-YYYY", "yyyy-MM-dd"];

function InfoPrincipale(props) {
  const { globalData, setGlobalData } = useContext(GlobalContext);
  const { form } = props;
  const [villes, setVilles] = useState([]);
  const [_villes, set_Villse] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [minDate, setMinDate] = useState(null);

  const fillInputs = (res) => {
    let code_naf =
      res.data.unite_legale.activite_principale.split(".")[0] +
      res.data.unite_legale.activite_principale.split(".")[1];

    const data = {
      raison_sociale: res.data.unite_legale.denomination,
      code_naf: code_naf,
      code_postal: res.data.unite_legale.etablissement_siege.code_postal,
      adresse_siege:
        res.data.unite_legale.etablissement_siege?.numero_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.type_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.libelle_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.code_postal +
        " " +
        res.data.unite_legale.etablissement_siege?.libelle_commune,
      code_activite_principale: "",
      NUM_SIRET_1: res.data.unite_legale.etablissement_siege.siret,
    };

    sessionStorage.setItem(
      "siret",
      res.data.unite_legale.etablissement_siege.siret
    );

    form.setFieldsValue({ ...form.getFieldsValue(), ...data });
    // get_code_activities(code_naf);
    setGlobalData({
      ...globalData,
      ...data,
      NUM_SIRET_1: res.data.unite_legale.etablissement_siege.siret,
    });
    // ACTITIES CODES
    // get_code_activities(code_naf);

    getVilles({
      target: {
        value: res.data.unite_legale.etablissement_siege.code_postal,
      },
    });
    setDisabled(false);
  };

  // useEffect(() => {
  //   const currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() + 3);

  //   const formattedMinDate = currentDate.toISOString().split("T")[0];

  //   // Set the min date
  //   setMinDate(formattedMinDate);
  // }, []);

  const disabledDate = (current) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);

    const formattedMinDate = currentDate.toISOString().split("T")[0];
    console.log(formattedMinDate);
    return formattedMinDate;
  };

  // SIRREN API
  const onSearch = (value) => {
    setDisabled(true);
    const URL = import.meta.env.VITE_API_URL_SIREN + value;
    axios
      .get(URL)
      .then((res) => {
        fillInputs(res);
      })
      .catch((err) => {
        if (err?.response?.data?.message !== "Invalid data") {
          const URL_NEO = import.meta.env.VITE_API_NEO_URL_SIREN + value;
          axios
            .get(URL_NEO)
            .then((res) => {
              fillInputs(res);
              setDisabled(false);
            })
            .catch((err) => {
              message.error("Vérifiez le siren que vous avez saisie !");
              setDisabled(false);
            });
        } else {
          message.error(
            err.response.data.message === "Invalid data"
              ? "Vérifiez le siren que vous avez saisie !"
              : err.response.data.message
          );
          setDisabled(false);
        }
      });
  };

  // GET VILLS BY CODE POSTAL
  const get_villes_by_code_postal = (code_postal) => {
    if (code_postal.length > 4) {
      const URL = import.meta.env.VITE_API_URL_AS;
      let ville_names = [];
      axios
        .post(`${URL}/groupe_villes/get_villes_by_code_postal`, {
          postal_code: code_postal,
        })
        .then((res) => {
          if (res.data == "list index out of range") {
            set_Villse([]);

            form.setFieldsValue({
              ...form.getFieldsValue(),
              _ville: "",
            });
          } else {
            res.data.villes.forEach((ville) => {
              ville_names.push({
                value: ville?.nom_comm,
                label: ville?.nom_comm,
              });
            });
            set_Villse(ville_names);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              _ville: ville_names[0]?.value,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const onTypeDate = (event) => {
    let val = event.target.value;
    if ((val.length == 2 || val.length == 5) && val.length != 10) {
      event.target.value = val + "/";
    } else if (val.length == 10 && disabledDate(val)) {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        date_effet: dayjs(val, "DD-MM-YYYY"),
      });
    }
  };
  // GET VILLS
  const getVilles = (e) => {
    if (e.target.value.length > 4) {
      const URL = import.meta.env.VITE_API_URL_AS;
      let ville_names = [];
      axios
        .post(`${URL}/groupe_villes/get_villes_by_code_postal`, {
          postal_code: e.target.value,
        })
        .then((res) => {
          if (res.data == "list index out of range") {
            set_Villse([]);

            form.setFieldsValue({
              ...form.getFieldsValue(),
              ville: "",
            });
          } else {
            res.data.villes.forEach((ville) => {
              ville_names.push({
                value: ville?.nom_comm,
                label: ville?.nom_comm,
              });
            });
            setVilles(ville_names);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ville: ville_names[0]?.value,
            });
          }
        })
        .catch((err) => message.error(err.response.data.message));
    }
  };

  return (
    <div>
      <FormHeader title="Informations principales" number="1" />
      <div className={classes.formContainer}>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={Souscripteur} title={"Souscripteur"} />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="nom"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le nom.",
                },
                {
                  pattern: new RegExp(
                    /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i
                  ),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Nom</label>}
            >
              <Input size="large" placeholder="Nom" />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="prenom"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le prénom.",
                },

                {
                  pattern: new RegExp(
                    /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i
                  ),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Prénom</label>}
            >
              <Input size="large" placeholder="Prénom" />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="_adresse"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir l'adresse.",
                },
              ]}
              label={<label className={classes.label}>Adresse</label>}
            >
              <Input
                size="large"
                placeholder="Exemple : Bureau de Poste - 8 rue moliere"
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="_code_postal"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le code postale.",
                },
              ]}
              label={<label className={classes.label}>Code Postal</label>}
            >
              <Input
                placeholder="Exemple : 75001"
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    _code_postal: e.target.value.replace(/[^0-9]/g, ""),
                  });
                }}
                onBlur={(e) => {
                  get_villes_by_code_postal(e.target.value);
                }}
              />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="_ville"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir la ville.",
                },
              ]}
              label={<label className={classes.label}>Ville</label>}
            >
              <Select
                placeholder="Ville"
                size="large"
                style={{
                  width: "100%",
                }}
                options={_villes}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="souscripteur_email"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir ce champ",
                },
                {
                  pattern: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
                  message: "Veuillez verifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Email</label>}
            >
              <Input size="large" placeholder="Exemple@domaine.com" />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="téléphone"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir ce champ",
                },
                {
                  pattern: new RegExp(/^(?!0+$|123456789$)\d+$/),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Numéro Téléphone</label>}
            >
              <Input
                placeholder="Exemple: 0612398745"
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    téléphone: e.target.value.replace(/[^0-9 -]/g, ""),
                  });
                }}
                controls={false}
                addonAfter={<PhoneOutlined style={{ color: "black" }} />}
                prefix="+33"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ************ Section Sociéte ************** */}
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={Societe} title={"Société"} />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="siren"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le SIREN.",
                },
              ]}
              label={<label className={classes.label}>SIREN</label>}
            >
              <Search
                type="number"
                disabled={disabled}
                placeholder="Exp: 1245893677"
                size="large"
                // SIREN API
                onSearch={onSearch}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="raison_sociale"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le raison sociale.",
                },
              ]}
              label={<label className={classes.label}>Raison Sociale</label>}
            >
              <Input size="large" placeholder={"Exp: X12-89"} />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="rcs"
              label={<label className={classes.label}>RCS</label>}
            >
              <Input size="large" placeholder={"Exp: 1245jk"} />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Représentée par</label>}
              name="representant"
            >
              <Input size="large" placeholder={"Nom & Prénom"} />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>En qualité de</label>}
              name="en_qualite_de"
            >
              <Select size="large">
                <Select.Option value="Président">Président</Select.Option>
                <Select.Option value="Directeur général">
                  Directeur général
                </Select.Option>
                <Select.Option value="Directeur général délégué">
                  Directeur général délégué
                </Select.Option>
                <Select.Option value="Gérant">Gérant</Select.Option>
                <Select.Option value="Mandataire social">
                  Mandataire social
                </Select.Option>
                <Select.Option value="Responsable légal">
                  Responsable légal
                </Select.Option>
                <Select.Option value="Entrepreneur individuel">
                  Entrepreneur individuel
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="chiffre_affaire"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le chiffre d'affaire.",
                },
                () => ({
                  validator(_, value) {
                    if (0 < value) {
                      return Promise.resolve();
                    } else if (value != null) {
                      return Promise.reject(
                        new Error(`La valeur doit être supérieur a 0`)
                      );
                    } else {
                      return Promise.reject(new Error());
                    }
                  },
                }),
              ]}
              label={<label className={classes.label}>Chiffre d’affaire</label>}
            >
              <InputNumber
                type="number"
                controls={false}
                style={{ width: "100%" }}
                size="large"
                placeholder={"Exp : 150000€"}
                addonAfter={"€"}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Date d'effet</label>}
              name="date_effet"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir la date d'effet",
                },
              ]}
            >
              <Input
                type="date"
                // placeholder="jour/mois/année"
                // onKeyDown={onTypeDate}
                // min={minDate}
                min={disabledDate()}
                // inputReadOnly={true}
                size="large"
                value={dayjs(form.getFieldsValue().date_effet).format(
                  "yyyy-MM-dd"
                )}
                // disabledDate={disabledDate}
                style={{ width: "100%", height: "100%" }}
                // format={dateFormatList[0]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ************ Section Adresse ************** */}
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={Location} title={"Adresse"} />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Adresse du risque</label>}
              name="adresse_siege"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir l'adresse du risque.",
                },
              ]}
            >
              <Input placeholder="Exp: 5 rue les oranges" size="large" />
            </Form.Item>
          </Col>
          <Col lg={16} md={12} xs={24} style={{ paddingLeft: "2.8rem" }}>
            <Form.Item
              label={
                <label className={classes.label}>Complément d'adresse</label>
              }
              name="complement_adresse"
            >
              <Input size="large" placeholder={"Exp: App 5 Block B"} />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24} className={classes.hiddenBlock}></Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="code_postal"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le code postal.",
                },
              ]}
              label={<label className={classes.label}>Code Postal</label>}
            >
              <Input
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    code_postal: e.target.value.replace(/[^0-9]/g, ""),
                  });
                }}
                placeholder={"Exp: 82000"}
                onBlur={getVilles}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="ville"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir la ville.",
                },
              ]}
              label={<label className={classes.label}>Ville</label>}
            >
              <Select
                placeholder="Ville"
                size="large"
                style={{
                  width: "100%",
                }}
                options={villes}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item label={<label className={classes.label}>Pays</label>}>
              <Select size="large" defaultValue="1">
                <Select.Option value="1">France</Select.Option>
                <Select.Option value="2">Tunisia</Select.Option>
                <Select.Option value="3">Canada</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default InfoPrincipale;
