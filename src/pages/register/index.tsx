import "./index.scss";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, message, Space } from "antd";
import { getCaptchaAPI, registerAPI } from "../../apis/user";
import { useNavigate } from "react-router-dom";

export default function Register() {
  type FieldType = {
    email?: string;
    password?: string;
    captcha?: string;
  };

  const [registerData,setRegisterData]=useState({
    email:'',
    password:'',
    captcha:''
  })

  const navigate=useNavigate()
  const [captchaText,setCaptchaText]=useState('获取验证码')

  const onFinish: FormProps<FieldType>["onFinish"] =async (values) => {
    console.log("Success:", values);


    const res = await registerAPI(values.email!,values.password!,values.captcha!);

    if(res.data.code===200)
    {
        message.success('注册成功')

        setTimeout(()=>{
            navigate("/")
        },2000)
    }
    else message.error(res.data.msg)
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  let timer:any=null
  let currentSecond=0

  const sendCaptcha=async()=>{
    if(captchaText!='获取验证码')
    {
        message.error('正在获取哦……')
        return 
    }
    else {
        currentSecond=60

        // 发送验证码
        const res = await getCaptchaAPI(registerData.email)

        if(res.data.code===200)
        {
            message.success('发送成功')
        }
        else {
            message.error(res.data.msg)
            return
        }

        timer = setInterval(()=>{
            currentSecond--

            if(currentSecond===0)
            {
                setCaptchaText('获取验证码')
                clearInterval(timer)
            }
            else {
                setCaptchaText('还剩'+currentSecond+'秒')
            }
        },1000)
    }
  }

  const setEmail=(e:any)=>{
    setRegisterData({
        email:e.target.value,
        captcha:'',
        password:''
    })
  }

  return (
    <div className="body">
      <div className="registerBox">
        <h1>注册</h1>
        <p>请先注册以便进行操作</p>
        <div className="form">
          <Form
            name="basic"
            layout={"vertical"}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input onChange={(e)=>setEmail(e)} />
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
              label="Captcha"
              name="captcha"
              rules={[
                { required: true, message: "Please input your captcha!" },
              ]}
            >
              <Space>
                <Input style={{width:290}}></Input>
                <Button type="primary" onClick={sendCaptcha}>{captchaText}</Button>
              </Space>
            </Form.Item>

            <p className="toLogin">已有账号，去登陆</p>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
