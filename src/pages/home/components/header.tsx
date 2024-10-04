import "./css/header.scss";

import logoUrl from "../../../assets/image/logo.png";

import {
  DownOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Button,Badge, message } from "antd";
import { useNavigate } from "react-router-dom";

import { FileAddOutlined } from "@ant-design/icons";
import useUserStore from "../../../stores/user";
import { useEffect, useState } from "react";
import { getUserDetailsAPI } from "../../../apis/user";

export default function Header() {

  const toProfile=()=>{
    navigate('/profile')
  }

  const toLogin=()=>{
    navigate('/login')
  }

  const toContent=()=>{
    navigate('/content')
  }

  const toMessage=()=>{
    navigate('/message/1')
  }

  const user=useUserStore((state:any)=>state.user)

  const navigate = useNavigate();

  const toHome = () => {
    navigate("/");
  };

  const toEdit=()=>{
    navigate('/edit')
  }

  const [userInfo,setUserInfo]=useState({
    articles:0,
    love:0,
    follow:0,
    fans:0,
    isFollow:false
  })

  useEffect(()=>{
    const getUserInfo=async()=>{
      const res = await getUserDetailsAPI(user.id);

      if(res.data.code===200)
      {
        setUserInfo(res.data.data)
      }
      else message.error(res.data.msg)
    }

    getUserInfo()
  },[])

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
          <span>{user.username}</span>
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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>{userInfo.fans}</span>
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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>{userInfo.follow}</span>
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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>{userInfo.articles}</span>
            <span style={{ color: "gray" }}>文章</span>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      danger: true,
      label: (
        <span onClick={toProfile}>个人中心</span>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: (
        <span onClick={toContent}>内容管理</span>
      ),
      icon: <EditOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: (
        <span onClick={toLogin}>退出登录</span>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className="homeHeaderBox">
      <div className="left">
        <div className="logo">
          <img onClick={toHome} src={logoUrl} alt="" />
        </div>
      </div>

      <div className="right">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <img src={user.avatar} alt="" />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Badge count={2} showZero>
          <Button
            onClick={toMessage}
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
