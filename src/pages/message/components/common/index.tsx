import { MessageCommon } from "../../../../types";
import "./index.scss";

export default function Common(props: {
  common:MessageCommon
}) {
  return (
    <div className="myMessageContentCommonBox">
      <div className="left">
        <img src={props.common.user.avatar!} alt="" />
      </div>
      <div className="right">
        <div className="name">{props.common.user.username}</div>
        <div className="details">
          {props.common.kind !== "评论" ? (
            <span>
              {props.common.kind}了你的文章&nbsp;&nbsp;&nbsp;
              <span>{props.common.article.title}</span>
            </span>
          ) : (
            <span>
              在你的博文里面评论了&nbsp;&nbsp;&nbsp;
              <span>{props.common.comment!.content}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
