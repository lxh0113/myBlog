import "./index.scss";

import { ConfigProvider } from "antd";
import Header from "../home/components/header";
import Content from "./components/content";

export default function Message() {
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
      <div className="myMessageHomeBox">
        <Header></Header>
        <Content></Content>
      </div>
    </ConfigProvider>
  );
}
