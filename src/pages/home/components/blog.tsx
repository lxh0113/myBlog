import "./css/blog.scss";
import Artictle from "./article";

import { Tabs } from "antd";
import type { TabsProps } from "antd";

import url from '../../../assets/slider/1.gif'
// import { useNavigate } from "react-router-dom";

export default function Body() {
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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "推荐",
      children: articleList.map((item) => {
        return <Artictle key={item.id} article={item}></Artictle>;
      }),
    },
    {
      key: "2",
      label: "关注",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "最新",
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "最热",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="homeBlogBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
