import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/index";

import zhCN from 'antd/locale/zh_CN';
import {  ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router}></RouterProvider>
  </ConfigProvider>
);
