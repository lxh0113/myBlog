import "./index.scss";

import { Anchor, Col, Row, Timeline, Button } from "antd";
import { Form, Input, Radio, Upload, Space } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";

import type { FormProps } from "antd";

import avatarUrl from "../../../../assets/image/avatar.jpg";

export default function Body() {
  const { TextArea } = Input;

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="myProfileBodyBox">
      <Row>
        <Col span={20}>
          <div id="part-1" style={{ borderBottom: "1px solid #9e9e9e" }}>
            <h2 className="myProfileTitleText">修改个人信息</h2>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
              size={"large"}
            >
              <Form.Item label="用户id">
                <Input disabled />
              </Form.Item>
              <Form.Item label="用户头像">
                <ImgCrop rotationSlider>
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {fileList.length < 2 && "+ Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item label="用户昵称">
                <Input />
              </Form.Item>
              <Form.Item label="年龄">
                <Input />
              </Form.Item>
              <Form.Item label="性别">
                <Radio.Group>
                  <Radio value={1}> 男 </Radio>
                  <Radio value={0}> 女 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="个人简介">
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </div>
          <div
            id="part-2"
            style={{ marginTop: 40, borderBottom: "1px solid #9e9e9e" }}
          >
            <h2 className="myProfileTitleText">浏览历史</h2>
            <Timeline
              items={[
                {
                  children: (
                    <div className="myBrowseBox">
                      <h4>今日</h4>
                      <div className="myBrowseBoxItem">
                        <h3>scss</h3>
                        <div>
                          <img src={avatarUrl} alt="" />
                          <span>123</span>
                        </div>
                      </div>
                      <div className="myBrowseBoxItem">
                        <h3>scss</h3>
                        <div>
                          <img src={avatarUrl} alt="" />
                          <span>123</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div id="part-3" style={{ marginTop: 40 }}>
            <h2 className="myProfileTitleText">修改密码</h2>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="邮箱"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="验证码"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Space>
                  <Input />
                  <Button type={"primary"}>获取验证码&nbsp;</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={4}>
          <Anchor
            affix={true}
            items={[
              {
                key: "part-1",
                href: "#part-1",
                title: "个人信息",
              },
              {
                key: "part-2",
                href: "#part-2",
                title: "浏览历史",
              },
              {
                key: "part-3",
                href: "#part-3",
                title: "修改密码",
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
