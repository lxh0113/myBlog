// axios基础的封装
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';

// const navigate=useNavigate()
// const [messageApi] = message.useMessage();

const http = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 6000 * 1000,
});
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;

// 拦截器

// axios请求拦截器

http.interceptors.request.use(
  (config) => {

    return config;
  },
  (e) => Promise.reject(e)
);

// axios响应式拦截器
http.interceptors.response.use(
  (response) => {
    // 响应拦截进来隐藏loading效果，此处采用延时处理是合并loading请求效果，避免多次请求loading关闭又开启

    const code = response.data.code;
    console.log(response)
    console.log(response.data.code)

    // switch (code) {
    //   case 400:
    //     messageApi.open({
    //         type: 'error',
    //         content: response.data.msg,
    //       });
    //     break;
    //   case 401:
    //     navigate('login');
    //     break;
    //   case 402:
        
    //     break;
    // }

    return response;
  },
  (e) => {
    
    

    return Promise.reject(e);
  }
);

export default http;
