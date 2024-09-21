import "./index.scss";

import Header from "../home/components/header";
import Content from "./components/content";

import { ConfigProvider } from "antd";

export default function Article() {
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
      <div className="articleBox">
        <Header></Header>
        <Content></Content>
      </div>
    </ConfigProvider>
  );
}
