import "../edit/index.scss";

import Header from "../home/components/header";
import MyEditor from "../edit/componets/editor";

import Settings from "./componets/settings";
import Buttom from "./componets/bottom";

import { ConfigProvider, message } from "antd";
import { useEffect, useState } from "react";
import { Article } from "../../types";
import useUserStore from "../../stores/user";
import { useNavigate, useParams } from "react-router-dom";
import {
  getArticleAPI,
  publishArticleAPI,
  saveArticleAPI,
} from "../../apis/article";
import { changeArticleLabelsAPI } from "../../apis/articleLabel";

export default function Edit() {
  const user = useUserStore((state: any) => state.user);

  const [article, setArticle] = useState<Article>({
    id: null,
    title: "",
    content: "",
    columnId: null,
    userId: user.id,
    date: null,
    url: "",
    status: 0,
    kind: "原创",
    categoryId: null,
    brief: "",
  });

  let [content, setContent] = useState("");

  const [articleLabels, addArticleLabels] = useState([]);

  const changeTitle = (newValue: string) => {
    console.log(newValue);
    setArticle({
      ...article,
      title: newValue,
    });
    console.log(article.title);
  };

  const changeContent = (value: string) => {
    console.log(value);
    setContent(value);
  };

  const param = useParams();

  useEffect(() => {
    const init = async () => {
      if (param?.id) {
        const res = await getArticleAPI(parseInt(param.id));
        if (res.data.code === 200) {
          setArticle(res.data.data.article);
          content = res.data.data.article.content;
          addArticleLabels(
            res.data.data.labels.map((item: any) => {
              return item.id;
            })
          );
        } else {
          message.error(res.data.msg);
        }
      }
    };

    init();
  }, []);

  const navigate = useNavigate();

  const save = async () => {
    // 获取好了文章信息可以发布了

    if (articleLabels.length < 1) {
      message.error("必须设置至少一个标签");
      return;
    }

    let data: Article = JSON.parse(JSON.stringify(article));
    console.log(content);
    data.content = content;

    console.log(data);

    const res = await saveArticleAPI(data);

    if (res.data.code === 200) {
      if (article.id) navigate("/edit/" + res.data.data.id);

      // 还有标签需要修改
      const response = await changeArticleLabelsAPI(
        articleLabels.map((item) => {
          return {
            id: null,
            articleId: res.data.data.id,
            labelId: item,
          };
        })
      );

      if (response.data.code === 200) {
        message.success("保存成功");
      } else message.error(response.data.msg);
    } else message.error("保存失败");
  };

  const publish = async () => {
    if (articleLabels.length < 1) {
      message.error("必须设置至少一个标签");
      return;
    }

    let data: Article = JSON.parse(JSON.stringify(article));
    console.log(content);
    data.content = content;

    console.log(data);
    const res = await publishArticleAPI(data);

    if (res.data.code === 200) {
      const response = await changeArticleLabelsAPI(
        articleLabels.map((item) => {
          return {
            id: null,
            articleId: res.data.data.id,
            labelId: item,
          };
        })
      );

      if (response.data.code === 200) {
        message.success("发布成功");
        setTimeout(()=>{
          navigate("/content")
        },2000)
      } else message.error(response.data.msg);
    } else message.error(res.data.msg);
  };

  console.log(article.title);

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#ff4d4f",
          borderRadius: 4,

          // 派生变量，影响范围小
          colorBgContainer: "#fff",
        },
      }}
    >
      <div className="homeBody">
        <Header></Header>
        <MyEditor
          title={article.title}
          content={article.content}
          changeTitle={changeTitle}
          changeContent={changeContent}
        ></MyEditor>
        <Settings
          article={article}
          setArticle={setArticle}
          articleLabels={articleLabels}
          addArticleLabels={addArticleLabels}
        ></Settings>
        <Buttom save={save} publish={publish}></Buttom>
      </div>
    </ConfigProvider>
  );
}
