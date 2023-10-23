import { useContext, useEffect, useState } from "react";
import LogoAsSolutions from "../../assets/Atrias.svg";
import classes from "./Home.module.css";
import {
  message,
  Steps,
  Form,
  FloatButton,
  ConfigProvider,
  Typography,
  notification,
} from "antd";
import InfoPrincipale from "../../components/InfoPrincipale/InfoPrincipale";
import InfoComplementaire from "../../components/InfoComplementaire/InfoComplementaire";
import Tarifications from "../../components/Tarification/Tarifications";
import Documents from "../../components/Documents/Documents";

import GlobalContext from "../../contexts/GlobalContext";
import dayjs from "dayjs";
import { ClearOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home() {
  const [api, contextHolder] = notification.useNotification();
  const {
    globalData,
    setGlobalData,
    docs,
    organisme,
    partnership_id,
    setActivities,
    activities,
  } = useContext(GlobalContext);
  const [current, setCurrent] = useState(
    JSON.parse(sessionStorage.getItem("current")) || 0
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const Navigate = useNavigate();

  const [garantieOptions, setGarantieOptions] = useState(
    JSON.parse(sessionStorage.getItem("garantieOptions")) || {
      resiliation_object: false,
      contrat_cours: false,
      CMI: false,
      contractant_general: false,
      jamais_assure: false,
      deja_assure: false,
      negoce: false,
      promotion_immobilière_logements: false,
      travaux_techniques_courantes: false,
    }
  );

  const get_code_activities = (code_naf) => {
    axios
      .get(`${URL_RCD}/code_naf/liste_code_activite?code_naf=${code_naf}`)
      .then((res) => {
        if (res?.data?.codes_activites.length == 0) {
          message.error(
            "Pardon, on assure pas pour le moments ces type d'activités."
          );
        }

        if (activities.length != 0) {
          setActivities([]);
          form.setFieldsValue({
            ...form.getFieldsValue(),
            code_activite_principale: "",
          });
        }

        let codes_activites = res?.data?.codes_activites;
        let prepare_activities = [];
        codes_activites.forEach((code) => {
          if (code.value && code.label) {
            prepare_activities.push({
              value: code.value,
              label: `${code.label}`,
            });
          }
        });
        if (prepare_activities.length == 1) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            code_activite_principale: codes_activites[0].value,
            label_activite_principale: codes_activites[0].label,
          });
          setGlobalData({
            ...globalData,
            code_activite_principale: codes_activites[0].value,
            label_activite_principale: codes_activites[0].label,
          });
        }
        setActivities(prepare_activities);
        setLabelNaf(res?.data?.codes_activites[0]?.label_naf);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          label_naf: res?.data?.codes_activites[0]?.label_naf,
        });
        setGlobalData({
          ...globalData,
          label_naf: res?.data?.codes_activites[0]?.label_naf,
        });
      })
      .catch((err) => message.error(err.response.data.message));
  };

  const onChange = (formValues) => {
    if (current === 1) {
      const garanties = {
        resiliation_object:
          form.getFieldsValue()["resiliation_object"] || false,
        contrat_cours: form.getFieldsValue()["contrat_cours"] || false,
        CMI: form.getFieldsValue()["CMI"] || false,
        contractant_general:
          form.getFieldsValue()["contractant_general"] || false,
        jamais_assure: form.getFieldsValue()["jamais_assure"] || false,
        deja_assure: form.getFieldsValue()["deja_assure"] || false,
        negoce: form.getFieldsValue()["negoce"] || false,
        promotion_immobilière_logements:
          form.getFieldsValue()["promotion_immobilière_logements"] || false,
        travaux_techniques_courantes:
          form.getFieldsValue()["travaux_techniques_courantes"] || false,
      };
      setGlobalData({
        ...globalData,
        ...garanties,
        elements_risques: { ...garanties },
      });
      setGarantieOptions(garanties);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("garantieOptions", JSON.stringify(garantieOptions));
  }, [garantieOptions]);

  useEffect(() => {
    form.setFieldsValue(
      JSON.parse(sessionStorage.getItem("globalData"))
        ? {
            ...JSON.parse(sessionStorage.getItem("globalData")),
            date_effet: JSON.parse(sessionStorage.getItem("globalData"))
              ?.date_effet
              ? dayjs(
                  JSON.parse(sessionStorage.getItem("globalData")).date_effet
                )
              : dayjs().add(3, "day"),
            ...JSON.parse(sessionStorage.getItem("garantieOptions")),
          }
        : {
            ...form.getFieldsValue(),
            fractionnement:"Fractionnement par Mois",
          }
    );
  }, []);

  useEffect(() => {
    sessionStorage.setItem("current", JSON.stringify(current));

    if (current === 5) {
      setDisabled(false);
    }
  }, [current]);

  const next = () => {
    if (current === 1) {
      const formValues = form.getFieldsValue();
      let tempPercentage = formValues.pourcentage_ca_principale;
      formValues?.activities?.forEach((elem) => {
        tempPercentage = tempPercentage + elem.pourcentage_ca_secondaire;
      });
      if (tempPercentage !== 100) {
        return api["error"]({
          message: "Erreur",
          description: (
            <>
              <span>
                La somme des pourcentages des chiffres d'affaires doit être de
                100%.
              </span>
              {/* <br />
              Pourcentage actuel: {tempPercentage}% */}
            </>
          ),

          style: { backgroundColor: "#fff2f0", border: "1px solid #ffccc7" },
        });
      }
      if (garantieOptions["travaux_techniques_courantes"]) {
        return api["error"]({
          message: "Erreur",
          description: (
            <>
              <span>Travaux techniques courantes doit être "Non"</span>
              {/* <br />
              Pourcentage actuel: {tempPercentage}% */}
            </>
          ),

          style: { backgroundColor: "#fff2f0", border: "1px solid #ffccc7" },
        });
      }
    }
    setGlobalData({ ...globalData, ...form.getFieldsValue() });
    setCurrent(current + 1);
  };

  const prev = () => {
    setGlobalData({ ...globalData, ...form.getFieldsValue() });
    setCurrent(current - 1);
  };

  const URL_RCD = import.meta.env.VITE_API_URL_AS;

  const steps = [
    {
      title: "Informations principales",
      content: <InfoPrincipale form={form} />,
    },
    {
      title: "Informations complémentaires",
      content: (
        <InfoComplementaire
          prev={prev}
          form={form}
          garantieOptions={garantieOptions}
        />
      ),
    },
    {
      title: "Tarifications",
      content: (
        <Tarifications
          prev={prev}
          garantieOptions={garantieOptions}
          setGarantieOptions={setGarantieOptions}
          form={form}
          setDisabled={setDisabled}
          disabled={disabled}
        />
      ),
    },

    {
      title: "Documents",
      content: <Documents prev={prev} />,
    },
  ];

  const geoprod_url = import.meta.env.VITE_API_GEOPROD_URL;
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  // HANDLE SUBSCRIBE
  const handleSouscription = () => {
    form
      .validateFields()
      .then((promise) => {
        setLoading(true);
        // ID GAMME is the "organisme" variable provided from the CONTEXT
        // Consult for editique payloads on the constant folder.

        const dataPIB = {
          adresse_complete_assure: globalData._adresse,
          code_postal_assure: globalData.code_postal,
          num_siren: globalData.siren,
          raison_sociale_assure: globalData.raison_sociale,
          ville_assure: globalData._ville,
        };

        const dataIAC = {
          code_naf: globalData.code_naf,
          souscription_contrat: globalData?.nom + " " + globalData.prenom,
          voie: globalData?._adresse,
          code_postal: globalData?._code_postal,
          commune: globalData?._ville,
          numero_siren: globalData?.siren,
          description_activite_principale: globalData?.code_activite_principale,
          nom_compagnie_assurance: "",
        };

        const dataCMI = {
          code_naf: globalData.code_naf,
          souscription_contrat: globalData?.nom + " " + globalData.prenom,
          voie: globalData?._adresse,
          code_postal: globalData?._code_postal,
          commune: globalData?._ville,
          numero_siren: globalData?.siren,
          description_activite_principale: globalData?.code_activite_principale,
          nom_compagnie_assurance: "",
        };

        axios
          .post(
            "https://ws-pre-prod.as-solution.cloud.geoprod.com/atrias/subscribe_atrias",
            {
              type_prospect: "prospect professionnel rc",
              gamme: organisme,
              prospect_data: {
                nom: globalData?.nom,
                prenom: globalData?.prenom,
                ville: globalData?._ville,
                adresse_mail: globalData?.souscripteur_email,
                // UNKNOWN FIELDS
                civilite: "",
                codepostal: globalData?._code_postal,
                streetname: globalData?._adresse,
                mobile: globalData?.téléphone,
                date_effet: moment(globalData?.date_effet).format("YYYY-MM-DD"),
              },
              RS: globalData.raison_sociale,
              FJ: "",
              num_siret: globalData?.siren,
              code_naf: globalData.code_naf,
              objet_assure: {
                adresse_risque: globalData?.adresse_siege,
                complement_adresse: globalData?.complement_adresse,
                ville_risque: globalData?.ville,
                // UNKNOWN FIELDS
                cout: "1",
                // UNKNOWN FIELDS
                idObject: "1",
                // UNKNOWN FIELDS
                nbr_logement: "1",
                // UNKNOWN FIELDS
                declaration: "1",
                // UNKNOWN FIELDS
                type_construction: "1",
                // UNKNOWN FIELDS
                destination: "1",
                // UNKNOWN FIELDS
                piscine: "1",
                // UNKNOWN FIELDS
                nombre_batiment: "1",
                // UNKNOWN FIELDS
                surface: "1",
                // UNKNOWN FIELDS
                pays: "1",
                code_post_risque: globalData?.code_postal,
              },
              // EDITIQUE PRINT FIELDS
              data_fields:
                organisme ===
                import.meta.env.VITE_API_INTERVENANT_AU_CHANTIER_ID
                  ? dataIAC
                  : organisme ===
                    import.meta.env
                      .VITE_API_PROFESSIONS_INTELLECTUELLES_DES_BATIMENTS
                  ? dataPIB
                  : dataCMI,
            },
            {
              headers: {
                apiKey: partnership_id,
              },
            }
          )
          .then((response) => {
            if (response.data.id_affaire) {
              console.log(response.data.id_affaire);
              let config = {
                headers: {
                  Authorization: `Bearer 2a0ba616-dc38-18f-ff0-e5207c45a808`,
                },
              };
              axios.post(`${geoprod_url}login`, {}, config).then((res) => {
                let token = res.data.Acces_Token;
                const kbis = import.meta.env.VITE_API_KBIS_ID;
                const relinfo = import.meta.env.VITE_API_RELINFO_ID;
                const attass = import.meta.env.VITE_API_ATTASS_ID;
                const justifexp = import.meta.env.VITE_API_JUSTIFEXP_ID;
                const justifqualif = import.meta.env.VITE_API_JUSTIFQUALIF_ID;
                const justifdiplom = import.meta.env.VITE_API_JUSTIFDIPLOM_ID;
                var counter = 0;
                Object.keys(docs).forEach((doc, index) => {
                  if (docs[doc][0]?.originFileObj) {
                    const formfile = new FormData();
                    formfile.append(
                      "id_type_doc",
                      doc === "KBIS"
                        ? kbis
                        : doc === "RELINFO"
                        ? relinfo
                        : doc === "ATTASS"
                        ? attass
                        : doc === "JUSTIFEXP"
                        ? justifexp
                        : doc === "JUSTIFQUALIF"
                        ? justifqualif
                        : justifdiplom
                    );
                    formfile.append("id_affaire", response.data.id_affaire);
                    formfile.append(
                      "file[]",
                      docs[doc][0]?.originFileObj,
                      docs[doc][0]?.name
                    );
                    axios
                      .post(geoprod_url + "upload_document_affaire", formfile, {
                        headers: {
                          idSession: token,
                        },
                      })
                      .then((res) => {
                        counter = counter + 1;
                        if (counter == 6) {
                          message.success("Action terminée avec succès !");
                          Navigate(
                            "/success/?id_gamme=" +
                              organisme +
                              "/?partnership_id=" +
                              partnership_id
                          );
                        }
                      })
                      .catch((err) => {
                        setLoading(false);
                        message.error("Something went very wrong !");
                        console.log(err);
                      });
                  } else {
                    counter = counter + 1;
                    if (counter == 6) {
                      Navigate(
                        "/success/?id_gamme=" +
                          organisme +
                          "/?partnership_id=" +
                          partnership_id
                      );
                    }
                  }
                });
              });
            } else {
              setLoading(false);
              message.error("ID AFFAIRE UNDEFINED!");
            }
            message.success("Action terminée avec succès !");
            // Navigate(
            //   "/success/?id_gamme=" +
            //     organisme +
            //     "/?partnership_id=" +
            //     partnership_id
            // );
          })
          .catch((err) => {
            // console.log(err);
            setLoading(false);
            message.error("Something went very wrong !");
          });
      })
      .catch((error) => {
        setLoading(false);
        message.error(error);
      });
  };

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
      {contextHolder}
      {loading && (
        <div className={classes.loaderContainer}>
          <h2 style={{ color: "white" }}>Veuillez patienter un instant</h2>

          <CustomLoader />
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={() => {
          message.error("Vérifier tous les champs !");
        }}
        onFinish={() => {
          next();
        }}
        onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
        onValuesChange={onChange}
        className={classes.stepperContainer}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#e30613",
            },
            components: {
              Steps: {
                colorText: "#e30613",
              },
            },
          }}
        >
          <Steps
            className={classes.stepper}
            current={current}
            onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            items={items}
          />
        </ConfigProvider>

        <div className={classes.contentStyle}>{steps[current].content}</div>

        <div className={classes.holder}>
          <div className={classes.btnsHolder}>
            {current === steps.length - 1 && (
              <button
                type="button"
                className={classes.btnNext}
                onClick={handleSouscription}
              >
                Soumettre la souscription
              </button>
            )}
            {current > 0 && current < steps.length - 1 && (
              <button
                className={disabled ? classes.btnPrevDisabled : classes.btnPrev}
                disabled={disabled}
                type="button"
                onClick={() => prev()}
              >
                Retour
              </button>
            )}
            {current < steps.length - 1 && (
              <button
                className={disabled ? classes.btnPrevDisabled : classes.btnNext}
                type="submit"
                disabled={disabled}
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      </Form>
      <FloatButton
        type="primary"
        icon={<ClearOutlined />}
        tooltip={<div>Remise à zero</div>}
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default Home;
