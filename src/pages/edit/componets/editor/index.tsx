import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

import { Input } from "antd";
import "./index.scss";

function MyEditor(props: any) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState("<p>hello</p>");

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml("<p>hello world</p>");
    }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  let editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    placeholder: "请输入内容...",
    MENU_CONF: {
      ["uploadImage"]: {
        fieldName: "file",
        server: "http://localhost:8080/api/upload/editor",
        allowedFileTypes: ["image/*"],
        onSuccess(file: File, res: any) {  // TS 语法
          // onSuccess(file, res) {          // JS 语法
              console.log(`${file.name} 上传成功`, res)
          },
      },

    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#f9f9fa",
          zIndex: 998,
          marginTop: 90,
        }}
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          className="myToolbar"
          style={{ border: "1px solid #eee"}}
        />
        <div className="myEditorTitleInputBox" style={{ zIndex: 1000 }}>
          <Input
            placeholder="请键入标题，不超过十个字"
            className="editorTitle"
            value={props.title}
            onChange={(e) => props.changeTitle(e.target.value)}
          ></Input>
        </div>
        <Editor
          className="myEditor"
          defaultConfig={editorConfig}
          value={props.content}
          onCreated={setEditor}
          onChange={(editor) => props.changeContent(editor.getHtml())}
          mode="default"
          style={{ minHeight:800,height: "100%", overflowY: "hidden" }}
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
    </>
  );
}

export default MyEditor;
