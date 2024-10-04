import "./index.scss";

import { message, Tabs } from "antd";
import type { TabsProps } from "antd";

import Article from "../../../home/components/article";

import User from "../user";

import SearchColumns from "../columns";
import { useEffect, useState } from "react";
import { SearchColumn, UserDetails } from "../../../../types";
import { searchArticleAPI } from "../../../../apis/article";
import { useParams } from "react-router-dom";
import useUserStore from "../../../../stores/user";
import { searchUserAPI } from "../../../../apis/user";
import { searchColumnAPI } from "../../../../apis/column";

export default function searchContent() {
  const [key, setKey] = useState("1");

  const onChange = (key: string) => {
    console.log(key);
    setKey(key);
  };

  const [articleList, setArticleList] = useState([]);

  const [userList, setUserList] = useState<UserDetails[]>([]);

  const [columnsList, setColumnList] = useState<SearchColumn[]>([]);

  const param = useParams();
  const user = useUserStore((state: any) => state.user);

  useEffect(() => {
    console.log(param);
    if (key === "1") {
      // 这个是文章
      const getArticle = async () => {
        const res = await searchArticleAPI(param.word!, user.id);

        if (res.data.code === 200) {
          setArticleList(res.data.data);
        } else message.error(res.data.msg);
      };

      getArticle();
    } else if (key === "2") {
      const getUser = async () => {
        const res = await searchUserAPI(param.word!, user.id);

        if (res.data.code === 200) {
          setUserList(res.data.data);
        } else message.error(res.data.msg);
      };

      getUser();
    } else if (key === "3") {
      const getColumn = async () => {
        const res = await searchColumnAPI(param.word!);

        if (res.data.code === 200) {
          setColumnList(res.data.data)
        } else message.error(res.data.msg);
      };

      getColumn();
    }
  }, [key, param.word]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "文章",
      children: articleList.map((item, index) => {
        return <Article key={index} article={item}></Article>;
      }),
    },
    {
      key: "2",
      label: "用户",
      children: userList.map((item, index) => {
        return <User key={index} user={item}></User>;
      }),
    },
    {
      key: "3",
      label: "专栏",
      children: columnsList.map((item) => {
        return <SearchColumns key={item.column?.id} column={item}></SearchColumns>;
      }),
    },
  ];

  return (
    <div className="mySearchContentBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
