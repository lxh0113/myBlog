import "./index.scss";

import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CommentOutlined,
  UserOutlined,
  FileWordOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

import { ConfigProvider } from "antd";

import logoUrl from "../../assets/image/logo.png";
import { useNavigate } from "react-router-dom";

export default function Back() {
  const { Header, Sider, Content } = Layout;

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate=useNavigate()

  const toContent=(value:string)=>{
    if(value==="") {
        navigate("/back")
    }
    else navigate("/back/"+value)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#ff4d4f",
          borderRadius: 4,
          // 派生变量，影响范围小
          colorBgContainer: "#fff",
        },
      }}
    >
      <div className="myBackBox">
        <Layout>
          <Sider
            style={{
              backgroundColor: "white",
              borderRight: "1px solid #e4e4e4",
            }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <div className="demo-logo-vertical">
              <img src={logoUrl} alt="" />
            </div>
            <Menu
              theme={"light"}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <MenuOutlined onClick={()=>toContent("")} />,
                  label: (
                    <span onClick={()=>toContent("")}>
                        首页轮播图
                    </span>
                  ),
                },
                {
                  key: "2",
                  icon: <FileWordOutlined onClick={()=>toContent("article")} />,
                  label: (
                    <span onClick={()=>toContent("article")}>
                        文章审核
                    </span>
                  ),
                },
                {
                  key: "3",
                  icon: <CommentOutlined onClick={()=>toContent("comments")} />,
                  label: (
                    <span onClick={()=>toContent("comments")}>
                        评论管理
                    </span>
                  ),
                },
                {
                  key: "4",
                  icon: <UserOutlined onClick={()=>toContent("user")} />,
                  label: (
                    <span onClick={()=>toContent("user")}>
                        用户管理
                    </span>
                  ),
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: "calc(100vh - 112px)",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet></Outlet>
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
}
