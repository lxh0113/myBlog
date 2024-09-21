
import "../edit/index.scss"

import Header from "../home/components/header";
import MyEditor from "../edit/componets/editor"

import Settings from "./componets/settings";
import Buttom from "./componets/bottom";

import {  ConfigProvider } from "antd";


export default function Edit(){

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
        <MyEditor></MyEditor>
        <Settings></Settings>
        <Buttom></Buttom>
      </div>
    </ConfigProvider>
    )
}