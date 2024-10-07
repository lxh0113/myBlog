import "./index.scss";

import { Space, Input, Button, Table, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {  User,UserDetails } from "../../../types";
import type { TableProps } from "antd";
import { adminGetUsersAPI } from "../../../apis/user";

export default function UserView() {
  const [searchOption, setSearchOption] = useState({
    userId: "",
    username: "",
  });
  const [userInfoList, setUserInfoList] = useState<UserDetails[]>();

  const columns: TableProps<UserDetails>["columns"] = [
    {
      title: "用户名",
      dataIndex: ["user", "username"],
      key: "name",
    },
    {
      title: "用户头像",
      dataIndex: ["user", "avatar"],
      render: (value) => (
        <img
          style={{ width: 50, height: 50, borderRadius: 50 }}
          src={value}
          alt=""
        />
      ),
      key: "avatar",
    },
    {
      title: "邮箱",
      dataIndex: ["user", 'email'],
      key: "email",
    },
    {
      title: "文章数量",
      dataIndex: ['userInfo','articles'],
      key: "articles",
    },
    {
      title: "粉丝数量",
      dataIndex: ['userInfo','follow'],
      key: "follows",
    },
    {
      title: "粉丝数量",
      dataIndex: ['userInfo','fans'],
      key: "fans",
    },
    {
      title: "操作",
      dataIndex: 'user',
      key: "user.id",
      render:(user:User)=>(
        <>
          <Button type="link" danger>删除</Button>
        </>
      )
    },
  ];

  useEffect(() => {
    const getUserInfoList = async () => {
      let userId = !parseInt(searchOption.userId)
        ? 0
        : parseInt(searchOption.userId);

      const res = await adminGetUsersAPI(userId, searchOption.username);

      if (res.data.code === 200) {
        setUserInfoList(res.data.data);
      } else message.error(res.data.msg);
    };
    getUserInfoList();
  }, [searchOption]);

  return (
    <div className="myBackUserBox">
      <Space style={{ marginBottom: 20 }}>
        <Input
          value={searchOption.userId}
          onChange={(e) =>
            setSearchOption({
              ...searchOption,
              userId: e.target.value,
            })
          }
          size="large"
          placeholder="请输入用户id"
        ></Input>
        <Input
          value={searchOption.username}
          onChange={(e) =>
            setSearchOption({
              ...searchOption,
              username: e.target.value,
            })
          }
          size="large"
          placeholder="请输入用户昵称"
        ></Input>
        <Button size="large" type="primary" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Space>

      <Table<UserDetails> columns={columns} dataSource={userInfoList} />
    </div>
  );
}
