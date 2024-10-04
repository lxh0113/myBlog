import "./index.scss";

import { Anchor, Col, Row, Timeline, Button, InputNumber, message } from "antd";
import { Form, Input, Radio, Upload, Space } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useState } from "react";

import type { FormProps } from "antd";

import { BrowseGroup, BrowseHistory, User } from "../../../../types";
import {
  changeUserInfoAPI,
  getCaptchaAPI,
  getUserInfoAPI,
} from "../../../../apis/user";
import useUserStore from "../../../../stores/user";
import { getHistoryAPI } from "../../../../apis/browse";
import { useNavigate } from "react-router-dom";

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

  const onChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    if (file.status === "done") {
      setUserInfo({
        ...userInfo,
        avatar: file.response.data,
      });
      message.success("上传成功");
    }
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

  const [userForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [captcha, setCaptcha] = useState("");
  const [captchaText, setCaptchaText] = useState("获取验证码");

  const [userInfo, setUserInfo] = useState<User>({
    id: 1,
    username: "",
    password: "",
    age: 0,
    avatar: "",
    gender: 1,
    intro: "",
    email: "",
  });

  const onFinish: FormProps<User>["onFinish"] = async (values) => {
    console.log("Success:", values);

    setUserInfo({ ...values });

    const res = await changeUserInfoAPI(userInfo);

    if (res.data.code === 200) {
      message.success("修改成功");
      userForm.setFieldsValue(res.data.data);
    } else message.error(res.data.msg);
  };

  const onFinishFailed: FormProps<User>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let timer: any = null;

  const getCaptcha = async () => {
    if (captchaText !== "获取验证码") {
      message.error("已获取过验证码");
      return;
    }

    const res = await getCaptchaAPI(userInfo.email!);

    if (res.data.code === 200) {
      message.success("验证码发送成功");

      let second = 60;

      timer = setInterval(() => {
        second--;
        setCaptchaText("还剩" + second + "秒");

        if (second === 0) {
          clearInterval(timer);
          setCaptchaText("获取验证码");
        }
      }, 1000);
    } else message.error(res.data.msg);
  };

  const user = useUserStore((state: any) => state.user);

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserInfoAPI(user.id);
      console.log(res.data.data);

      if (res.data.code === 200) {
        setUserInfo({ ...res.data.data });
        fileList[0].url = res.data.data.avatar;
        userForm.setFieldsValue(res.data.data);
        changePasswordForm.setFieldsValue(res.data.data);
      } else message.error(res.data.msg);
    };

    getUserInfo();
  }, []);

  const [browseList, setBrowseList] = useState<BrowseGroup[]>([]);

  const navigate=useNavigate()
  const toArticle=(id:number)=>{
    navigate("/article/"+id)
  }

  useEffect(() => {
    const getBrowse = async () => {
      const res = await getHistoryAPI(user.id);

      if (res.data.code === 200) {
        setBrowseList(res.data.data);
      } else message.error(res.data.msg);
    };

    getBrowse();
  }, []);

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
              form={userForm}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={userInfo}
            >
              <Form.Item<User> label="用户id" name={"id"}>
                <Input disabled value={userInfo.id!} />
              </Form.Item>
              <Form.Item<User> label="用户头像">
                <ImgCrop rotationSlider>
                  <Upload
                    action="http://localhost:8080/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    name="file"
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {fileList.length < 2 && "+ Upload"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item<User> label="用户昵称" name={"username"}>
                <Input
                  value={userInfo.username!}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, username: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item<User> label="年龄" name={"age"}>
                <InputNumber
                  value={userInfo.age}
                  min={1}
                  max={100}
                  onChange={(value) =>
                    setUserInfo({ ...userInfo, age: value! })
                  }
                />
              </Form.Item>
              <Form.Item<User> label="性别" name={"gender"}>
                <Radio.Group
                  value={userInfo.gender}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, gender: e.target.value })
                  }
                >
                  <Radio value={1}> 男 </Radio>
                  <Radio value={0}> 女 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item<User> label="个人简介" name={"intro"}>
                <TextArea
                  value={userInfo.intro!}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, intro: e.target.value })
                  }
                  rows={4}
                />
              </Form.Item>
              <Form.Item>
                <Button type={"primary"} htmlType="submit">
                  修改
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            id="part-2"
            style={{ marginTop: 40, borderBottom: "1px solid #9e9e9e" }}
          >
            <h2 className="myProfileTitleText">浏览历史</h2>
            <Timeline
              items={browseList.map((item: BrowseGroup) => {
                return {
                  children: (
                    <div className="myBrowseBox">
                      <h4>{item.date}</h4>
                      {item.browseHistory.map((browse: BrowseHistory) => {
                        return (
                          <div className="myBrowseBoxItem" onClick={()=>toArticle(browse.article.id)}>
                            <h3>{browse.article?.title}</h3>
                            <div>
                              <img src={browse.user.avatar!} alt="" />
                              <span>{browse.user.username}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                };
              })}
            />
          </div>
          <div id="part-3" style={{ marginTop: 40 }}>
            <h2 className="myProfileTitleText">修改密码</h2>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              style={{ maxWidth: 600 }}
              initialValues={userInfo}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={changePasswordForm}
            >
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  value={userInfo.email!}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item
                label="新密码"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input
                  value={userInfo.password!}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item
                label="验证码"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Space>
                  <Input
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                  />
                  <Button type={"primary"} onClick={getCaptcha}>
                    {captchaText}&nbsp;
                  </Button>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button type={"primary"} htmlType="submit">
                  修改
                </Button>
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
