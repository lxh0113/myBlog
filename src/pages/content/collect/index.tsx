import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse } from "antd";

import { FieldTimeOutlined } from "@ant-design/icons";

export default function Collect(props: any) {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  const articleList = [
    {
      id: 1,
      title: "你好呀",
      date: "2024/12/4",
    },
    {
      id: 1,
      title: "你好呀",
      date: "2024/12/4",
    },
    {
      id: 1,
      title: "你好呀",
      date: "2024/12/4",
    },
  ];

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
                  onClick={() => toArticle(item.id)}
                  className="collectArticlesBox"
                >
                  <span>
                    <FieldTimeOutlined />
                    <span>{item.date}</span>
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
