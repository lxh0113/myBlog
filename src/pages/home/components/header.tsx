import "./css/header.scss";

import logoUrl from "../../../assets/image/logo.png";
import avatar from "../../../assets/image/avatar.jpg";

import {
  DownOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Button,Badge } from "antd";
import { useNavigate } from "react-router-dom";

import { FileAddOutlined } from "@ant-design/icons";

export default function Header() {
  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 60,
          }}
        >
          <span>lxh0113</span>
        </div>
      ),
    },
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
            width: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: "bold" }}>173</span>
            <span style={{ color: "gray" }}>粉丝</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: "bold" }}>70</span>
            <span style={{ color: "gray" }}>关注</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: "bold" }}>200</span>
            <span style={{ color: "gray" }}>获赞</span>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      danger: true,
      label: "个人中心",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: "内容管理",
      icon: <EditOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: "退出登录",
      icon: <LogoutOutlined />,
    },
  ];

  const navigate = useNavigate();

  const toHome = () => {
    navigate("/");
  };

  const toEdit=()=>{
    navigate('/edit')
  }

  return (
    <div className="headerBox">
      <div className="left">
        <div className="logo">
          <img onClick={toHome} src={logoUrl} alt="" />
        </div>
      </div>

      <div className="right">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <img src={avatar} alt="" />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Badge count={2} showZero>
          <Button
            danger
            style={{
              marginLeft: 20,
              borderRadius: 20,
              height: 40,
              fontWeight: "bold",
              fontSize: 14,
            }}
            type="link"
          >
            消息
          </Button>
        </Badge>

        <Button
          style={{ marginLeft: 20, borderRadius: 20, height: 40 }}
          type="primary"
          icon={<FileAddOutlined />}
          onClick={toEdit}
        >
          发布文章
        </Button>
      </div>
    </div>
  );
}
