import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import * as Yjs from "yjs";
import { wsUrl } from "@config";
import { useParams } from "react-router";
import { Button, Divider, Drawer, Select } from "antd";

import "./index.scss";
import useUserStore from "../../../../stores/user";
import {
  saveCooperateArticleAPI,
  getCooperateArticleAPI,
} from "../../../../apis/cooperateArticle";
import type { CooperateArticle } from "../../../../types";
import dayjs from "dayjs";
import type { DraggableData, DraggableEvent } from "react-draggable";
import Draggable from "react-draggable";

// ========== 静态配置 ==========
const fontSizeStyle = Quill.import("attributors/style/size");
fontSizeStyle.whitelist = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];

Quill.register(fontSizeStyle, true);
Quill.register("modules/cursors", QuillCursors);

const toolbarOptions = {
  container: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

// ========== 组件 ==========
const Editor: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const quillBindingRef = useRef<QuillBinding | null>(null); // 新增：保存 binding 实例
  const isContentSetRef = useRef<boolean>(false); // 新增：标记内容是否已设置

  const [isSaver, setIsSaver] = useState(false);
  const [loading, setLoading] = useState(true);

  const ydocRef = useRef<Yjs.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveVersionRef = useRef<string>(
    dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
  );
  const userIdRef = useRef<number>();

  const user = useUserStore((state: any) => state.user);

  // 获取文档ID
  const { id } = useParams();
  const docId = React.useMemo(() => parseInt(id || "1"), [id]);

  // 文章状态
  const [cooperateArticle, setCooperateArticle] = useState<CooperateArticle>({
    id: docId,
    time: new Date(),
    title: "",
    content: "",
    savedBy: user?.id,
    version: dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
  });

  // 用户ID引用
  useEffect(() => {
    if (user?.id) {
      userIdRef.current = user.id;
    }
  }, [user]);

  // ========== 获取文章详情 ==========
  const fetchArticleDetail = useCallback(async () => {
    if (!docId) return;

    try {
      setLoading(true);
      const res = await getCooperateArticleAPI(docId);
      if (res.data.code === 200 && res.data.data) {
        const articleData = res.data.data;
        console.log("获取到的文章内容:", articleData.content);

        setCooperateArticle({
          id: articleData.id,
          time: articleData.time || new Date(),
          title: articleData.title || "",
          content: articleData.content || "",
          savedBy: articleData.savedBy,
          version:
            articleData.version ||
            dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
        });
      }
    } catch (error) {
      console.error("获取文章详情失败:", error);
    } finally {
      setLoading(false);
    }
  }, [docId]);

  // 组件加载时获取文章详情
  useEffect(() => {
    fetchArticleDetail();
  }, [fetchArticleDetail]);

  // 保存函数
  const saveCooperateArticle = useCallback(
    async (article: CooperateArticle) => {
      try {
        const res = await saveCooperateArticleAPI(article);
        if (res.data.code === 200) {
          lastSaveVersionRef.current = article.version!;
          console.log("保存成功");
        } else {
          console.log("保存失败");
        }
      } catch (error) {
        console.error("保存请求失败:", error);
      }
    },
    [],
  );

  // 执行保存的函数
  const performSave = useCallback(async () => {
    if (!ydocRef.current || !quillRef.current) return;

    try {
      const content = quillRef.current.root.innerHTML;
      const version = dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");

      if (version === lastSaveVersionRef.current) {
        console.log("内容无变化，跳过保存");
        return;
      }

      console.log("开始保存文档...");

      setCooperateArticle((prev) => {
        const updatedArticle = {
          ...prev,
          content,
          version,
        };

        saveCooperateArticle(updatedArticle);

        return updatedArticle;
      });
    } catch (error) {
      console.error("保存出错:", error);
    }
  }, [saveCooperateArticle]);

  // 选举保存者
  const electSaver = useCallback((awareness: any) => {
    const states = Array.from(awareness.getStates().values());
    const activeUsers = states
      .filter((state) => state.user && state.user.id)
      .map((state) => state.user.id)
      .sort();

    console.log("当前活跃用户:", activeUsers);

    if (activeUsers.length === 0) {
      setIsSaver(false);
      return;
    }

    const primarySaverId = activeUsers[0];
    const amISaver = primarySaverId === userIdRef.current;
    setIsSaver(amISaver);
    console.log(
      `我是${amISaver ? "保存者" : "普通用户"}, 当前保存者: ${primarySaverId}`,
    );
  }, []);

  // ========== 初始化编辑器 ==========
  useEffect(() => {
    if (!container.current || quillRef.current) return;
    if (loading) return;

    console.log("初始化编辑器...");

    // 1. 初始化 Quill 编辑器
    const quill = new Quill(container.current, {
      theme: "snow",
      placeholder: "请输入内容",
      modules: {
        toolbar: toolbarOptions,
        history: { userOnly: true },
        cursors: true,
      },
    });

    quillRef.current = quill;

    // 2. 初始化 Yjs
    const doc = new Yjs.Doc();
    ydocRef.current = doc;
    const text = doc.getText("quill");

    // 3. WebSocket 连接
    const websocketProvider = new WebsocketProvider(
      wsUrl,
      docId.toString(),
      doc,
    );
    providerRef.current = websocketProvider;
    const awareness = websocketProvider.awareness;

    // 4. 设置用户信息
    const userColor =
      "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
    awareness.setLocalStateField("user", {
      id: userIdRef.current,
      name: user?.username || "匿名用户",
      color: userColor,
    });

    // 5. 绑定 Quill 和 Yjs - 但先不自动同步初始内容
    const quillBinding = new QuillBinding(text, quill, awareness);
    quillBindingRef.current = quillBinding;

    // 6. 监听 awareness 变化
    awareness.on("change", () => {
      const allUsers = Array.from(awareness.getStates().values()).map(
        (item) => item.user,
      );
      console.log("当前在线用户:", allUsers);
      electSaver(awareness);
    });

    // 7. 同步完成后的处理
    websocketProvider.on("synced", () => {
      console.log("WebSocket 同步完成");

      // 8. 只在第一次同步完成后设置初始内容
      if (
        !isContentSetRef.current &&
        cooperateArticle.content &&
        quillRef.current
      ) {
        console.log("设置初始内容到 Quill");

        // 临时移除事件监听，避免触发额外的渲染
        quill.off("text-change");

        // 转换并设置内容
        const tempDelta = quill.clipboard.convert({
          html: cooperateArticle.content,
        });

        // 使用 silent 方式设置内容
        quill.setContents(tempDelta, "silent");

        // 重新添加事件监听
        quill.on("text-change", () => {});

        isContentSetRef.current = true;
      }

      setTimeout(() => electSaver(awareness), 1000);
    });

    // 清理函数
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      if (quillBindingRef.current) {
        quillBindingRef.current.destroy();
      }

      if (providerRef.current) {
        providerRef.current.destroy();
      }

      if (ydocRef.current) {
        ydocRef.current.destroy();
      }

      quillRef.current = null;
      quillBindingRef.current = null;
      isContentSetRef.current = false;
    };
  }, [docId, user, loading]); // 移除 cooperateArticle.content 依赖

  // 自动保存逻辑
  useEffect(() => {
    const startAutoSave = () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      saveIntervalRef.current = setInterval(() => {
        if (isSaver && ydocRef.current && quillRef.current) {
          console.log("我是保存者，执行定时保存");
          performSave();
        }
      }, 30000);
    };

    startAutoSave();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        isSaver &&
        ydocRef.current &&
        quillRef.current
      ) {
        performSave();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [isSaver, performSave]);

  // 页面关闭前的保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (ydocRef.current && quillRef.current) {
        const content = quillRef.current.root.innerHTML;
        const blob = new Blob(
          [
            JSON.stringify({
              id: docId,
              title: cooperateArticle.title,
              content,
              version: dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
              savedBy: userIdRef.current,
            }),
          ],
          { type: "application/json" },
        );

        navigator.sendBeacon("/api/cooperate-article/save", blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cooperateArticle.title, docId]);

  // 标题修改处理
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCooperateArticle((prev) => ({
        ...prev,
        title: e.target.value,
      }));
    },
    [],
  );

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="quillBackBox">
      {loading ? (
        <div className="loading-container">加载中...</div>
      ) : (
        <>
          <Button onClick={showDrawer}>文本润色</Button>
          <div className="titleContainer">
            <input
              className="titleInput"
              placeholder="请输入标题"
              type="text"
              value={cooperateArticle.title}
              onChange={handleTitleChange}
            />
          </div>
          <div ref={container} />
        </>
      )}
      <Drawer
        title="AI帮手"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        mask={false}
        open={open}
      >
        <Select
          defaultValue="lucy"
          style={{ width: 120, marginBottom: 20 }}
          onChange={handleChange}
          options={[
            { value: "jack", label: "AI润色" },
            { value: "lucy", label: "AI翻译" },
            { value: "Yiminghe", label: "AI扩写" },
            { value: "lixiaohui", label: "AI纠错" },
            { value: "lizeyan", label: "AI总结" },
          ]}
        />
        <p>当前选择文本</p>
        {quillRef.current?.getSelection()
          ? quillRef.current?.getText(
              quillRef.current.getSelection()?.index,
              quillRef.current.getSelection()?.length,
            )
          : ""}
        <Divider></Divider>
        <p>转换后结果</p> <div className="converted-content"></div>
        <Divider></Divider>
        <Button type="primary">替换当前选中内容</Button>
      </Drawer>
    </div>
  );
};

export default Editor;
