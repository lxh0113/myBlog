import "./index.scss";

import avatarUrl from "../../../assets/image/avatar.jpg";
import { Button, Space } from "antd";

import { EditOutlined, SettingOutlined } from "@ant-design/icons";

export default function UserInfo() {
  return (
    <div className="myContentUserInfoBox">
      <div className="left">
        <img src={avatarUrl} alt="" />
      </div>
      <div className="mid">
        <div className="name">lxh0113</div>
        <div className="details">
            <span className="bigBox">
                78
                <span>文章</span>
            </span>
            <span className="bigBox">
                78
                <span>获赞</span>
            </span>
            <span className="bigBox">
                78
                <span>关注</span>
            </span>
            <span className="bigBox">
                78
                <span>粉丝</span>
            </span>
        </div>
      </div>
      <div className="right">
        <Space>
          <Button shape="round" icon={<EditOutlined />}>编辑资料</Button>
          <Button shape="round" icon={<SettingOutlined />}>设置</Button>
        </Space>
      </div>
    </div>
  );
}
