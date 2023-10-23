import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import GlobalContext from "./GlobalContext";

const AppContext = (props) => {
  const [activities, setActivities] = useState([]);
  const [activitiesSecondaire, setActivitiesSecondaire] = useState([]);
  const [value, setValue] = useState("Propriétaire Occupant");
  const [globalData, setGlobalData] = useState(
    JSON.parse(sessionStorage.getItem("globalData")) || {
      fractionnement:"Fractionnement par Mois"
    }
  );

  const [docs, setDocs] = useState({
    KBIS: [],
    RELINFO: [],
    ATTASS: [],
    JUSTIFEXP: [],
    JUSTIFQUALIF: [],
    JUSTIFDIPLOM: [],
  });

  // Get the current URL
  const url = new URL(window.location.href);

  // Get the query parameters
  const searchParams = new URLSearchParams(url.search);

  // const { organisme } = useParams();
  const organisme = searchParams?.get("id_gamme")?.split("/")[0];
  const partnership_id = searchParams
    ?.get("id_gamme")
    ?.split("/")[1]
    ?.split("=")[1];

  useEffect(() => {
    if (window.location.pathname === "/") {
      if (
        (organisme === import.meta.env.VITE_API_INTERVENANT_AU_CHANTIER_ID ||
          organisme ===
            import.meta.env
              .VITE_API_PROFESSIONS_INTELLECTUELLES_DES_BATIMENTS ||
          organisme === import.meta.env.VITE_API_PHOTOVOLTAIQUE) &&
        partnership_id
      ) {
        message.success("Bienvenue dans le parcours RCD ATRIAS");
      } else {
        window.location = `${import.meta.env.VITE_API_PRCOURS_URL}not-found`;
      }
    }
  }, [organisme, partnership_id]);

  useEffect(() => {
    sessionStorage.setItem("globalData", JSON.stringify(globalData));
  }, [globalData]);

  return (
    <GlobalContext.Provider
      value={{
        globalData,
        docs,
        setDocs,
        setGlobalData,
        activities,
        setActivities,
        activitiesSecondaire,
        value,
        setValue,
        setActivitiesSecondaire,
        organisme,
        partnership_id,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
