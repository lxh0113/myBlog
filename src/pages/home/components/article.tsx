import "./css/article.scss";

import { Tag,Typography  } from "antd";


import {
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Artictle(props: any) {

    const { Paragraph, Text } = Typography;

    const navigate=useNavigate()

  const toArticle=(id:number)=>{
    navigate('/article/'+id)
  }

  return (
    <div className="homeArticleBox" onClick={()=>toArticle(props.article.id)}>
      <div className="left">
        <img src={props.article.url} alt="" />
      </div>
      <div className="right">
        <p className="articleTitle">{props.article.title}</p>
        <div className="articleContent">
          <Paragraph ellipsis={{
            rows:4
          }} >
          {props.article.content}
          </Paragraph>
        </div>
        <div className="bottom">
          {props.article.kind === "原创" ? (
            <Tag color="red">{props.article.kind}</Tag>
          ) : props.article.kind === "转载" ? (
            <Tag color="green">{props.article.kind}</Tag>
          ) : (
            <Tag color="purple">{props.article.kind}</Tag>
          )}
          <span>发布博客 {props.article.date}</span>
          <span>
            <EyeOutlined />
            <span>{props.article.browse}</span>
          </span>
          <span>
            <LikeOutlined />
            <span>{props.article.love}</span>
          </span>
          <span>
            <CommentOutlined />
            <span>{props.article.comment}</span>
          </span>
          <span>
            <StarOutlined />
            <span>{props.article.collect}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
