import "./index.scss";
import { useState } from "react";

import { Tag } from "antd";
import { Drawer } from "antd";
import Comments from "../commets";

import avatarUrl from "../../../../assets/image/avatar.jpg";
import ColumnContent from "../columnContent";

import {
  FieldTimeOutlined,
  EyeOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { Button } from "antd";

export default function Content() {
  const [open, setOpen] = useState(false);
  const [openColumn, setOpenColumn] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showColumnDrawer = () => {
    setOpenColumn(true);
  };

  const onColumnClose = () => {
    setOpenColumn(false);
  };

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
      <div className="bottom">
        <div className="left">
          <img src={avatarUrl} alt="" />
          <span className="username">lxh0113</span>
          <Button type="primary" shape="round" size="large">
            关注
          </Button>
        </div>
        <div className="right">
          <span>
            <LikeOutlined />
            <span>0</span>
          </span>
          <span>
            <StarOutlined />
            <span>0</span>
          </span>
          <span onClick={showDrawer}>
            <MessageOutlined />
            <span>0</span>
          </span>
          <Button onClick={showColumnDrawer} shape="round" size="large" icon={<UnorderedListOutlined />}>
            专栏目录
          </Button>
        </div>
      </div>

      <Drawer title="评论区，请友善发言" onClose={onClose} open={open}>
        <Comments></Comments>
      </Drawer>

      <Drawer
        title="专栏目录"
        placement={"left"}
        width={500}
        onClose={onColumnClose}
        open={openColumn}
      >
        <ColumnContent></ColumnContent>
      </Drawer>
    </div>
  );
}
