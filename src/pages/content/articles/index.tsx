import "./index.scss";
import { Col, Tabs } from "antd";
import type { TabsProps } from "antd";

import url from "../../../assets/slider/1.gif";
import avatarUrl from "../../../assets/image/avatar.jpg";

import Artictle from "../../home/components/article";
import User from "../../search/components/user";
import Collect from "../collect";
import Column from "../column";

export default function Articles() {
  const onChange = (key: string) => {
    console.log(key);
  };

  const articleList = [
    {
      id: 1,
      userId: 2,
      url: url,
      title: "你好",
      content:
        "Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team.",
      kind: "原创",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status: 0,
      date: "2024.07.24",
    },
    {
      id: 2,
      userId: 2,
      url: url,
      title: "你好",
      content: "111",
      kind: "转载",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status: 1,
      date: "2024.07.24",
    },
    {
      id: 3,
      userId: 2,
      url: url,
      title: "你好",
      content: "111",
      kind: "翻译",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status: 2,
      date: "2024.07.24",
    },
  ];

  const userList = [
    {
      id: 1,
      avatar: avatarUrl,
      name: "12",
      articleNum: 12,
      fans: 12,
      follows: 12,
      isFollow: true,
      intro: "这个人很懒，什么都没有留下",
    },
    {
      id: 1,
      avatar: avatarUrl,
      name: "12",
      articleNum: 12,
      fans: 12,
      follows: 12,
      isFollow: false,
      intro: "这个人很懒，什么都没有留下",
    },
    {
      id: 1,
      avatar: avatarUrl,
      name: "12",
      articleNum: 12,
      fans: 12,
      follows: 12,
      isFollow: true,
      intro: "这个人很懒，什么都没有留下",
    },
  ];

  const collectionList = [
    {
      id: 1,
      name: "1222",
      userId: 2,
    },
    {
      id: 2,
      name: "2wq2",
      userId: 2,
    },
    {
      id: 3,
      name: "cc",
      userId: 2,
    },
  ];

  const columnsList = [
    {
      id: 1,
      name: "12",
      userId: 2,
    },
    {
      id: 2,
      name: "fff",
      userId: 2,
    },
    {
      id: 3,
      name: "vv",
      userId: 2,
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "所有文章",
      children: articleList.map((item) => {
        return <Artictle key={item.id} article={item}></Artictle>;
      }),
    },
    {
      key: "2",
      label: "草稿",
      children: articleList.map((item) => {
        return <Artictle key={item.id} article={item}></Artictle>;
      }),
    },
    {
      key: "3",
      label: "待审核",
      children: articleList.map((item) => {
        return <Artictle key={item.id} article={item}></Artictle>;
      }),
    },
    {
      key: "4",
      label: "关注",
      children: userList.map((item, index) => {
        return <User key={index} user={item}></User>;
      }),
    },
    {
      key: "5",
      label: "粉丝",
      children: userList.map((item, index) => {
        return <User key={index} user={item}></User>;
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
      children: columnsList.map((item) => {
        return <Column key={item.id} column={item}></Column>;
      }),
    }
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
