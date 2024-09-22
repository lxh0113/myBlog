import "./index.scss";

import { ConfigProvider } from "antd";
import Header from "../home/components/header";
import UserInfo from "./userInfo";
import Articles from './articles'

export default function Content() {
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
        <div className="myContentHomeBox">
            <Header></Header>
            <UserInfo></UserInfo>
            <Articles></Articles>
        </div>
    </ConfigProvider>
  );
}
