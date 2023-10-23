import { ConfigProvider, Slider } from "antd";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";

function SliderComponent(props) {
  const { globalData, setGlobalData } = useContext(GlobalContext);
  const { marks, max, min, defValue, fieldName } = props;
  const [franchise, setFranchise] = useState(defValue);
  useEffect(() => {
    if (fieldName === "franchise") {
      switch (defValue) {
        case 500:
          setFranchise(500);
          break;
        case 1000:
          setFranchise(1000);
          break;
        case 1500:
          setFranchise(1500);
          break;
        case 2000:
          setFranchise(2000);
          break;
        case 2500:
          setFranchise(2500);
          break;
      }
    }
  }, [defValue]);
  const onChange = (value) => {
    if (fieldName === "franchise") {
      let val = 0;
      switch (value) {
        case 500:
          val = 500;
          break;
        case 1000:
          val = 1000;
          break;
        case 1500:
          val = 1500;
          break;
        case 2000:
          val = 2000;
          break;
        case 2500:
          val = 2500;
          break;
      }
      setGlobalData({ ...globalData, franchise: val });
    } else {
      setGlobalData({ ...globalData, commission: value });
    }
  };
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#e30613",
          },
          components: {
            Slider: {
              railSize: 10,
              controlSize: 10,
              dotSize: 20,
              handleSize: 15,
            },
          },
        }}
      >
        <Slider
          onChange={onChange}
          min={min}
          max={max}
          step={null}
          marks={marks}
          defaultValue={fieldName === "franchise" ? franchise : defValue}
          tooltip={{ open: false }}
        />
      </ConfigProvider>
    </div>
  );
}

export default SliderComponent;
