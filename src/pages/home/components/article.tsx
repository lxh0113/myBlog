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
    if (props.article.article.status <= 1) return;

    navigate("/article/" + id);
  };

  const toEdit = (id: number, e: any) => {
    e.stopPropagation();
    navigate("/edit/" + id);
  };

  return (
    <div
      className="homeArticleBox"
      onClick={() => toArticle(props.article.article.id)}
    >
      <div className="left">
        <img src={props.article.article.url} alt="" />
      </div>
      <div className="right">
        <p className="articleTitle">{props.article.article.title}</p>
        <div className="articleContent">
          <Paragraph
            ellipsis={{
              rows: 4,
            }}
          >
            {props.article.article.brief}
          </Paragraph>
        </div>
        {props.article.article.status === 0 && (
          <div className="bottom">
            <Tag>草稿</Tag>
            <span onClick={(e) => toEdit(props.article.article.id,e)}>
              <EditOutlined />
              <span>编辑</span>
            </span>
          </div>
        )}
        {props.article.article.status === 1 && (
          <div className="bottom">
            <Tag color="cyan">待审核</Tag>
            <span onClick={(e) => toEdit(props.article.article.id, e)}>
              <EditOutlined />
              <span>编辑</span>
            </span>
          </div>
        )}
        {props.article.article.status === 2 && (
          <div className="bottom">
            {props.article.article.kind === "原创" ? (
              <Tag color="red">{props.article.article.kind}</Tag>
            ) : props.article.article.kind === "转载" ? (
              <Tag color="green">{props.article.article.kind}</Tag>
            ) : (
              <Tag color="purple">{props.article.article.kind}</Tag>
            )}
            <span>发布博客 {props.article.article.date}</span>
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
              <span>{props.article.comments}</span>
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
