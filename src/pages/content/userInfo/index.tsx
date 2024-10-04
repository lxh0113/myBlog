import "./index.scss";

import { Button, message, Space } from "antd";

import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserDetailsAPI, getUserInfoAPI } from "../../../apis/user";
import useUserStore from "../../../stores/user";

export default function UserInfo() {
  const navigate = useNavigate();

  const toProfile = () => {
    navigate("/profile");
  };

  const [userInfo,setUserInfo]=useState({
    articles:0,
    love:0,
    follow:0,
    fans:0,
    isFollow:false
  })
  const user = useUserStore((state: any) => state.user);

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserDetailsAPI(user.id);

      if (res.data.code === 200) {
        console.log(res.data.data)
        setUserInfo(res.data.data)
      } else message.error(res.data.msg);
    };

    getUserInfo()
  }, []);

  return (
    <div className="myContentUserInfoBox">
      <div className="left">
        <img src={user.avatar} alt="" />
      </div>
      <div className="mid">
        <div className="name">{user.name}</div>
        <div className="details">
          <span className="bigBox">
            {userInfo.articles}
            <span>文章</span>
          </span>
          {/* <span className="bigBox">
            {userInfo.love}
            <span>获赞</span>
          </span> */}
          <span className="bigBox">
            {userInfo.follow}
            <span>关注</span>
          </span>
          <span className="bigBox">
            {userInfo.fans}
            <span>粉丝</span>
          </span>
        </div>
      </div>
      <div className="right">
        <Space>
          <Button shape="round" onClick={toProfile} icon={<EditOutlined />}>
            编辑资料
          </Button>
          <Button shape="round" icon={<SettingOutlined />}>
            设置
          </Button>
        </Space>
      </div>
    </div>
  );
}
