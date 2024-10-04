import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse, message } from "antd";

import { FieldTimeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Article } from "../../../types";
import { getCollectByCollectionAPI } from "../../../apis/collect";
import dayjs from "dayjs";

export default function CollectView(props:any) {
  const [articleList, setArticleList] = useState<Article[]>([]);

  useEffect(() => {
    const getCollect = async () => {
      const res = await getCollectByCollectionAPI(props.collect.id);

      if(res.data.code===200){
        setArticleList(res.data.data)
      }
      else message.error(res.data.msg)
    };

    getCollect();
  }, []);

  const navigate = useNavigate();

  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

  return (
    <div className="myContentArticleCollectBox">
      <Collapse
        items={[
          {
            key: "1",
            label: props.collect.name,
            children: articleList.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => toArticle(item.id!)}
                  className="collectArticlesBox"
                >
                  <span>
                    <FieldTimeOutlined />
                    <span>{dayjs(item.date).format("YYYY-MM-DD hh:mm:ss")}</span>
                  </span>
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
