import { useEffect, useState } from "react";
import "./index.scss";

import { Input, Space, Button, message, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { adminGetCommentsAPI, deleteCommentAPI } from "../../../apis/comment";
import { CommentInfo, Comment } from "../../../types";

import type { TableProps } from "antd";

export default function Comments() {
  const [commentFlag, setCommentFlag] = useState(0);

  const deleteComment = async (id: number) => {
    const res = await deleteCommentAPI(id);

    if (res.data.code === 200) {
      message.success("删除成功");
      setCommentFlag(commentFlag + 1);
    } else message.error(res.data.msg);
  };

  const [searchOption, setSearchOption] = useState({
    articleId: "",
    word: "",
  });

  const [commentsList, setCommentsList] = useState<CommentInfo[]>([]);

  const columns: TableProps<CommentInfo>["columns"] = [
    {
      title: "用户昵称",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "用户头像",
      dataIndex: ["user", "avatar"],
      key: "avatar",
      render: (value) => (
        <img
          style={{ width: 50, height: 50, borderRadius: 50 }}
          src={value}
          alt=""
        />
      ),
    },
    {
      title: "文章id",
      dataIndex: ["comment", "articleId"],
      key: "articleId",
    },
    {
      title: "评论内容",
      dataIndex: ["comment", "content"],
      key: "content",
    },
    {
      title: "日期",
      dataIndex: ["comment", "date"],
      key: "date",
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "comment",
      render: (comment: Comment) => (
        <>
          <Button type="link" danger onClick={() => deleteComment(comment.id!)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const getAllComments = async () => {
      let articleId = null;
      if (!parseInt(searchOption.articleId)) {
        articleId = 0;
      } else articleId = parseInt(searchOption.articleId);

      const res = await adminGetCommentsAPI(articleId!, searchOption.word);

      if (res.data.code === 200) {
        setCommentsList(res.data.data);
      } else message.error(res.data.msg);
    };

    getAllComments();
  }, [searchOption, commentFlag]);

  return (
    <div className="myBackCommentsBox">
      <Space style={{ marginBottom: 20 }}>
        <Input
          size="large"
          value={searchOption.articleId}
          onChange={(e) =>
            setSearchOption({
              ...searchOption,
              articleId: e.target.value,
            })
          }
          style={{ width: 200 }}
          placeholder="请输入文章id"
        ></Input>
        <Input
          size="large"
          value={searchOption.word}
          onChange={(e) =>
            setSearchOption({
              ...searchOption,
              word: e.target.value,
            })
          }
          placeholder="请输入关键词"
        ></Input>
        <Button size="large" type="primary" icon={<SearchOutlined />}>
          搜索
        </Button>
      </Space>
      <div className="tableBox">
        <Table<CommentInfo> dataSource={commentsList} columns={columns} />
      </div>
    </div>
  );
}
