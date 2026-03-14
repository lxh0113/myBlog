import { useEffect, useState } from "react";
import { Button, Select, Space, Table, TableProps, Tag } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Complain } from "../../../types";
import { Typography } from "antd";

export default function Comments() {
  const { Text, Link } = Typography;

  const [filterData, setFilterData] = useState({
    status: 0,
    type: 0,
  });

  useEffect(() => {}, [filterData]);

  const navigate = useNavigate();
  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

  const [complainList, setComplainList] = useState<Complain[]>([
    {
      id: 1,
      type: 1,
      reason: "政治敏感",
      userId: 1,
      complainArticle: 3,
      status: 1,
    },
  ]);

  const columns: TableProps<Complain>["columns"] = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (_, record) => {
        return record.type === 1 ? (
          <Text type="danger">色情，暴力</Text>
        ) : record.type === 2 ? (
          <Text type="danger">不当言论(涉政，歧视等)</Text>
        ) : (
          <Text type="danger">抄袭，侵权</Text>
        );
      },
    },
    {
      title: "违规内容描述",
      dataIndex: "reason",
      key: "id",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "id",
      render: (_, record) => {
        return record.status === 0 ? (
          <Tag color="red">未处理</Tag>
        ) : (
          <Tag color="volcano">已处理</Tag>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      render: (_, record) => {
        return (
          <Space>
            <Button
              color="#70cf41"
              onClick={() => {
                toArticle(record.complainArticle);
              }}
            >
              查看违规文章
            </Button>
            <Button color="#70cf41">打回该文章</Button>
            <Button type="primary">删除此条违规内容</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Space>
        <Select
          size="large"
          value={filterData.status}
          style={{ width: 120 }}
          onChange={(value) =>
            setFilterData({
              ...filterData,
              status: value,
            })
          }
          options={[
            { value: 1, label: "已处理" },
            { value: 0, label: "未处理" },
          ]}
        />
        <Select
          size="large"
          value={filterData.type}
          style={{ width: 240 }}
          onChange={(value) =>
            setFilterData({
              ...filterData,
              type: value,
            })
          }
          options={[
            { value: 0, label: "全部" },
            { value: 1, label: "色情，暴力" },
            { value: 2, label: "不当言论(涉政，歧视等)" },
            { value: 3, label: "抄袭，侵权" },
          ]}
        />
      </Space>
      <div className="bottom" style={{ marginTop: "20px" }}>
        <Table<Complain> columns={columns} dataSource={complainList} />
      </div>
    </>
  );
}
