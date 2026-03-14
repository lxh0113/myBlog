import "./css/header.scss";

import logoUrl from "../../../assets/image/logo.png";

import {
  DownOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  FileAddFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Dropdown,
  Space,
  Button,
  Badge,
  message,
  Modal,
  Divider,
  Table,
} from "antd";
import { useNavigate } from "react-router-dom";

import { FileAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import useUserStore from "../../../stores/user";
import { useEffect, useState } from "react";
import { getUserDetailsAPI } from "../../../apis/user";
import {
  addCooperateArticleAPI,
  getHistoryCooperateArticleAPI,
} from "../../../apis/cooperateArticle";
import { CooperateArticle } from "../../../types";

export default function Header() {
  const toProfile = () => {
    navigate("/profile");
  };

  const toLogin = () => {
    navigate("/login");
  };

  const toContent = () => {
    navigate("/content");
  };

  const toMessage = () => {
    navigate("/message/1");
  };

  const user = useUserStore((state: any) => state.user);

  const navigate = useNavigate();

  const toHome = () => {
    navigate("/");
  };

  const toEdit = () => {
    navigate("/edit");
  };

  const [userInfo, setUserInfo] = useState({
    articles: 0,
    love: 0,
    follow: 0,
    fans: 0,
    isFollow: false,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserDetailsAPI(user.id);

      if (res.data.code === 200) {
        setUserInfo(res.data.data);
      } else message.error(res.data.msg);
    };

    getUserInfo();
  }, []);

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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {userInfo.fans}
            </span>
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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {userInfo.follow}
            </span>
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
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {userInfo.articles}
            </span>
            <span style={{ color: "gray" }}>文章</span>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      danger: true,
      label: <span onClick={toProfile}>个人中心</span>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: <span onClick={toContent}>内容管理</span>,
      icon: <EditOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: <span onClick={toLogin}>退出登录</span>,
      icon: <LogoutOutlined />,
    },
  ];

  // 协作模块

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleNewCoDuc = async () => {
    const res = await addCooperateArticleAPI(user.id);

    if (res.data.code === 200) {
      toCooperation(res.data.data);
    } else {
      message.error("新增失败");
    }
  };

  const [dataSource, setDataSource] = useState<Array<CooperateArticle>>([]);

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "修改时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            color="default"
            variant="outlined"
            onClick={() => toCooperation(record.id)}
          >
            选择
          </Button>
        );
      },
    },
  ];

  const toCooperation = (id: number) => {
    // 创建新的
    handleCancel();
    navigate("/cooperation/" + id);
  };

  const getHistoryArticle = async () => {
    const res = await getHistoryCooperateArticleAPI(user.id, 1, 5);

    if (res.data.code === 200) {
      setDataSource(res.data.data.records);
    } else {
      message.error(res.data.msg);
    }
  };

  useEffect(() => {
    getHistoryArticle();
  }, []);

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
        <Badge showZero>
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
        <Button
          style={{ marginLeft: 20, borderRadius: 20, height: 40 }}
          type="default"
          icon={<UsergroupAddOutlined />}
          onClick={showModal}
        >
          协作文档
        </Button>
      </div>
      <Modal
        title="创建协作文档"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="default" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            type="primary"
            icon={<FileAddFilled></FileAddFilled>}
            onClick={handleNewCoDuc}
          >
            新文档
          </Button>,
        ]}
      >
        <p style={{ marginTop: "30px" }}>选择历史文档</p>
        <Divider />
        <Table dataSource={dataSource} columns={columns} />;
      </Modal>
    </div>
  );
}
