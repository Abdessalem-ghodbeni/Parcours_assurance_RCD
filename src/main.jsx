import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/Home";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppContext from "./contexts/AppContext";
import NotFound from "./components/NotFound/NotFound";
import Success from "./pages/Home/Success";
import { ConfigProvider } from "antd";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/success/",
    element: <Success />,
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppContext>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0D5259",
        },
        components: {
          Button: {
            colorPrimaryBorder: "#508080",
            controlOutlineWidth: 0,
          },
          Switch: {
            controlHeight: 32,
            fontSize: 18,
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </AppContext>
);
