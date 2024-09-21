import "./indexl.scss";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Upload,
} from "antd";

export default function Settings() {
  const { TextArea } = Input;

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="myEditorSettingsBox">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
      >
        <Form.Item rules={[{ required: true }]} wrapperCol={{ span: 24 }} label="文章标签">
          <Space>
            <Select style={{width:200}}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>添加</Button>
          </Space>
        </Form.Item>
        <Form.Item
          label="添加封面"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <button
              style={{ border: 0, background: "none", width: "200px" }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>添加文章封面</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="文章摘要">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} wrapperCol={{ span: 24 }} label="分类专栏">
          <Space>
            <Select style={{width:200}}>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
            <Button icon={<PlusOutlined />}>添加</Button>
          </Space>
        </Form.Item>
        <Form.Item label="文章类型">
          <Radio.Group>
            <Radio value="原创"> 原创 </Radio>
            <Radio value="转载"> 转载 </Radio>
            <Radio value="翻译"> 翻译 </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
}
