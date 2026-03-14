import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import * as Yjs from "yjs";
import { wsUrl } from "@config"; // 假设你有 apiUrl 配置
import { useParams } from "react-router";

import "./index.scss";
import useUserStore from "../../../../stores/user";
import { saveCooperateArticleAPI } from "../../../../apis/cooperateArticle";
import type { CooperateArticle } from "../../../../types";
import dayjs from "dayjs";

const Editor: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const [isSaver, setIsSaver] = useState(false); // 当前用户是否是保存者
  const ydocRef = useRef<Yjs.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveVersionRef = useRef<string>(
    dayjs(new Date()).format("YYYY/MM/DD hh:mm:ss"),
  ); // 记录上次保存的内容版本
  const userIdRef = useRef<number>();

  // 字体大小配置（你的原有代码）
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

  const user = useUserStore((state: any) => state.user);

  // 生成稳定的用户ID（用于保存者选举）
  useEffect(() => {
    // 使用后端返回的用户ID
    userIdRef.current = user.id;
  }, [user]);

  // 选举保存者的函数
  const electSaver = useCallback((awareness: any) => {
    const states = Array.from(awareness.getStates().values());
    const activeUsers = states
      .filter((state) => state.user && state.user.id)
      .map((state) => state.user.id)
      .sort(); // 按用户ID排序，确保选举结果一致

    console.log("当前活跃用户:", activeUsers);

    if (activeUsers.length === 0) {
      setIsSaver(false);
      return;
    }

    // 选举规则：用户ID最小的作为保存者
    const primarySaverId = activeUsers[0];
    const amISaver = primarySaverId === userIdRef.current;

    setIsSaver(amISaver);
    console.log(
      `我是${amISaver ? "保存者" : "普通用户"}, 当前保存者: ${primarySaverId}`,
    );
  }, []);

  const [cooperateArticle, setCooperateArticle] = useState<CooperateArticle>({
    id: null,
    time: new Date(),
    title: "",
    content: "",
    savedBy: user.id,
    version: dayjs(new Date()).format("YYYY/MM/DD hh:mm:ss"),
  });

  // 获取文档ID
  const { id } = useParams();
  console.log(id);
  let docId = parseInt(id) || 1;
  console.log(docId);

  const saveCooperateArticle = async (cooperateArticle: CooperateArticle) => {
    const res = await saveCooperateArticleAPI(cooperateArticle);

    if (res.data.code === 200) {
      lastSaveVersionRef.current = cooperateArticle.version!;
      console.log("保存成功");
    } else {
      console.log("保存失败");
    }
  };

  // 执行保存的函数
  const performSave = useCallback(async (ydoc: Yjs.Doc, id: number) => {
    try {
      // 获取当前文档内容
      const content = ydoc.getText("quill").toString();

      // 计算内容的简单哈希作为版本号（也可以使用时间戳）
      const version = dayjs(new Date()).format("YYYY/MM/DD hh:mm:ss");

      // 如果内容没变化，就不保存
      if (version === lastSaveVersionRef.current) {
        console.log("内容无变化，跳过保存");
        return;
      }

      console.log("开始保存文档...");
      setCooperateArticle({
        ...cooperateArticle,
        id,
        content,
        version,
      });

      saveCooperateArticle(cooperateArticle);
    } catch (error) {
      console.error("保存出错:", error);
    }
  }, []);

  useEffect(() => {
    if (!container.current) return;

    // 初始化 Quill 编辑器（你的原有代码）
    const quill = new Quill(container.current, {
      theme: "snow",
      placeholder: "请输入内容",
      modules: {
        toolbar: toolbarOptions,
        history: { userOnly: true },
        cursors: true,
      },
    });

    quill.on("text-change", () => {
      // console.log("text change", quill.root.innerHTML);
    });

    // 初始化 Yjs
    const doc = new Yjs.Doc();
    ydocRef.current = doc;
    const text = doc.getText("quill");

    // 初始化 WebSocket 连接
    const websocketProvider = new WebsocketProvider(wsUrl, docId + "", doc);
    providerRef.current = websocketProvider;
    const awareness = websocketProvider.awareness;

    // 设置当前用户信息（在你的基础上增加 id 字段）
    const userColor =
      "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
    awareness.setLocalStateField("user", {
      id: userIdRef.current, // 新增：用户唯一ID
      name: user?.username || "匿名用户",
      color: userColor,
    });

    // 创建 quill 绑定
    const quillBinding = new QuillBinding(text, quill, awareness);

    // 监听 awareness 变化，用于选举保存者
    awareness.on("change", () => {
      const allUsers = Array.from(awareness.getStates().values()).map(
        (item) => item.user,
      );
      console.log("当前在线用户:", allUsers);

      // 每次在线用户变化时，重新选举保存者
      electSaver(awareness);
    });

    // 初始连接稳定后执行选举
    websocketProvider.on("synced", () => {
      console.log("WebSocket 同步完成");
      setTimeout(() => electSaver(awareness), 1000);
    });

    // 定期保存逻辑
    const startAutoSave = () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      saveIntervalRef.current = setInterval(() => {
        // 只有被选举为保存者的用户才执行保存
        if (isSaver && ydocRef.current) {
          console.log("我是保存者，执行定时保存");
          performSave(ydocRef.current, docId);
        } else {
          console.log("我不是保存者，跳过保存");
        }
      }, 30000); // 30秒保存一次
    };

    startAutoSave();

    // 监听用户离开页面时的强制保存
    const handleBeforeUnload = () => {
      if (ydocRef.current) {
        saveCooperateArticle(cooperateArticle);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // 监听保存者状态变化，动态调整保存间隔
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isSaver && ydocRef.current) {
        // 如果当前是保存者且标签页隐藏，立即保存一次
        performSave(ydocRef.current, docId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 清理函数
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }

      websocketProvider.destroy();
      quillBinding.destroy();
      doc.destroy();
    };
  }, [user, isSaver]); // 依赖 isSaver 以便在角色变化时重新设置保存逻辑

  return (
    <>
      <div className="quillBackBox">
        <div className="titleContainer">
          <input
            className="titleInput"
            placeholder="请输入标题"
            type="text"
            value={cooperateArticle.title}
            onChange={(e) =>
              setCooperateArticle({
                ...cooperateArticle,
                title: e.target.value,
              })
            }
          />
        </div>
        <div ref={container} />
      </div>
    </>
  );
};

export default Editor;
