import "./css/article.scss";

import { Tag, Typography } from "antd";

import {
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Artictle(props: any) {
  const { Paragraph } = Typography;

  const navigate = useNavigate();

  const toArticle = (id: number) => {

    if(props.article.status<=1) return 

    navigate("/article/" + id);
  };

  const toEdit=(id:number)=>{
    navigate('/edit/'+id)
  }

  return (
    <div className="homeArticleBox" onClick={() => toArticle(props.article.id)}>
      <div className="left">
        <img src={props.article.url} alt="" />
      </div>
      <div className="right">
        <p className="articleTitle">{props.article.title}</p>
        <div className="articleContent">
          <Paragraph
            ellipsis={{
              rows: 4,
            }}
          >
            {props.article.content}
          </Paragraph>
        </div>
        {props.article.status === 0 && (
          <div className="bottom">
            <Tag>草稿</Tag>
            <span onClick={()=>toEdit(props.article.id)}>
              <EditOutlined />
              <span>编辑</span>
            </span>
          </div>
        )}
        {props.article.status === 1 && (
          <div className="bottom">
            <Tag color="cyan">待审核</Tag>
          </div>
        )}
        {props.article.status === 2 && (
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
        )}
      </div>
    </div>
  );
}
