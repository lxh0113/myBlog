import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse } from "antd";

export default function Column(props: any) {


  const articleList = [
    {
      id: 1,
      title: "你好呀"
    },
    {
      id: 1,
      title: "你好呀"
    },
    {
      id: 1,
      title: "你好呀"
    },
  ];

  const navigate = useNavigate();

  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

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
                  onClick={() => toArticle(item.id)}
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
