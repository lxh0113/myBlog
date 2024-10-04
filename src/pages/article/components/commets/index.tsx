import "./index.scss";
import { useEffect, useState } from "react";
import { Avatar, Button, List, Input, message } from "antd";
import { CommentInfo, Comment } from "../../../../types";
import { useParams } from "react-router-dom";
import useUserStore from "../../../../stores/user";
import {
  addCommentAPI,
  deleteCommentAPI,
  getCommentsAPI,
} from "../../../../apis/comment";
import dayjs from "dayjs";

export default function Comments() {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<CommentInfo[]>([]);

  const [replyText, setReplyText] = useState("请输入评论");

  const param = useParams();
  const user = useUserStore((state: any) => state.user);
  const [commentFlag, setCommentFlag] = useState(0);

  const [replyContent, setReplyContent] = useState("");

  const [comments, setComments] = useState<Comment>({
    id: null,
    date: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    articleId: parseInt(param.id as string),
    content: "",
    userId: user.id,
    parentId: null,
    receiverId: null,
  });

  useEffect(() => {
    const getAllComment = async () => {
      const res = await getCommentsAPI(parseInt(param.id as string));

      if (res.data.code === 200) {
        console.log(res.data.data);
        setInitLoading(false);
        setList(res.data.data);
      } else message.error(res.data.msg);
    };

    getAllComment();
  }, [commentFlag]);

  const sendComments = async () => {
    let data = comments;
    data.content = replyContent;

    const res = await addCommentAPI(data);

    if (res.data.code === 200) {
      message.success("发布成功");
      setComments({
        ...comments,
        content: "",
      });
      setCommentFlag(commentFlag + 1);
      setReplyContent("")
    } else message.error(res.data.msg);
  };

  const relpy = (item: CommentInfo, e: any, index?: number) => {
    console.log(item);
    e.stopPropagation();

    setComments({
      ...comments,
      parentId: index !== undefined ? list[index].comment.id : item.comment.id,
      receiverId: item.user.id!,
    });

    console.log(comments);
    setReplyText("回复" + item.user.username + ":");
  };

  const setFirstComment = (e: any) => {
    console.log(e);
    e.preventDefault();
    setReplyText("请输入评论");
    setComments({
      ...comments,
      parentId: null,
      content: "",
      receiverId: null,
    });
  };

  const deleteComment = async (id: number, e: any) => {
    console.log(id);
    e.preventDefault();
    const res = await deleteCommentAPI(id);

    if (res.data.code === 200) {
      message.success("删除成功");
      setCommentFlag(commentFlag + 1);
    } else message.error(res.data.msg);
  };

  return (
    <div className="myArticleComments">
      <div className="sendMessageBox">
        <Input.TextArea
          placeholder={replyText}
          className="textarea"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        ></Input.TextArea>
        <Button onClick={sendComments} className="button" type={"primary"}>
          发送
        </Button>
      </div>
      <div onClick={(e) => setFirstComment(e)}>
        <List
          style={{ marginTop: 120 }}
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item, index) => (
            <>
              <List.Item
              key={item.comment.id}
                actions={[
                  <a onClick={(e) => relpy(item, e)} key="list-loadmore-edit">
                    回复
                  </a>,
                  <a
                    onClick={(e) => deleteComment(item.comment.id!, e)}
                    key="list-loadmore-more"
                  >
                    删除
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.user.avatar} />}
                  title={
                    <>
                      <a href={"/content/"}>{item.user.username}</a>
                      <span
                        style={{
                          marginLeft: 10,
                          color: "gray",
                          fontWeight: "normal",
                        }}
                      >
                        {dayjs(item.comment.date).format("YYYY-MM-DD hh:mm:ss")}
                      </span>
                    </>
                  }
                  description={item.comment.content}
                />
              </List.Item>
              {/* 做子评论的地方 */}
              {item.sonComments?.map((son: CommentInfo) => {
                return (
                  <List.Item
                    key={son.comment.id}
                    style={{ marginLeft: 50 }}
                    actions={[
                      <a
                        onClick={(e) => relpy(son, e, index)}
                        key="list-loadmore-edit"
                      >
                        回复
                      </a>,
                      son.user.id === user.id && (
                        <a
                          key="list-loadmore-more"
                          onClick={(e) => deleteComment(son.comment.id!, e)}
                        >
                          删除
                        </a>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={son.user.avatar} />}
                      title={
                        <>
                          <a href={"/content/"}>{son.user.username}</a>
                          <span style={{ marginLeft: 10 }}>回复</span>
                          <a style={{ marginLeft: 10 }} href={"/content/"}>
                            {son.receiverName}
                          </a>
                          <span
                            style={{
                              marginLeft: 10,
                              color: "gray",
                              fontWeight: "normal",
                            }}
                          >
                            {dayjs(son.comment.date).format(
                              "YYYY-MM-DD hh:mm:ss"
                            )}
                          </span>
                        </>
                      }
                      description={son.comment.content}
                    />
                  </List.Item>
                );
              })}
            </>
          )}
        />
      </div>
    </div>
  );
}
