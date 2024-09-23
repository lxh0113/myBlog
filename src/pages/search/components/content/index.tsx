import "./index.scss";

import { Tabs } from "antd";
import type { TabsProps } from "antd";

import Article from "../../../home/components/article";
import url from "../../../../assets/slider/1.gif";

import avatarUrl from "../../../../assets/image/avatar.jpg";
import User from "../user";

import SearchColumns from "../columns";

export default function searchContent() {
  const onChange = (key: string) => {
    console.log(key);
  };

  const articleList = [
    {
      id: 1,
      userId: 2,
      url:url,
      title: "你好",
      content: "Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team. AntDesign, a design language for background applications, is refined by Ant UED Team.",
      kind: "原创",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status:0,
      date:'2024.07.24'
    },
    {
      id: 2,
      userId: 2,
      url:url,
      title: "你好",
      content: "111",
      kind: "转载",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status:1,
      date:'2024.07.24'
    },
    {
      id: 3,
      userId: 2,
      url:url,
      title: "你好",
      content: "111",
      kind: "翻译",
      browse: 12,
      love: 120,
      comment: 0,
      collect: 10,
      status:2,
      date:'2024.07.24'
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

  const columnsList = [
    {
      id: 1,
      user: {
        id: 1,
        avatar: avatarUrl,
        name: "lxh0113",
      },
      columnsList: [
        {
          name: "12",
          articles: [
            { id: 2, title: "22" },
            { id: 3, title: "ww" },
            { id: 4, title: "ff" },
        ],
        },
      ],
    },
    {
      id: 2,
      user: {
        id: 6,
        avatar: avatarUrl,
        name: "lxh0113",
      },
      columnsList: [
        {
          name: "12",
          articles: [{ id: 2, title: "震惊" }],
        },
      ],
    },
  ];

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
        return <SearchColumns key={item.id} column={item}></SearchColumns>;
      }),
    },
  ];

  return (
    <div className="mySearchContentBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
