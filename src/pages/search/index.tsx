import Header from "../home/components/header";
import SearchInput from "./components/searchInput";
import Content from "./components/content";

import {  ConfigProvider } from "antd";

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
      <div className="mySearchHomeBox">
        <Header></Header>
        <SearchInput></SearchInput>
        <Content></Content>
      </div>
    </ConfigProvider>
  );
}
