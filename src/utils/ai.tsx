import {
  getCorrectTextAPI,
  getRewriteTextAPI,
  getTranslateTextAPI,
} from "../apis/ai";
import { marked } from "marked";
import { SSEService } from "./sse";
import DOMPurify from "dompurify";
import type { ReactNode } from "react";

async function polishText(text: string) {
  const res = await getRewriteTextAPI(text);

  if (res.data.code === 0) {
    let obj = JSON.parse(res.data.data.result);
    console.log("润色结果:", obj);

    // 处理不同格式的返回结果
    let polishedText = "";

    if (typeof obj === "string") {
      polishedText = obj;
    } else if (Array.isArray(obj) && obj.length > 0) {
      if (typeof obj[0] === "string") {
        polishedText = obj[0];
      } else if (Array.isArray(obj[0]) && obj[0].length > 0) {
        polishedText = obj[0][0];
      } else {
        polishedText = JSON.stringify(obj);
      }
    }

    if (!polishedText) {
      return (
        <div style={{ padding: "16px", textAlign: "center", color: "#ff4d4f" }}>
          ⚠️ 未获取到润色结果
        </div>
      );
    }

    return renderMarkdownNode(polishedText);
  } else {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#ff4d4f" }}>
        ⚠️ 改写服务调用失败，请重试
      </div>
    );
  }
}

async function translateText(
  text: string,
  fromLang: string = "cn",
  toLang: string = "en",
) {
  const res = await getTranslateTextAPI(text, fromLang, toLang);
  console.log("翻译响应:", res);

  if (res.data.code === 200) {
    const translatedText = res.data.data.result;
    console.log("翻译结果:", translatedText);

    return renderMarkdownNode(translatedText);
  } else {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#ff4d4f" }}>
        ⚠️ 翻译服务调用失败，请重试
      </div>
    );
  }
}

marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderMarkdownNode = async (content: string): Promise<ReactNode> => {
  const html = await marked.parse(content || "");
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
};

// 扩写函数 - 实时更新，完成后返回最终 JSX
async function expandText(
  text: string,
  setContent: (jsx: ReactNode) => void,
): Promise<ReactNode> {
  let fullText = "";
  let isCompleted = false;

  const sseService = new SSEService();

  await sseService.connect(
    "https://elysiatools.com/zh/api/tools/text-expander",
    "POST",
    {
      text,
      inputLanguage: "zh",
      expansionType: "detailed",
      targetLength: "medium",
      exportFormat: "markdown",
      outputLanguage: "zh",
      expansionStyle: "formal",
    },
    async (event: any) => {
      const data = event.data;

      if (data === "[DONE]" || data === '{"type":"done"}') {
        isCompleted = true;
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.chunk) {
          fullText += parsed.chunk;
          setContent(await renderMarkdownNode(fullText));
        }
      } catch (e) {
        console.error("解析错误:", e);
      }
    },
  );

  // 等待流式完成
  while (!isCompleted) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return renderMarkdownNode(fullText);
}

// 总结函数 - 实时更新，完成后返回最终 JSX
async function summaryText(
  text: string,
  setContent: (jsx: ReactNode) => void,
  options?: {
    summaryLength?: string;
    summaryStyle?: string;
    language?: string;
    extractKeywords?: string;
    includeAnalysis?: string;
  },
): Promise<ReactNode> {
  let fullText = "";
  let isCompleted = false;

  const sseService = new SSEService();

  await sseService.connect(
    "https://elysiatools.com/zh/api/tools/text-summarizer",
    "POST",
    {
      text,
      summaryLength: options?.summaryLength || "medium",
      summaryStyle: options?.summaryStyle || "concise",
      language: options?.language || "zh",
      extractKeywords: options?.extractKeywords || "true",
      includeAnalysis: options?.includeAnalysis || "false",
    },
    async (event: any) => {
      const data = event.data;

      if (data === "[DONE]" || data === '{"type":"done"}') {
        isCompleted = true;
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.chunk) {
          fullText += parsed.chunk;
          setContent(await renderMarkdownNode(fullText));
        }
      } catch (e) {
        console.error("解析错误:", e);
      }
    },
  );

  // 等待流式完成
  while (!isCompleted) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return renderMarkdownNode(fullText);
}

