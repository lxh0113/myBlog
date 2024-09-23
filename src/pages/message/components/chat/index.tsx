import "./index.scss";
import { Typography, Input, Button } from "antd";

import avatarUrl from "../../../../assets/image/avatar.jpg";

export default function Chat() {
  const { Paragraph } = Typography;

  return (
    <div className="myMessageChatBox">
      <div className="left">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
          return (
            <div className="myFriendListBox">
              <div className="img">
                <img src={avatarUrl} alt="" />
              </div>
              <div className="details">
                <div className="name">lxh0113</div>
                <div className="message">
                  <Paragraph
                    ellipsis={{
                      rows: 1,
                    }}
                  >
                    {"Ant Design, a design language for background applications, is refined by Ant UED Team.".repeat(
                      20
                    )}
                  </Paragraph>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="right">
        <div className="users">
          <div className="name">lxh0113</div>
          <div className="content">
            <div className="myMessage">
              <div className="messageContent">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
              <img src={avatarUrl} alt="" />
            </div>
            <div className="otherMessage">
              <img src={avatarUrl} alt="" />
              <div className="messageContent">aaaaaaaaaaaaa</div>
            </div>

            <div className="myMessage">
              <div className="messageContent">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
              <img src={avatarUrl} alt="" />
            </div>
            <div className="otherMessage">
              <img src={avatarUrl} alt="" />
              <div className="messageContent">aaaaaaaaaaaaa</div>
            </div>

            <div className="myMessage">
              <div className="messageContent">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
              <img src={avatarUrl} alt="" />
            </div>
            <div className="otherMessage">
              <img src={avatarUrl} alt="" />
              <div className="messageContent">aaaaaaaaaaaaa</div>
            </div>
            <div className="myMessage">
              <div className="messageContent">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
              <img src={avatarUrl} alt="" />
            </div>
            <div className="otherMessage">
              <img src={avatarUrl} alt="" />
              <div className="messageContent">aaaaaaaaaaaaa</div>
            </div>
          </div>
          <div className="textarea">
            <Input.TextArea
              rows={5}
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
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
