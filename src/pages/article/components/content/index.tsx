import "./index.scss";
import { useEffect, useState } from "react";

import { message, Tag } from "antd";
import { Drawer, Modal, Input, Space } from "antd";
import Comments from "../commets";
import classnames from "classnames";

import ColumnContent from "../columnContent";

import {
  FieldTimeOutlined,
  EyeOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { Button } from "antd";
import { useParams } from "react-router-dom";
import { getArticleByIdAPI } from "../../../../apis/article";
import useUserStore from "../../../../stores/user";
import { ArticleCollection, ArticleInfo } from "../../../../types";
import dayjs from "dayjs";
import { addFansAPI, deleteFansAPI } from "../../../../apis/fans";
import { addLoveAPI, deleteLoveAPI } from "../../../../apis/love";
import {
  addCollectionAPI,
} from "../../../../apis/collection";
import {
  changeCollectionOfArticleAPI,
  deleteCollectAPI,
  getArticleCollectAPI
} from "../../../../apis/collect";

export default function Content() {
  const [open, setOpen] = useState(false);
  const [openColumn, setOpenColumn] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showColumnDrawer = () => {
    setOpenColumn(true);
  };

  const onColumnClose = () => {
    setOpenColumn(false);
  };

  const param = useParams();

  const user = useUserStore((state: any) => state.user);

  const [articleInfo, setArticleInfo] = useState<ArticleInfo>();

  useEffect(() => {
    const getArticle = async () => {
      const res = await getArticleByIdAPI(
        user.id,
        parseInt(param.id as string)
      );

      if (res.data.code === 200) {
        setArticleInfo(res.data.data);
      } else message.error(res.data.msg);
    };

    getArticle();
  }, []);

  const toFollow = async () => {
    const res = await addFansAPI(articleInfo?.article?.userId!, user.id);

    if (res.data.code === 200) {
      setArticleInfo({
        ...articleInfo!,
        userIsFollow: true,
      });
      message.success("关注成功");
    } else message.error(res.data.msg);
  };

  const cancelFollow = async () => {
    const res = await deleteFansAPI(articleInfo?.article?.userId!, user.id);

    if (res.data.code === 200) {
      setArticleInfo({
        ...articleInfo!,
        userIsFollow: false,
      });
      message.success("取消关注成功");
    } else message.error(res.data.msg);
  };

  const toDealLove = async () => {
    if (articleInfo?.userIsLove === true) {
      const res = await deleteLoveAPI(user.id, articleInfo?.article!.id!);

      if (res.data.code === 200) {
        setArticleInfo({
          ...articleInfo!,
          userIsLove: false,
          love: articleInfo?.love! - 1,
        });
      } else message.error(res.data.msg);
    } else {
      const res = await addLoveAPI({
        id: null,
        articleId: articleInfo?.article!.id!,
        userId: user.id,
      });

      if (res.data.code === 200) {
        setArticleInfo({
          ...articleInfo!,
          userIsLove: true,
          love: articleInfo?.love! + 1,
        });
      } else message.error(res.data.msg);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isAddCollect, setIsCollect] = useState(false);

  const [collectName, setCollectName] = useState("");

  const addCollection = async () => {
    const res = await addCollectionAPI({
      id: null,
      name: collectName,
      userId: user.id,
    });

    if (res.data.code === 200) {
      message.success("添加成功");
      setIsCollect(false)
      // 重新获取
      setCollectionFlag(collectionFlag+1)
    } else message.error(res.data.msg);
    setIsModalOpen(false)
  };

  const [collectionFlag, setCollectionFlag] = useState(0);
  const [collectionList, setCollectionList] = useState<ArticleCollection[]>();

  useEffect(() => {
    const getCollection = async () => {
      const res = await getArticleCollectAPI(
        user.id,
        parseInt(param.id as string)
      );

      if (res.data.code === 200) {
        setCollectionList(res.data.data);
      } else message.error(res.data.msg);
    };
    getCollection();
  }, [collectionFlag]);

  const toCancelCollect = async () => {
    const res = await deleteCollectAPI(user.id, articleInfo?.article!.id!);

    if (res.data.code === 200) {
      message.success("取消收藏成功");
      setCollectionFlag(collectionFlag + 1);
      setIsModalOpen(false);
      setArticleInfo({
        ...articleInfo!,
        collect: articleInfo?.collect! - 1,
        userIsCollect:false
      });
    } else message.error(res.data.msg);
  };

  const toCollect = async (id: number) => {
    const res = await changeCollectionOfArticleAPI({
      id: null,
      collectionId: id,
      userId: user.id,
      articleId: articleInfo?.article!.id!,
      date: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    });

    if (res.data.code === 200) {
      message.success("收藏成功");
      setCollectionFlag(collectionFlag + 1);
      setIsModalOpen(false);
      setArticleInfo({
        ...articleInfo!,
        collect: articleInfo?.collect! + 1,
        userIsCollect:true
      });
    } else message.error(res.data.msg);
  };

  return (
    <div className="myArticleContentBox">
      <div className="title">{articleInfo?.article?.title}</div>
      <div className="detailsBox">
        <div className="left">
          {articleInfo?.article!.kind === "原创" ? (
            <Tag color="#f00">{articleInfo?.article?.kind}</Tag>
          ) : articleInfo?.article!.kind === "转载" ? (
            <Tag color="#389e0d">{articleInfo?.article?.kind}</Tag>
          ) : (
            <Tag color="purple">{articleInfo?.article?.kind}</Tag>
          )}
        </div>
        <div className="right">
          <div className="top">
            <span>
              <FieldTimeOutlined />
              <span>
                于{" "}
                {dayjs(articleInfo?.article?.date).format(
                  "YYYY-MM_DD hh:mm:ss"
                )}{" "}
                发布
              </span>
            </span>
            <span>
              <EyeOutlined />
              <span>浏览</span>
              {articleInfo?.browse}
            </span>
            <span>
              <StarOutlined />
              <span>收藏</span>
              {articleInfo?.collect}
            </span>
            <span>
              <LikeOutlined />
              <span>点赞</span>
              {articleInfo?.love}
            </span>
          </div>
          <div className="bottom">
            <span>
              分类专栏
              <Tag style={{ marginLeft: 10 }} color="red">
                {articleInfo?.column.name || "无"}
              </Tag>
            </span>
            <span>
              文章标签
              {articleInfo?.labels.map((item) => {
                return (
                  <Tag key={item.id} style={{ marginLeft: 10 }} color="red">
                    {item.name}
                  </Tag>
                );
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="content">
        <div
          dangerouslySetInnerHTML={{ __html: articleInfo?.article?.content! }}
        />
      </div>
      <div className="bottom">
        <div className="left">
          <img src={articleInfo?.user.avatar!} alt="" />
          <span className="username">{articleInfo?.user.username}</span>
          {user.id !== articleInfo?.user.id &&
            (articleInfo?.userIsFollow === true ? (
              <>
                <Button
                  onClick={cancelFollow}
                  color={"default"}
                  shape="round"
                  size="large"
                >
                  取消关注
                </Button>
              </>
            ) : (
              <Button
                onClick={toFollow}
                type="primary"
                shape="round"
                size="large"
              >
                关注
              </Button>
            ))}
        </div>
        <div className="right">
          <span
            className={classnames({ red: articleInfo?.userIsLove })}
            onClick={toDealLove}
          >
            <LikeOutlined />
            <span>{articleInfo?.love}</span>
          </span>
          <span
            className={classnames({ red: articleInfo?.userIsCollect })}
            onClick={showModal}
          >
            <StarOutlined />
            <span>{articleInfo?.collect}</span>
          </span>
          <span onClick={showDrawer}>
            <MessageOutlined />
            <span>{articleInfo?.comments}</span>
          </span>
          <Button
            onClick={showColumnDrawer}
            shape="round"
            size="large"
            icon={<UnorderedListOutlined />}
          >
            专栏目录
          </Button>
        </div>
      </div>

      <Drawer
        size={"large"}
        title="评论区，请友善发言"
        onClose={onClose}
        open={open}
      >
        <Comments></Comments>
      </Drawer>

      <Drawer
        title="专栏目录"
        placement={"left"}
        width={500}
        onClose={onColumnClose}
        open={openColumn}
      >
      <ColumnContent id={articleInfo?.article!.userId!}></ColumnContent>
      </Drawer>

      <Modal
        title="收藏夹"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button
          onClick={() => setIsCollect(true)}
          style={{ marginTop: 20, marginBottom: 20 }}
          color="default"
        >
          添加收藏夹
        </Button>
        <br />
        {isAddCollect && (
          <Space style={{ marginBottom: 20 }}>
            <Input
              value={collectName}
              onChange={(e) => setCollectName(e.target.value)}
              style={{ width: 320 }}
              size="large"
            ></Input>
            <Button onClick={addCollection} size="large" type="primary">
              确定
            </Button>
            <Button
              onClick={() => setIsCollect(false)}
              size="large"
              type="default"
            >
              取消
            </Button>
          </Space>
        )}
        {collectionList?.map((item: ArticleCollection) => {
          return (
            <div key={item.collection?.id} className="myCollectionModalBox">
              <div className="left">
                <div className="top">{item.collection?.name}</div>
              </div>
              <div className="right">
                {item.collected === true ? (
                  <Button
                    onClick={toCancelCollect}
                    shape={"round"}
                    type={"default"}
                  >
                    取消收藏
                  </Button>
                ) : (
                  <Button
                    onClick={() => toCollect(item.collection!.id!)}
                    shape={"round"}
                    type={"default"}
                  >
                    收藏
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Modal>
    </div>
  );
}
