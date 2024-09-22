import "./index.scss";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import url from '../../../assets/slider/1.gif'

import Artictle from "../../home/components/article";

export default function Articles() {
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
      date:'2024.07.24'
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
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "待审核",
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "关注",
      children: "Content of Tab Pane 3",
    },
    {
      key: "5",
      label: "粉丝",
      children: "Content of Tab Pane 3",
    },
    {
      key: "6",
      label: "收藏",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="myContentArticleBox">
      <Tabs size={'large'} defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
