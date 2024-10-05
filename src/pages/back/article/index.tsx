import "./index.scss";
import { Table, Select, Space, Input, Button, message, Tag } from "antd";
import type { TableProps } from "antd";
import { ArticleInfo } from "../../../types";
import { useEffect, useState } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { adminGetArticlesAPI, failUploadAPI, successUploadAPI } from "../../../apis/article";
import { useNavigate } from "react-router-dom";

export default function Article() {
  const columns: TableProps<ArticleInfo>["columns"] = [
    {
      title: "用户名字",
      dataIndex: ["user", "username"],
      key: "user.id",
    },
    {
      title: "用户头像",
      dataIndex: ["user", "avatar"],
      key: "user.id",
      render: (value: string) => (
        <img style={{ width: 50, height: 50 }} src={value} alt="" />
      ),
    },
    {
      title: "文章标题",
      dataIndex: ["article", "title"],
      key: "article.id",
    },
    {
      title: "文章简介",
      dataIndex: ["article", "brief"],
      key: "article.id",
    },
    {
      title: "时间",
      key: "article.id",
      dataIndex: ["article", "date"],
    },
    {
      title: "类别",
      dataIndex: ["article", "kind"],
      render: (tag: string) => (
        <>
          {tag === "原创" && <Tag color="#f00">{tag}</Tag>}
          {tag === "转载" && <Tag color="#70cf41">{tag}</Tag>}
          {tag === "翻译" && <Tag color="#9673b3">{tag}</Tag>}
        </>
      ),
      key: "article.id",
    },
    {
      title: "操作",
      dataIndex: "article",
      render: (article) => (
        <>
          <Button type={"link"} onClick={() => toArticle(article.id)}>
            查看
          </Button>
          {(article.status === 1 || article.status === 3) && <Button onClick={()=>successAudit(article.id)} type={"link"}>审核成功</Button>}
          {(article.status === 1 || article.status === 2) && <Button onClick={()=>failAudit(article.id)} type={"link"}>审核失败</Button>}
        </>
      ),
      key: "article.id",
    },
  ];

  const [articleList, setArticleList] = useState<ArticleInfo[]>();

  const [searchOption, setSearchOption] = useState({
    status: 4,
    word: "",
  });

  const navigate = useNavigate();

  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

  const [articleFlag,setArticleFlag]=useState(0)

  useEffect(() => {
    const getArticle = async () => {
      const res = await adminGetArticlesAPI(
        searchOption.status,
        searchOption.word
      );

      if (res.data.code === 200) {
        setArticleList(res.data.data);
      } else message.error(res.data.msg);
    };

    getArticle();
  }, [searchOption,articleFlag]);

  const successAudit =async (id: number) => {
    const res = await successUploadAPI(id);

    if(res.data.code===200){
        message.success("审核成功")
        setArticleFlag(articleFlag+1)
    }
    else message.error(res.data.msg)
  };

  const failAudit =async (id: number) => {
    const res = await failUploadAPI(id);

    if(res.data.code===200){
        message.success("审核失败成功")
        setArticleFlag(articleFlag+1)
    }else message.error(res.data.msg)
  };

  return (
    <div className="myBackArticleBox">
      <Space style={{ marginBottom: 20 }}>
        <Select
          size="large"
          style={{ width: 120 }}
          defaultValue={"4"}
          onChange={(value) =>
            setSearchOption({
              ...searchOption,
              status: parseInt(value),
            })
          }
          options={[
            { key: 1, value: "1", label: "待审核" },
            { key: 2, value: "2", label: "审核成功" },
            { key: 3, value: "3", label: "审核失败" },
            { key: 4, value: "4", label: "所有" },
          ]}
        />
        <Input
          size="large"
          style={{ width: 240 }}
          placeholder="请输入你要查找的关键词"
          value={searchOption.word}
          onChange={(e) =>
            setSearchOption({
              ...searchOption,
              word: e.target.value,
            })
          }
        ></Input>
        <Button size="large" type="primary" icon={<SearchOutlined />}>
          查询
        </Button>
      </Space>
      <Table<ArticleInfo> columns={columns} dataSource={articleList} />
    </div>
  );
}