async function correctText(text: string) {
  const res = await getCorrectTextAPI(text);

  if (res.data.code === 0) {
    let obj = JSON.parse(res.data.data.result);

    // 收集所有错误
    let allErrors: Array<{
      pos: number;
      cur: string;
      correct: string;
      description: string;
      type: string;
    }> = [];

    // 错误类型中文映射
    const errorTypeMap: Record<string, string> = {
      black_list: "黑名单纠错",
      pol: "政治术语纠错",
      char: "别字纠错",
      word: "别词纠错",
      redund: "冗余纠错",
      miss: "缺失纠错",
      order: "乱序纠错",
      dapei: "搭配纠错",
      punc: "标点纠错",
      idm: "成语纠错",
      org: "机构名纠错",
      leader: "领导人职称纠错",
      number: "数字纠错",
      addr: "地名纠错",
      name: "人名纠错",
      grammar_pc: "句式杂糅",
    };

    // 收集所有错误并按位置排序
    for (let key in obj) {
      if (obj[key] && obj[key].length) {
        obj[key].forEach((item: any) => {
          allErrors.push({
            pos: item[0],
            cur: item[1],
            correct: item[2] || "",
            description: item[3] || "",
            type: key,
          });
        });
      }
    }

    // 按位置从大到小排序（从后往前替换，避免位置偏移）
    allErrors.sort((a, b) => b.pos - a.pos);

    // 如果没有错误
    if (allErrors.length === 0) {
      return (
        <div style={{ padding: "16px", textAlign: "center", color: "#52c41a" }}>
          ✅ 未发现错误，文本质量良好！
        </div>
      );
    }

    // 生成高亮文本
    const getHighlightedText = () => {
      let result: JSX.Element[] = [];
      let lastIndex = 0;
      let currentText = text;

      // 重新按位置从小到大排序用于显示
      const displayErrors = [...allErrors].sort((a, b) => a.pos - b.pos);

      displayErrors.forEach((error, idx) => {
        const start = error.pos;
        const end = start + error.cur.length;

        // 添加错误前的文本
        if (start > lastIndex) {
          result.push(
            <span key={`text-${idx}`}>
              {currentText.substring(lastIndex, start)}
            </span>,
          );
        }

        // 添加高亮的错误文本
        const errorTypeName = errorTypeMap[error.type] || error.type;
        const colorMap: Record<string, string> = {
          black_list: "#f5222d",
          pol: "#fa541c",
          char: "#fa8c16",
          word: "#faad14",
          redund: "#fadb14",
          miss: "#52c41a",
          order: "#13c2c2",
          dapei: "#1890ff",
          punc: "#2f54eb",
          idm: "#722ed1",
          org: "#eb2f96",
          leader: "#c41d7f",
          number: "#fa8c16",
          addr: "#52c41a",
          name: "#13c2c2",
          grammar_pc: "#f5222d",
        };
        const color = colorMap[error.type] || "#999";

        result.push(
          <span
            key={`error-${idx}`}
            style={{
              backgroundColor: color + "20",
              borderBottom: `2px solid ${color}`,
              cursor: "pointer",
              padding: "2px 4px",
              margin: "0 2px",
              borderRadius: "4px",
              position: "relative",
              display: "inline-block",
            }}
            title={`错误类型：${errorTypeName}\n错误文本：${error.cur}\n建议修改：${error.correct || "删除"}\n说明：${error.description}`}
          >
            {error.cur}
          </span>,
        );

        lastIndex = end;
      });

      // 添加剩余文本
      if (lastIndex < currentText.length) {
        result.push(
          <span key="text-end">{currentText.substring(lastIndex)}</span>,
        );
      }

      return result;
    };

    // 应用所有修正
    const applyAllCorrections = () => {
      let newText = text;
      allErrors.forEach((error) => {
        const start = error.pos;
        const end = start + error.cur.length;
        newText =
          newText.substring(0, start) +
          (error.correct || "") +
          newText.substring(end);
      });
      return newText;
    };

    const correctedFullText = applyAllCorrections();

    // 统计各类型错误数量
    const errorStats: Record<string, number> = {};
    allErrors.forEach((error) => {
      const typeName = errorTypeMap[error.type] || error.type;
      errorStats[typeName] = (errorStats[typeName] || 0) + 1;
    });

    return (
      <div
        style={{ padding: "16px", background: "#fafafa", borderRadius: "8px" }}
      >
        {/* 统计卡片 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🔍</span>
              <span>
                共发现{" "}
                <strong style={{ color: "#ff4d4f", fontSize: "18px" }}>
                  {allErrors.length}
                </strong>{" "}
                处错误
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {Object.entries(errorStats).map(([typeName, count]) => (
              <span
                key={typeName}
                style={{
                  padding: "2px 8px",
                  background: "#fff1f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#ff4d4f",
                }}
              >
                {typeName}: {count}处
              </span>
            ))}
          </div>
        </div>

        {/* 错误高亮文本 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{ fontWeight: "bold", marginBottom: "12px", color: "#333" }}
          >
            📝 错误标注（鼠标悬停查看详情）
          </div>
          <div
            style={{
              lineHeight: "1.8",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {getHighlightedText()}
          </div>
        </div>

        {/* 错误列表 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "16px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{ fontWeight: "bold", marginBottom: "12px", color: "#333" }}
          >
            🔧 错误详情及修正建议
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {allErrors.map((error, idx) => {
              const errorTypeName = errorTypeMap[error.type] || error.type;
              const colorMap: Record<string, string> = {
                black_list: "#f5222d",
                pol: "#fa541c",
                char: "#fa8c16",
                word: "#faad14",
                redund: "#fadb14",
                miss: "#52c41a",
                order: "#13c2c2",
                dapei: "#1890ff",
                punc: "#2f54eb",
                idm: "#722ed1",
                org: "#eb2f96",
                leader: "#c41d7f",
                number: "#fa8c16",
                addr: "#52c41a",
                name: "#13c2c2",
                grammar_pc: "#f5222d",
              };
              const color = colorMap[error.type] || "#999";

              return (
                <div
                  key={idx}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    background: "#fafafa",
                    borderRadius: "6px",
                    borderLeft: `3px solid ${color}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        background: color + "20",
                        color: color,
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {errorTypeName}
                    </span>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      位置: {error.pos}
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                    <span
                      style={{
                        color: "#ff4d4f",
                        textDecoration: "line-through",
                        marginRight: "8px",
                      }}
                    >
                      {error.cur}
                    </span>
                    <span style={{ color: "#999" }}>→</span>
                    <span
                      style={{
                        color: "#52c41a",
                        fontWeight: "bold",
                        marginLeft: "8px",
                      }}
                    >
                      {error.correct || "删除"}
                    </span>
                  </div>
                  {error.description && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginTop: "4px",
                      }}
                    >
                      说明：{error.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 修正后预览 */}
        {correctedFullText !== text && (
          <div
            style={{
              padding: "16px",
              background: "#f6ffed",
              borderRadius: "8px",
              border: "1px solid #b7eb8f",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#52c41a",
              }}
            >
              ✅ 修正后预览
            </div>
            <div
              style={{
                lineHeight: "1.8",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#666",
              }}
            >
              {correctedFullText}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#ff4d4f" }}>
        ⚠️ 纠错服务调用失败，请重试
      </div>
    );
  }
}

export const convert = (
  type: string,
  text: string,
  setContent: (jsx: ReactNode) => void = () => {},
) => {
  switch (type) {
    case "polish":
      return polishText(text);
      break;
    case "translate":
      return translateText(text);
      break;
    case "expand":
      return expandText(text, setContent);
      break;
    case "correct":
      return correctText(text);
      break;
    case "summary":
      return summaryText(text, setContent);
      break;
  }
};
