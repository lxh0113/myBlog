import { Button } from "antd";
import { DownOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton,Space } from "antd";

import "./index.scss";

export default function Buttom() {
  return (
    <div className="myEditorBottomBox">
      <div className="left">
        <FloatButton.BackTop></FloatButton.BackTop>
        <span>今天也要开心哦(*^_^*)</span>
      </div>
      <div className="right">
        <Space size={24}>
          <Button className="myEditorBottomButton" icon={<DownOutlined />}>保存草稿</Button>
          <Button className="myEditorBottomButton">定时发布</Button>
          <Button className="myEditorBottomButton" type="primary">
            保存草稿
          </Button>
        </Space>
      </div>
    </div>
  );
}
