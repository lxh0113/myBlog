import { Button } from "antd";
import "./index.scss";

import { PlusOutlined } from '@ant-design/icons'


export default function User(props: any) {
  return (
    <div className="searchUserBox">
      <div className="left">
        <img src={props.user.avatar} alt="" />
      </div>
      <div className="mid">
        <h3>12</h3>
        <div className="spans">
            <span>文章数 {props.user.articleNum}</span>
            <span>关注 {props.user.follows}</span>
            <span>粉丝 {props.user.fans}</span>
        </div>
        <p>{props.user.intro}</p>
      </div>
      <div className="right">
        {
            props.user.isFollow===true?<Button size={'large'} shape={'round'} type={'primary'}>已关注</Button>:<Button icon={<PlusOutlined />} size={'large'}>未关注</Button>
        }
      </div>
    </div>
  );
}
