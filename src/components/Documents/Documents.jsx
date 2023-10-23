import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Col, Row } from "antd";
import { useContext, useState } from "react";
import classes from "./Documents.module.css";

import { FormHeader } from "../FormHeader/FormHeader";
import GlobalContext from "../../contexts/GlobalContext";

function Documents(props) {
  const { prev } = props;
  const { docs, setDocs } = useContext(GlobalContext);

  const [fileList, setFileList] = useState({
    KBIS: docs["KBIS"],
    RELINFO: docs["RELINFO"],
    ATTASS: docs["ATTASS"],
    JUSTIFEXP: docs["JUSTIFEXP"],
    JUSTIFQUALIF: docs["JUSTIFQUALIF"],
    JUSTIFDIPLOM: docs["JUSTIFDIPLOM"],
  });

  const handleChange1 = (info, type) => {
    switch (info.file.status) {
      case "uploading":
        type === "KBIS"
          ? setDocs({ ...docs, KBIS: [info.file] })
          : type === "RELINFO"
          ? setDocs({ ...docs, RELINFO: [info.file] })
          : type === "ATTASS"
          ? setDocs({ ...docs, ATTASS: [info.file] })
          : type === "JUSTIFEXP"
          ? setDocs({ ...docs, JUSTIFEXP: [info.file] })
          : type === "JUSTIFQUALIF"
          ? setDocs({ ...docs, JUSTIFQUALIF: [info.file] })
          : setDocs({ ...docs, JUSTIFDIPLOM: [info.file] });

        type === "KBIS"
          ? setFileList({ ...fileList, KBIS: [info.file] })
          : type === "RELINFO"
          ? setFileList({ ...fileList, RELINFO: [info.file] })
          : type === "ATTASS"
          ? setFileList({ ...fileList, ATTASS: [info.file] })
          : type === "JUSTIFEXP"
          ? setFileList({ ...fileList, JUSTIFEXP: [info.file] })
          : type === "JUSTIFQUALIF"
          ? setFileList({ ...fileList, JUSTIFQUALIF: [info.file] })
          : setFileList({ ...fileList, JUSTIFDIPLOM: [info.file] });

        break;
      case "done":
        type === "KBIS"
          ? setDocs({ ...docs, KBIS: [info.file] })
          : type === "RELINFO"
          ? setDocs({ ...docs, RELINFO: [info.file] })
          : type === "ATTASS"
          ? setDocs({ ...docs, ATTASS: [info.file] })
          : type === "JUSTIFEXP"
          ? setDocs({ ...docs, JUSTIFEXP: [info.file] })
          : type === "JUSTIFQUALIF"
          ? setDocs({ ...docs, JUSTIFQUALIF: [info.file] })
          : setDocs({ ...docs, JUSTIFDIPLOM: [info.file] });

        type === "KBIS"
          ? setFileList({ ...fileList, KBIS: [info.file] })
          : type === "RELINFO"
          ? setFileList({ ...fileList, RELINFO: [info.file] })
          : type === "ATTASS"
          ? setFileList({ ...fileList, ATTASS: [info.file] })
          : type === "JUSTIFEXP"
          ? setFileList({ ...fileList, JUSTIFEXP: [info.file] })
          : type === "JUSTIFQUALIF"
          ? setFileList({ ...fileList, JUSTIFQUALIF: [info.file] })
          : setFileList({ ...fileList, JUSTIFDIPLOM: [info.file] });
        break;

      default:
        // error or removed
        type === "KBIS"
          ? setDocs({ ...docs, KBIS: [] })
          : type === "RELINFO"
          ? setDocs({ ...docs, RELINFO: [] })
          : type === "ATTASS"
          ? setDocs({ ...docs, ATTASS: [] })
          : type === "JUSTIFEXP"
          ? setDocs({ ...docs, JUSTIFEXP: [] })
          : type === "JUSTIFQUALIF"
          ? setDocs({ ...docs, JUSTIFQUALIF: [] })
          : setDocs({ ...docs, JUSTIFDIPLOM: [] });

        type === "KBIS"
          ? setFileList({ ...fileList, KBIS: [] })
          : type === "RELINFO"
          ? setFileList({ ...fileList, RELINFO: [] })
          : type === "ATTASS"
          ? setFileList({ ...fileList, ATTASS: [] })
          : type === "JUSTIFEXP"
          ? setFileList({ ...fileList, JUSTIFEXP: [] })
          : type === "JUSTIFQUALIF"
          ? setFileList({ ...fileList, JUSTIFQUALIF: [] })
          : setFileList({ ...fileList, JUSTIFDIPLOM: [] });
    }
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  return (
    <div>
      <FormHeader title="Documents" number="4" prev={prev} />
      <div className={classes.container}>
        <Row gutter={24} className={classes.displayFlex}>
          {Object.keys(fileList).map((type, index) => {
            return (
              <Col
                lg={7}
                md={12}
                xs={24}
                className={classes.centerItems}
                key={index}
              >
                <Upload
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    handleChange1(e, type);
                  }}
                  fileList={fileList[type]}
                  customRequest={dummyRequest}
                  accept="image/png, image/jpeg, application/pdf"
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="large"
                    style={{
                      width: "350px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {type === "KBIS"
                      ? "Importer “Extrait Kbis”"
                      : type === "RELINFO"
                      ? "Importer “Relevé Info”"
                      : type === "ATTASS"
                      ? "Importer “Attestation Assurance”"
                      : type === "JUSTIFEXP"
                      ? "Importer “Justif expérience”"
                      : type === "JUSTIFQUALIF"
                      ? "Importer “Justif Qualification”"
                      : "Importer “Justif Diplôme”"}
                  </Button>
                </Upload>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default Documents;
