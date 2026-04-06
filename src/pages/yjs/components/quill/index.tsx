import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import * as Yjs from "yjs";
import { wsUrl } from "@config";
import { useParams } from "react-router";
import { Button, Divider, Drawer, message, Modal, Select, Space } from "antd";

import "./index.scss";
import useUserStore from "../../../../stores/user";
import {
  saveCooperateArticleAPI,
  getCooperateArticleAPI,
} from "../../../../apis/cooperateArticle";
import type { CooperateArticle } from "../../../../types";
import dayjs from "dayjs";
import { convert } from "../../../../utils/ai";

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
  const quillBindingRef = useRef<QuillBinding | null>(null);
  const isContentSetRef = useRef<boolean>(false);

  const [isSaver, setIsSaver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [canEdit, setCanEdit] = useState(false); // 新增：是否有编辑权限

  const ydocRef = useRef<Yjs.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveVersionRef = useRef<string>(
    dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
  );
  const userIdRef = useRef<number>();

  const user = useUserStore((state: any) => state.user);

  // 获取文档ID
  // 直接从路径中提取 ID
  const docId = React.useMemo(() => {
    const match = location.pathname.match(/\/cooperation\/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 1;
  }, [location.pathname]);

  // 文章状态
  const [cooperateArticle, setCooperateArticle] = useState<CooperateArticle>({
    id: docId,
    time: dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
    title: "",
    content: "",
    savedBy: user?.id,
    version: dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
    role: "view", // 默认只读权限
  });

  // 用户ID引用
  useEffect(() => {
    if (user?.id) {
      userIdRef.current = user.id;
    }
  }, [user]);

  // ========== 检查编辑权限 ==========
  const checkEditPermission = useCallback((article: CooperateArticle) => {
    // 如果当前用户是文章创建者 或者 文章权限是edit，则有编辑权限
    const hasEditPermission =
      userIdRef.current === article.createdBy || article.role === "edit";
    setCanEdit(hasEditPermission);
    return hasEditPermission;
  }, []);

  // ========== 获取文章详情 ==========
  const fetchArticleDetail = useCallback(async () => {
    if (!docId) return;

    try {
      setLoading(true);
      const res = await getCooperateArticleAPI(docId);
      if (res.data.code === 200 && res.data.data) {
        const articleData = res.data.data;
        console.log("获取到的文章内容:", articleData.content);

        const newArticle = {
          id: articleData.id,
          time: articleData.time || new Date(),
          title: articleData.title || "",
          content: articleData.content || "",
          savedBy: articleData.savedBy,
          createdBy: articleData.createdBy,
          version:
            articleData.version ||
            dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss"),
          role: articleData.role || "view",
        };

        setCooperateArticle(newArticle);

        // 检查编辑权限
        checkEditPermission(newArticle);
      }
    } catch (error) {
      console.error("获取文章详情失败:", error);
    } finally {
      setLoading(false);
    }
  }, [docId, checkEditPermission]);

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
    if (!canEdit) {
      console.log("无编辑权限，跳过保存");
      return;
    }

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
  }, [saveCooperateArticle, canEdit]);

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
        toolbar: canEdit ? toolbarOptions : false, // 根据权限控制工具栏
        history: { userOnly: true },
        cursors: true,
      },
      readOnly: !canEdit, // 根据权限设置只读模式
    });

    quillRef.current = quill;

    // 监听选中文本变化（只读模式下也需要显示选中文本）
    quill.on(
      "selection-change",
      (range: any, oldRange: any, source: string) => {
        if (range) {
          if (range.length > 0) {
            const text = quill.getText(range.index, range.length);
            setSelectedText(text);
          } else {
            setSelectedText("");
          }
        } else {
          setSelectedText("");
        }
      },
    );

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
      canEdit, // 将编辑权限同步给其他用户
    });

    // 5. 绑定 Quill 和 Yjs
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

        quill.off("selection-change");
        quill.off("text-change");

        const tempDelta = quill.clipboard.convert({
          html: cooperateArticle.content,
        });

        quill.setContents(tempDelta, "silent");

        quill.on("selection-change", (range: any) => {
          if (range && range.length > 0) {
            const text = quill.getText(range.index, range.length);
            setSelectedText(text);
          } else {
            setSelectedText("");
          }
        });
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
  }, [docId, user, loading, canEdit]); // 添加 canEdit 依赖

  // 自动保存逻辑
  useEffect(() => {
    if (!canEdit) return; // 无编辑权限时不启动自动保存

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
  }, [isSaver, performSave, canEdit]);

  // 页面关闭前的保存
  useEffect(() => {
    if (!canEdit) return; // 无编辑权限时不保存

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
              role: cooperateArticle.role,
            }),
          ],
          { type: "application/json" },
        );

        navigator.sendBeacon("http://locahost:8080/api/cooperate/save", blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cooperateArticle.title, docId, canEdit, cooperateArticle.role]);

  // 标题修改处理
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canEdit) return; // 无编辑权限不能修改标题
      setCooperateArticle((prev) => ({
        ...prev,
        title: e.target.value,
      }));
    },
    [canEdit],
  );

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [type, setType] = useState("polish");

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setType(value);
  };

  // 如果需要保留富文本格式
  const replaceSelectedText = () => {
    if (!quillRef.current) {
      message.warning("编辑器未初始化");
      return;
    }

    if (!convertedContent) {
      message.warning("没有可替换的内容");
      return;
    }

    const selection = quillRef.current.getSelection();
    if (!selection || selection.length === 0) {
      message.warning("请先选中要替换的文本");
      return;
    }

    const extractHtmlFromNode = (node: React.ReactNode): string => {
      if (!node) return "";
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (Array.isArray(node)) {
        return node.map((item) => extractHtmlFromNode(item)).join("");
      }

      if (React.isValidElement(node)) {
        const element = node as React.ReactElement<any>;
        const props = element.props || {};

        if (props.dangerouslySetInnerHTML?.__html) {
          return props.dangerouslySetInnerHTML.__html;
        }

        if (props.children) {
          return extractHtmlFromNode(props.children);
        }
      }

      return "";
    };

    const htmlContent = extractHtmlFromNode(convertedContent)?.trim();

    if (!htmlContent) {
      message.warning("无法提取 markdown 内容");
      return;
    }

    const { index, length } = selection;
    const quill = quillRef.current;
    const prevLen = quill.getLength();

    quill.deleteText(index, length, "user");
    quill.clipboard.dangerouslyPasteHTML(index, htmlContent, "user");

    const insertedLength = quill.getLength() - prevLen + length;
    quill.setSelection(index, insertedLength, "user");

    message.success("已替换选中内容");
  };

  const [convertedContent, setConvertedContent] =
    useState<React.ReactNode>(null);

  const handleConvert = async () => {
    const result = await convert(type, selectedText, setConvertedContent);
    setConvertedContent(result);
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

  const [role, setRole] = useState("view");

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const setArticleRole = async () => {
    // 这里调用更新文章权限的API
    console.log("设置文章权限为:", role);
  };

  const getLink = async () => {
    await setArticleRole();
    // 复制链接到剪贴板
    const link = `${window.location.origin}/cooperate/${docId}`;
    await navigator.clipboard.writeText(link);
    message.success("链接已经复制到粘贴板上");
  };

  return (
    <div className="quillBackBox">
      {loading ? (
        <div className="loading-container">加载中...</div>
      ) : (
        <>
          <Space style={{ marginBottom: 20 }}>
            {canEdit && ( // 只有有编辑权限才显示这些按钮
              <>
                <Button onClick={showDrawer}>文本润色</Button>
                <Button
                  type="primary"
                  onClick={() => message.success("文章已经自动保存")}
                >
                  保存
                </Button>
              </>
            )}
            {/* 创建者才能看到分享按钮 */}

            {userIdRef.current === cooperateArticle.createdBy && (
              <Button color="purple" type="primary" onClick={showModal}>
                分享
              </Button>
            )}
          </Space>
          <div className="titleContainer">
            <input
              className="titleInput"
              placeholder="请输入标题"
              type="text"
              value={cooperateArticle.title}
              onChange={handleTitleChange}
              readOnly={!canEdit} // 根据权限设置只读
            />
          </div>
          <div ref={container} />
          {!canEdit && <div className="readonly-tip">当前文档为只读模式</div>}
        </>
      )}
      {/* AI润色抽屉 - 只有有编辑权限才能打开 */}
      {canEdit && (
        <Drawer
          title="AI帮手"
          closable={{ "aria-label": "Close Button" }}
          onClose={onClose}
          mask={false}
          open={open}
        >
          <Space style={{ marginBottom: 20 }}>
            <Select
              defaultValue="polish"
              style={{
                width: 120,
                marginBottom: 0,
              }}
              value={type}
              onChange={handleChange}
              options={[
                { value: "polish", label: "AI润色" },
                { value: "translate", label: "AI翻译" },
                { value: "expand", label: "AI扩写" },
                { value: "correct", label: "AI纠错" },
                { value: "summary", label: "AI总结" },
              ]}
            />
            <Button type="primary" onClick={handleConvert}>
              转换
            </Button>
          </Space>

          <p>当前选择文本</p>
          <Divider />
          <div className="selected-text">
            <p>{selectedText || "未选中任何文本"}</p>
          </div>
          <Divider />
          <p>转换后结果</p>
          <Divider />
          <div className="converted-content">{convertedContent}</div>
          <Divider />
          {/* <div className="converted-content"></div> */}
          {/* <Divider /> */}
          <Button type="primary" onClick={replaceSelectedText}>
            替换当前选中内容
          </Button>
        </Drawer>
      )}
      {/* 分享弹窗 - 只有创建者才能看到 */}
      {userIdRef.current === cooperateArticle.createdBy && (
        <Modal
          title="分享设置"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          footer={null}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Space>
            <p>获得此链接的人的权限</p>
            <Select
              value={role}
              style={{ width: 120 }}
              onChange={handleRoleChange}
              options={[
                { value: "view", label: "查看" },
                { value: "edit", label: "编辑" },
              ]}
            />
          </Space>
          <Divider />
          <Button type="primary" onClick={getLink}>
            复制分享链接
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default Editor;
