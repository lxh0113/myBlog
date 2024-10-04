import "./index.scss";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Upload,
  Modal,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import type { UploadProps } from "antd";

import { useEffect, useState } from "react";
import {
  addNewLabelAPI,
  changeLabelAPI,
  deleteLabelAPI,
  getAllLabelsAPI,
} from "../../../../apis/label";
import { Column, Label } from "../../../../types";
import useUserStore from "../../../../stores/user";
import {
  addColumnAPI,
  getAllColumnsAPI,
} from "../../../../apis/column";

export default function Settings(props: any) {
  const { TextArea } = Input;

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const user = useUserStore((state: any) => state.user);

  const [labelFormRef] = Form.useForm();
  const [labelForm, setLabelForm] = useState<Label>({
    id: null,
    name: "",
    userId: user.id,
  });

  const toEditLabel = (item: Label) => {
    setModelTitleText("编辑标签");
    setLabelForm(item);

    labelFormRef.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const toDeleteLabel = async (id: number) => {
    let flag = confirm("你确定要删除当前标签吗");

    if (flag === false) return;

    const res = await deleteLabelAPI(id);

    if (res.data.code === 200) {
      message.success("删除成功");

      setLabelFlag(labelFlag + 1);

      props.addArticleLabels(
        props.articleLabels.filter((item: number) => {
          return item !== id;
        })
      );
    } else message.error(res.data.msg);
  };

  const [options, setOptions] = useState([]);
  let [labelFlag, setLabelFlag] = useState(0);

  useEffect(() => {
    const getLabels = async () => {
      const res = await getAllLabelsAPI();
      if (res.data.code === 200) {
        setOptions(
          res.data.data.map((item: Label) => {
            return {
              label:
                item.userId === user.id ? (
                  <div key={item.id} className="operation">
                    {item.name}
                    <span className="icons">
                      <EditOutlined
                        onClick={() => toEditLabel(item)}
                        style={{ marginLeft: 10 }}
                      />
                      <DeleteOutlined
                        onClick={() => toDeleteLabel(item.id!)}
                        style={{ marginLeft: 10, color: "red" }}
                      />
                    </span>
                  </div>
                ) : (
                  item.name
                ),
              value: item.id,
            };
          })
        );
      } else message.error(res.data.msg);
    };

    getLabels();
  }, [labelFlag]);

  const setLabels = (value: string[]) => {
    props.addArticleLabels(value);
  };

  const handleChange = (value: string | string[]) => {
    if (value.length > 3) {
      message.error("标签不能超过三个");
    } else setLabels(value as string[]);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelTitleText, setModelTitleText] = useState("新增标签");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const addLabel = () => {
    setModelTitleText("新建标签");
    labelFormRef.resetFields();
    showModal();
  };

  const handleOk = async () => {
    if (modelTitleText === "新建标签") {
      const res = await addNewLabelAPI({
        id: null,
        name: labelForm.name,
        userId: user.id,
      });

      if (res.data.code === 200) {
        message.success("新增成功");
        setLabelFlag(labelFlag + 1);
      } else message.error(res.data.msg);
    } else {
      // 编辑

      const res = await changeLabelAPI(labelForm);

      if (res.data.code === 200) {
        message.success("修改成功");
        setLabelFlag(labelFlag + 1);
      } else message.error(res.data.msg);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 这块是上传

  const uploadFileChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      console.log(info.fileList[0].response.data);
      props.setArticle({
        ...props.article,
        url: info.fileList[0].response.data,
      });
    }
  };

  const [columns, setColumns] = useState([]);
  const [columnFormRef] = Form.useForm();

  const [isColumnModal, setColumnModal] = useState(false);
  const [columnFlag, setColumnFlag] = useState(0);

  const handleColumnOk = async () => {
    console.log(columnData);

    const res = await addColumnAPI(columnData);

    if (res.data.code === 200) {
      message.success("新建成功");
      setColumnFlag(columnFlag + 1);
      setColumnData({
        ...columnData,
        name: "",
      });
    } else message.error(res.data.msg);

    setColumnModal(false);
  };

  const handleColumnCancel = () => {
    setColumnModal(false);
  };

  const [columnData, setColumnData] = useState<Column>({
    id: null,
    name: "",
    userId: user.id,
  });

  useEffect(() => {
    const getColumns = async () => {
      const res = await getAllColumnsAPI(user.id);

      if (res.data.code === 200) {
        setColumns(
          res.data.data.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
        setColumnData({
          ...columnData,
          name: "",
        });
      } else message.error(res.data.msg);
    };

    getColumns();
  }, [columnFlag]);

  return (
    <div className="myEditorSettingsBox">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          rules={[{ required: true }]}
          wrapperCol={{ span: 24 }}
          label="文章标签"
        >
          <Space>
            <Select
              mode="tags"
              value={props.articleLabels}
              size={"large"}
              placeholder="选择标签"
              onChange={handleChange}
              style={{ width: "300px" }}
              options={options}
            />
            <Button
              onClick={addLabel}
              size={"large"}
              type="primary"
              icon={<PlusOutlined />}
            >
              添加
            </Button>
          </Space>
        </Form.Item>
        <Form.Item
          label="添加封面"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            action="http://localhost:8080/api/upload"
            name="file"
            maxCount={1}
            onChange={uploadFileChange}
            listType="picture-card"
          >
            <button
              style={{ border: 0, background: "none", width: "200px" }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>添加文章封面</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="文章摘要">
          <TextArea
            value={props.article.brief}
            onChange={(e) =>
              props.setArticle({ ...props.article, brief: e.target.value })
            }
            rows={4}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          wrapperCol={{ span: 24 }}
          label="分类专栏"
        >
          <Space>
            <Select
              value={props.article.columnId}
              onChange={(value) =>
                props.setArticle({ ...props.article, columnId: value })
              }
              size={"large"}
              style={{ width: 200 }}
              options={columns}
            ></Select>
            <Button
              onClick={() => setColumnModal(true)}
              size={"large"}
              icon={<PlusOutlined />}
            >
              添加
            </Button>
          </Space>
        </Form.Item>
        <Form.Item label="文章类型">
          <Radio.Group
            value={props.article.kind}
            onChange={(e) =>
              props.setArticle({ ...props.article, kind: e.target.value })
            }
          >
            <Radio value={"原创"}> 原创 </Radio>
            <Radio value={"转载"}> 转载 </Radio>
            <Radio value={"翻译"}> 翻译 </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>

      <Modal
        title="新建专栏"
        open={isColumnModal}
        onOk={handleColumnOk}
        onCancel={handleColumnCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={columnFormRef}
          autoComplete="off"
        >
          <Form.Item<Column>
            label="名称"
            name="name"
            style={{ marginTop: 30 }}
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input
              value={columnData.name!}
              onChange={(e) =>
                setColumnData({ ...columnData, name: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={modelTitleText}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={labelFormRef}
          autoComplete="off"
        >
          <Form.Item<Label>
            label="名称"
            name="name"
            style={{ marginTop: 30 }}
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              value={labelForm.name!}
              onChange={(e) =>
                setLabelForm({ ...labelForm, name: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
