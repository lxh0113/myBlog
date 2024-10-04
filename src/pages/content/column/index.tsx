import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse, message } from "antd";
import { useEffect, useState } from "react";
import { Article } from "../../../types";
import { getArticleColumnIdAPI } from "../../../apis/article";

export default function Column(props: any) {

  const [articleList,setArticleList] = useState<Article[]>([]);

  const navigate = useNavigate();

  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

  useEffect(()=>{
    const getArticles=async()=>{
      const res = await getArticleColumnIdAPI(props.column.id)

      if(res.data.code===200){
        setArticleList(res.data.data)
      }
      else message.error(res.data.msg)
    }
    getArticles()
  },[])

  return (
    <div className="myContentArticleColumnBox">
      <Collapse
        items={[
          {
            key: "1",
            label: props.column.name,
            children: articleList.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => toArticle(item.id!)}
                  className="collectArticlesBox"
                >
                  <p>{item.title}</p>
                </div>
              );
            }),
          },
        ]}
      />
    </div>
  );
}
