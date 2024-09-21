import "./index.scss";

import { Tag } from "antd";

import {
  FieldTimeOutlined,
  EyeOutlined,
  StarOutlined,
  LikeOutlined,
} from "@ant-design/icons";

export default function Content() {
  return (
    <div className="myArticleContentBox">
      <div className="title">你好</div>
      <div className="detailsBox">
        <div className="left">
          <Tag color="#f00">原创</Tag>
        </div>
        <div className="right">
          <div className="top">
            <span>
              <FieldTimeOutlined />
              <span>于2024-10-12 21:00:21 发布</span>
            </span>
            <span>
              <EyeOutlined />
              <span>获赞</span>
            </span>
            <span>
              <StarOutlined />
              <span>收藏</span>
            </span>
            <span>
              <LikeOutlined />
              <span>点赞</span>
            </span>
          </div>
          <div className="bottom">
            <span>
              分类专栏
              <Tag style={{ marginLeft: 10 }} color="red">
                react
              </Tag>
            </span>
            <span>
              文章标签
              <Tag style={{ marginLeft: 10 }} color="red">
                react
              </Tag>
              <Tag style={{ marginLeft: 10 }} color="red">
                react
              </Tag>
            </span>
          </div>
        </div>
      </div>
      <div className="content">
        <div dangerouslySetInnerHTML={{ __html: "<p>你好</p>" }} />
      </div>
    </div>
  );
}
