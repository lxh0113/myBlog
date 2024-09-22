import "./index.scss";
import {  ConfigProvider } from "antd";

import Header from "../home/components/header";
import Body from "./components/body";

export default function Profile() {
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
      <div className="myProfileHomeBox">
        <Header></Header>
        <Body></Body>
      </div>
    </ConfigProvider>
  );
}
