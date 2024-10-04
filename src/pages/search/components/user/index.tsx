import { Button, message } from "antd";
import "./index.scss";

import { PlusOutlined } from "@ant-design/icons";
import { UserDetails } from "../../../../types";
import { addFansAPI, deleteFansAPI } from "../../../../apis/fans";
import useUserStore from "../../../../stores/user";

export default function User(props: { user: UserDetails; setFlag: Function }) {
  console.log(props.user);
  const user = useUserStore((state: any) => state.user);

  const toFollow = async () => {
    const res = await addFansAPI(props.user.user?.id!, user.id);

    if (res.data.code === 200) {
      message.success("关注成功");
      props.setFlag()
    } else message.error(res.data.msg);
  };

  const cancelFollow =async () => {
    const res=await deleteFansAPI(props.user.user?.id!, user.id);

    if(res.data.code===200){
      message.success("取消关注成功")
      props.setFlag()
    }
    else message.error(res.data.msg)
  };

  return (
    <div className="searchUserBox">
      <div className="left">
        <img src={props.user.user!.avatar!} alt="" />
      </div>
      <div className="mid">
        <h3>{props.user.user?.username}</h3>
        <div className="spans">
          <span>文章数 {props.user.userInfo!.articles}</span>
          <span>关注 {props.user.userInfo!.follow}</span>
          <span>粉丝 {props.user.userInfo!.fans}</span>
        </div>
        <p>{props.user.user!.intro}</p>
      </div>
      <div className="right">
        {props.user.userInfo!.isFollow === false && (
          <Button icon={<PlusOutlined />} onClick={toFollow} size={"large"}>
            未关注
          </Button>
        )}
        {props.user.userInfo!.isFollow === true && (
          <Button
            size={"large"}
            onClick={cancelFollow}
            shape={"round"}
            type={"primary"}
          >
            已关注
          </Button>
        )}
      </div>
    </div>
  );
}
