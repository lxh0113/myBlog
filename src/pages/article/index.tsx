import "./index.scss";

import Header from "../home/components/header";
// import "../home/components/css/"
import Content from "./components/content";

import { ConfigProvider, message } from "antd";
import { useEffect } from "react";
import { addBrowseAPI } from "../../apis/browse";
import { useParams } from "react-router-dom";
import useUserStore from "../../stores/user";

export default function Article() {
  const param = useParams();
  const user = useUserStore((state: any) => state.user);

  // 看文章
  useEffect(() => {
    // alert(1)
    const browse =async () => {
      const res = await addBrowseAPI({
        id: null,
        articleId: parseInt(param.id as string),
        userId: user.id,
      });

      if(res.data.code===200){

      }
      else message.error(res.data.msg)
    };

    browse();
  }, []);

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
