import "./index.scss";

import { Tabs } from "antd";
import type { TabsProps } from "antd";

import User from "../../../search/components/user";
import Common from "../common";
import Chat from "../chat";

import avatarUrl from '../../../../assets/image/avatar.jpg'

export default function Content() {
  const onChange = (key: string) => {
    console.log(key);
  };

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

  const commonList=[
    {
        id:1,
        user:{
            id:2,
            avatar:avatarUrl,
            name:'123'
        },
        kind:'点赞',
        article:{
            id:1,
            title:'哇咔咔'
        }
    },
    {
        id:1,
        user:{
            id:2,
            avatar:avatarUrl,
            name:'123'
        },
        kind:'收藏',
        article:{
            id:1,
            title:'哇咔咔'
        }
    },
    {
        id:1,
        user:{
            id:2,
            avatar:avatarUrl,
            name:'123'
        },
        kind:'评论',
        comment:{
            id:1,
            content:'哇咔咔'
        }
    },
  ]

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "新增粉丝",
      children: userList.map((item, index) => {
        return <User key={index} user={item}></User>;
      }),
    },
    {
      key: "2",
      label: "获赞",
      children: commonList.map((item, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "3",
      label: "收藏",
      children: commonList.map((item, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "4",
      label: "评论",
      children: commonList.map((item, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "5",
      label: "私信",
      children: <Chat></Chat>,
    },
  ];

  return (
    <div className="myMessageContentBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
