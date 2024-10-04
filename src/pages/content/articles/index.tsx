import "./index.scss";
import { message, Tabs } from "antd";
import type { TabsProps } from "antd";

import Artictle from "../../home/components/article";
import User from "../../search/components/user";
import Collect from "../collect";
import Column from "../column";
import { useEffect, useState } from "react";
import { ArticleInfo, Collection } from "../../../types";
import {
  getArticlesByUserIdAPI,
  getAuditArticleAPI,
  getDraftArticleAPI,
} from "../../../apis/article";
import useUserStore from "../../../stores/user";
import { getMyFansAPI, getMyFollowsAPI } from "../../../apis/fans";
import { UserDetails } from "../../../types/index";
import { getAllColumnsAPI } from "../../../apis/column";
import { getCollectionByUserIdAPI } from "../../../apis/collection";

export default function Articles() {
  const [key, setKey] = useState(1);

  const onChange = (key: string) => {
    console.log(key);
    setKey(parseInt(key));
  };

  const [articleList, setArticleList] = useState<ArticleInfo[]>([]);

  const user = useUserStore((state: any) => state.user);

  const [userList, setUserList] = useState<UserDetails[]>([]);

  const [collectionList,setCollectionList] = useState<Collection[]>([]);

  const [flag,setFlag]=useState(0)

  useEffect(() => {
    if (key === 1) {
      // 获取所有文章
      const getAllArticles = async () => {
        const res = await getArticlesByUserIdAPI(user.id);

        if (res.data.code === 200) {
          console.log(res.data.data);
          setArticleList(res.data.data);
        }
      };

      getAllArticles();
    } else if (key === 2) {
      // 获取草稿
      const getDraftArticle = async () => {
        const res = await getDraftArticleAPI(user.id);

        if (res.data.code === 200) {
          console.log(res.data.data);
          setArticleList(res.data.data);
        }
      };

      getDraftArticle();
    } else if (key === 3) {
      // 待审核
      const getAuditArticles = async () => {
        const res = await getAuditArticleAPI(user.id);

        if (res.data.code === 200) {
          console.log(res.data.data);
          setArticleList(res.data.data);
        }
      };

      getAuditArticles();
    } else if (key === 4) {
      // 关注
      const getMyFollows = async () => {
        const res = await getMyFollowsAPI(user.id);

        if (res.data.code === 200) {
          console.log(res.data.data);
          setUserList(res.data.data);
        } else message.error(res.data.msg);
      };

      getMyFollows();
    } else if (key === 5) {
      // 粉丝
      const getMyFans = async () => {
        const res = await getMyFansAPI(user.id);

        if (res.data.code === 200) {
          console.log(res.data.data);
          setUserList(res.data.data);
        } else message.error(res.data.msg);
      };

      getMyFans();
    } else if (key === 6) {
      // 获取收藏夹以及收藏
      const getCollection =async () => {
        const res =await getCollectionByUserIdAPI(user.id);

        if(res.data.code===200){
          setCollectionList(res.data.data)
        }
        else message.error(res.data.msg)
      };

      getCollection();
    } else {
      // 专栏
      const getColumns = async () => {
        const res = await getAllColumnsAPI(user.id);
        if (res.data.code === 200) {
          setColumnList(res.data.data);
        } else message.error(res.data.msg);
      };

      getColumns();
    }
  }, [key,flag]);

  const [columnsList, setColumnList] = useState<Collection[]>();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "所有文章",
      children: articleList.map((item) => {
        return <Artictle key={item.article!.id} article={item}></Artictle>;
      }),
    },
    {
      key: "2",
      label: "草稿",
      children: articleList.map((item) => {
        return <Artictle key={item.article!.id} article={item}></Artictle>;
      }),
    },
    {
      key: "3",
      label: "待审核",
      children: articleList.map((item) => {
        return <Artictle key={item.article!.id} article={item}></Artictle>;
      }),
    },
    {
      key: "4",
      label: "关注",
      children: userList.map((item, index) => {
        return <User setFlag={()=>setFlag(flag+1)} key={index} user={item}></User>;
      }),
    },
    {
      key: "5",
      label: "粉丝",
      children: userList.map((item, index) => {
        return <User setFlag={()=>setFlag(flag+1)} key={index} user={item}></User>;
      }),
    },
    {
      key: "6",
      label: "收藏",
      children: collectionList.map((item) => {
        return <Collect key={item.id} collect={item}></Collect>;
      }),
    },
    {
      key: "7",
      label: "专栏",
      children: columnsList?.map((item) => {
        return <Column key={item.id} column={item}></Column>;
      }),
    },
  ];

  return (
    <div className="myContentArticleBox">
      <Tabs
        size={"large"}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
