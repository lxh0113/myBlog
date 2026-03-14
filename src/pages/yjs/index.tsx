import Header from "../home/components/header";
import Quill from "./components/quill";

import { ConfigProvider } from "antd";

import "./index.scss";

export default function Search() {
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
      <div className="yjsHomeBox">
        <Header></Header>
        <Quill></Quill>
      </div>
    </ConfigProvider>
  );
}
