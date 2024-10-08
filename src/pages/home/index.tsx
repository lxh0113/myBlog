import Header from "./components/header";
import Body from "./components/body";

import {  ConfigProvider } from "antd";

import { Outlet } from "react-router-dom";

import "./index.scss";

export default function Home() {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#ff4d4f",
          borderRadius: 4,
          // 派生变量，影响范围小
          colorBgContainer: "#fff",
        },
      }}
    >
      <div className="homeBody">
        <Header></Header>
        <Body></Body>
        <Outlet></Outlet>
      </div>
    </ConfigProvider>
  );
}
