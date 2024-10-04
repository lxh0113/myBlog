import "./css/blog.scss";
import Artictle from "./article";

import { message, Tabs } from "antd";
import type { TabsProps } from "antd";

import { useEffect, useState } from "react";
import { ArticleInfo } from "../../../types";
import { getFollowArticlesAPI, getHotArticlesAPI, getNewArticlesAPI, getRecommendArticlesAPI } from "../../../apis/article";
import useUserStore from "../../../stores/user";
// import { useNavigate } from "react-router-dom";

export default function Body() {
  const onChange = (key: string) => {
    console.log(key);
    setKey(key)
  };

  const [key,setKey]=useState("1")
  const [articleList,setArticleList] = useState<ArticleInfo[]>()
  const user=useUserStore((state:any)=>state.user)

  useEffect(()=>{
    if(key==="1"){
      const getAllRecommend=async()=>{
        const res = await getRecommendArticlesAPI(user.id)

        if(res.data.code===200){
          setArticleList(res.data.data)
        }
        else message.error(res.data.msg)
      }
      getAllRecommend()
    }else if(key==="2"){
      const getAllFollow=async()=>{
        const res = await getFollowArticlesAPI(user.id)

        if(res.data.code===200){
          setArticleList(res.data.data)
        }
        else message.error(res.data.msg)
      }
      getAllFollow()
    }
    else if(key==="3"){
      const getAllNew=async()=>{
        const res = await getNewArticlesAPI(user.id)

        if(res.data.code===200){
          setArticleList(res.data.data)
        }
        else message.error(res.data.msg)
      }
      getAllNew()
    }
    else if(key==="4"){
      const getAllHot=async()=>{
        const res = await getHotArticlesAPI(user.id)

        if(res.data.code===200){
          setArticleList(res.data.data)
        }
        else message.error(res.data.msg)
      }
      getAllHot()
    }
  },[key])

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "推荐",
      children: articleList?.map((item) => {
        return <Artictle key={item.article?.id} article={item}></Artictle>;
      }),
    },
    {
      key: "2",
      label: "关注",
      children: articleList?.map((item) => {
        return <Artictle key={item.article?.id} article={item}></Artictle>;
      }),
    },
    {
      key: "3",
      label: "最新",
      children: articleList?.map((item) => {
        return <Artictle key={item.article?.id} article={item}></Artictle>;
      }),
    },
    {
      key: "4",
      label: "最热",
      children: articleList?.map((item) => {
        return <Artictle key={item.article?.id} article={item}></Artictle>;
      }),
    },
  ];

  return (
    <div className="homeBlogBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
