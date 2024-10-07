import "./index.scss";
import { Typography, Input, Button, Modal, Form, message } from "antd";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { Message, MessageFriend } from "../../../../types";

import { SearchOutlined } from "@ant-design/icons";
import useUserStore from "../../../../stores/user";
import dayjs from "dayjs";
import { getMessagesAPI, sendMessageAPI } from "../../../../apis/message";

export default function Chat() {
  const { Paragraph } = Typography;

  const [flag, setFlag] = useState(0);
  const [sendOption, setSendOption] = useState({
    receiverId: "",
    content: "",
  });
  const [currentId, setCurrentId] = useState<number>();
  const [userList, setUserList] = useState<MessageFriend[]>([]);
  const [currentUser, setCurrentUser] = useState<MessageFriend>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const setChoosed = (id: number, index: number) => {
    setCurrentId(id);
    setCurrentUser(userList[index]);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const getMessages = async () => {
      const res = await getMessagesAPI(user.id);

      if (res.data.code === 200) {
        console.log(res.data.data);
        setUserList(res.data.data);
      } else message.error(res.data.msg);
    };
    getMessages();
  }, [flag]);

  const user = useUserStore((state: any) => state.user);

  const [messageContent, setMessageContent] = useState<Message>({
    id: null,
    senderId: user.id,
    receiverId: null,
    content: "",
    date: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
  });

  const preSendMessage = () => {
    setMessageContent({
      ...messageContent,
      receiverId: currentUser?.user.id!,
      date: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    });

    sendMessage();
  };

  const sendMessage = async () => {
    
    let data=messageContent

    data.receiverId=currentUser?.user.id!
    data.date=dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss")

    const res = await sendMessageAPI(data);

    if (res.data.code === 200) {
      message.success("发送成功");
      if (modal) {
        setModal(false);
        setFlag(flag + 1);
      } else {
        setCurrentUser({
          user: currentUser?.user!,
          messages: [...currentUser?.messages!, res.data.data],
        });

        let data: MessageFriend[] = userList;

        setUserList([
          ...data.splice(0, currentIndex),
          currentUser!,
          ...data.splice(currentIndex+1),
        ]);

        setMessageContent({
          ...messageContent,
          content:""
        })
      }
    } else message.error(res.data.msg);
  };

  const handleOk = () => {
    console.log(sendOption);

    let receiverId = 0;
    if (parseInt(sendOption.receiverId))
      receiverId = parseInt(sendOption.receiverId);
    else {
      message.error("请输入正确的id");
      return;
    }

    if (sendOption.content === "") {
      message.error("请输入内容");
      return;
    }

    setMessageContent({
      id: null,
      senderId: user.id,
      receiverId: receiverId,
      content: sendOption.content,
      date: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    });

    sendMessage();
  };

  const [modal, setModal] = useState(false);

  return (
    <div className="myMessageChatBox">
      <div className="left">
        <div>
          <Button
            type="link"
            icon={<SearchOutlined />}
            onClick={() => setModal(true)}
          >
            搜索
          </Button>
        </div>
        {userList.map((item: MessageFriend, index: number) => {
          return (
            <div
              key={index}
              onClick={() => setChoosed(item.user.id!, index)}
              className={classNames("myFriendListBox", {
                choosed: item.user.id === currentId,
              })}
            >
              <div className="img">
                <img src={item.user.avatar!} alt="" />
              </div>
              <div className="details">
                <div className="name">{item.user.username}</div>
                <div className="message">
                  <Paragraph
                    ellipsis={{
                      rows: 1,
                    }}
                  >
                    {item.messages[item.messages.length - 1].content}
                  </Paragraph>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="right">
        <div className="users">
          <div className="name">{currentUser?.user.username}</div>
          <div className="content">
            {currentUser?.messages.map((item: Message) => {
              return item.senderId === user.id ? (
                <div key={item.id} className="myMessage">
                  <div className="messageContent">{item.content}</div>
                  <img src={user.avatar} alt="" />
                </div>
              ) : (
                <div key={item.id} className="otherMessage">
                  <img src={currentUser?.user.avatar!} alt="" />
                  <div className="messageContent">{item.content}</div>
                </div>
              );
            })}
          </div>
          <div className="textarea">
            <Input.TextArea
              rows={5}
              value={messageContent.content!}
              onChange={(e) => {
                setMessageContent({
                  ...messageContent,
                  content: e.target.value,
                });
              }}
              style={{
                border: 0,
                borderTop: "1px solid #f4f5f6",
                outline: 0,
                resize: "none",
              }}
            ></Input.TextArea>
            <Button
              style={{ position: "absolute", bottom: "20px", right: "30px" }}
              type={"primary"}
              onClick={preSendMessage}
            >
              发送
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="搜索好友"
        open={modal}
        onOk={handleOk}
        onCancel={() => setModal(false)}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600, marginTop: 20 }}
          labelAlign={"left"}
          autoComplete="off"
        >
          <Form.Item
            label="接收id"
            rules={[{ required: true, message: "请输入id" }]}
          >
            <Input
              value={sendOption.receiverId}
              onChange={(e) =>
                setSendOption({
                  ...sendOption,
                  receiverId: e.target.value,
                })
              }
              placeholder="请输入id"
            />
          </Form.Item>

          <Form.Item
            label="内容"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.TextArea
              value={sendOption.content}
              onChange={(e) => {
                setSendOption({
                  ...sendOption,
                  content: e.target.value,
                });
              }}
              placeholder="请输入内容"
              style={{ height: 200 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
