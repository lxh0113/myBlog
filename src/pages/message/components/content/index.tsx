import "./index.scss";

import { message, Tabs } from "antd";
import type { TabsProps } from "antd";

import User from "../../../search/components/user";
import Common from "../common";
import Chat from "../chat";

import { useEffect, useState } from "react";
import { MessageCommon, UserDetails } from "../../../../types";
import {
  getCollectMessageAPI,
  getCommentsMessageAPI,
  getLikesMessageAPI,
  getNewFansMessageAPI,
} from "../../../../apis/message";
import useUserStore from "../../../../stores/user";

export default function Content() {
  const [key, setKey] = useState("1");

  const onChange = (key: string) => {
    setKey(key);
  };

  const [userList, setUserList] = useState<UserDetails[]>([]);
  const [flag, setFlag] = useState(0);

  const [commonList, setCommontList] = useState<MessageCommon[]>([]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "新增粉丝",
      children: userList.map((item, index) => {
        return (
          <User
            key={index}
            user={item}
            setFlag={() => setFlag(flag + 1)}
          ></User>
        );
      }),
    },
    {
      key: "2",
      label: "获赞",
      children: commonList.map((item: MessageCommon, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "3",
      label: "收藏",
      children: commonList.map((item, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "4",
      label: "评论",
      children: commonList.map((item, index) => {
        return <Common key={index} common={item}></Common>;
      }),
    },
    {
      key: "5",
      label: "私信",
      children: <Chat></Chat>,
    },
  ];

  const user = useUserStore((state: any) => state.user);

  useEffect(() => {
    if (key === "1") {
      const getNewFans = async () => {
        const res = await getNewFansMessageAPI(user.id);

        if (res.data.code === 200) {
          setUserList(res.data.data);
        } else message.error(res.data.msg);
      };
      getNewFans();
    } else if (key === "2") {
      const getLikes = async () => {
        const res = await getLikesMessageAPI(user.id);

        if (res.data.code === 200) {
          setCommontList(res.data.data);
        } else message.error(res.data.msg);
      };
      getLikes();
    } else if (key === "3") {
      const getLikes = async () => {
        const res = await getCollectMessageAPI(user.id);

        if (res.data.code === 200) {
          setCommontList(res.data.data);
        } else message.error(res.data.msg);
      };
      getLikes();
    } else if (key === "4") {
      const getLikes = async () => {
        const res = await getCommentsMessageAPI(user.id);

        if (res.data.code === 200) {
          setCommontList(res.data.data);
        } else message.error(res.data.msg);
      };
      getLikes();
    } else if (key === "5") {
    }
  }, [key, flag]);

  return (
    <div className="myMessageContentBox">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
