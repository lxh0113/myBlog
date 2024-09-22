// import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";

import "./index.scss";
import { loginAPI } from "../../apis/user";
import { useNavigate } from "react-router-dom";

import {  ConfigProvider } from "antd";

export default function Login() {
  type FieldType = {
    username?: number;
    password?: string;
    remember?: string;
  };

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] =async (values) => {
    console.log("Success:", values);

    const res = await loginAPI(values.username!, values.password!);

      if (res.data.code === 200) {
        message.success("登录成功");

        navigate("/");
      } else {
        message.error(res.data.msg);
      }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const toLogin=()=>{
    navigate("/register")
  }

  return (

    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#ff4d4f",
          borderRadius: 4,
          // 派生变量，影响范围小
          colorBgContainer: "#fff",
        },
      }}
    >
       <div className="body">
      <div className="loginBox">
        <h1>登录</h1>
        <p>请先登录以便进行操作</p>
        <div className="form">
          <Form
            name="basic"
            labelCol={{ span: 5 }}
            layout={'vertical'}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="id"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 0, span: 16 }}
              style={{ marginBottom: 20 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <p className="toLogin" onClick={toLogin}>没有账号，去登录</p>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
    </ConfigProvider>

   
  );
}
