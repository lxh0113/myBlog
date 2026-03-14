import { Launcher } from "react-chat-window";
import AIImage from "../../assets/image/ai.gif";
import "./index.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { getWsUrlAPI } from "../../apis/ws";

interface Message {
  type: "text";
  author: "me" | "ai";
  data: {
    text: string;
  };
}

class AIChatService {
  private ws: WebSocket | null = null;
  private messageQueue: Array<Message> = [];
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private appid = "f17e53d0";
  private domain = "spark-x";
  
  // 回调函数，用于更新UI
  private onMessageUpdate: ((messages: Message[]) => void) | null = null;
  private onConnectionChange: ((isConnected: boolean) => void) | null = null;

  constructor(onMessageUpdate: (messages: Message[]) => void, onConnectionChange?: (isConnected: boolean) => void) {
    this.onMessageUpdate = onMessageUpdate;
    this.onConnectionChange = onConnectionChange;
    
    // 初始化欢迎消息
    this.messageQueue = [
      { type: "text", author: "me", data: { text: "你好!" } },
      { type: "text", author: "ai", data: { text: "你好，我是您的小助手." } },
    ];
    this.notifyMessageUpdate();
  }

  // 通知UI更新消息列表
  private notifyMessageUpdate() {
    if (this.onMessageUpdate) {
      this.onMessageUpdate([...this.messageQueue]);
    }
  }

  // 获取消息数据的格式
  private getMessageData(userMessage: string) {
    return {
      header: {
        app_id: this.appid,
        uid: "12345",
      },
      parameter: {
        chat: {
          domain: this.domain,
          temperature: 0.5,
          max_tokens: 1024,
        },
      },
      payload: {
        message: {
          text: [
            { role: "system", content: "你现在是一个博客系统的小助手。" },
            ...this.messageQueue.map((item) => ({
              role: item.author === "me" ? "user" : "assistant",
              content: item.data.text,
            })),
            { role: "user", content: userMessage },
          ],
        },
      },
    };
  }

  // 建立WebSocket连接
  async connect(): Promise<boolean> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket连接已存在");
      return true;
    }

    if (this.isConnecting) {
      console.log("正在连接中，请稍候...");
      return false;
    }

    if (typeof WebSocket === "undefined") {
      alert("您的浏览器不支持WebSocket");
      return false;
    }

    this.isConnecting = true;
    if (this.onConnectionChange) {
      this.onConnectionChange(false);
    }

    try {
      // 获取WebSocket URL
      const res = await getWsUrlAPI();
      const url = res.data;
      
      return new Promise((resolve) => {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          console.log("WebSocket连接成功建立");
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          if (this.onConnectionChange) {
            this.onConnectionChange(true);
          }
          resolve(true);
          
          // 连接建立后，发送队列中的消息
          this.processMessageQueue();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("收到AI回复:", data);
            
            if (data.payload?.choices?.text?.[0]?.content) {
              const aiResponse = data.payload.choices.text[0].content;
              
              // 更新最后一条AI消息
              const lastMessageIndex = this.messageQueue.length - 1;
              if (lastMessageIndex >= 0 && this.messageQueue[lastMessageIndex].author === "ai") {
                this.messageQueue[lastMessageIndex].data.text += aiResponse;
              } else {
                // 如果没有AI消息，添加新的
                this.messageQueue.push({
                  type: "text",
                  author: "ai",
                  data: { text: aiResponse },
                });
              }
              
              this.notifyMessageUpdate();
            }
            
            // 检查是否结束
            if (data.header?.status === 2) {
              console.log("消息接收完成");
            }
          } catch (error) {
            console.error("解析消息失败:", error);
          }
        };

        this.ws.onclose = () => {
          console.log("WebSocket连接关闭");
          this.ws = null;
          this.isConnecting = false;
          if (this.onConnectionChange) {
            this.onConnectionChange(false);
          }
          
          // 尝试重连
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            // console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            // setTimeout(() => this.connect(), 2000);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket错误:", error);
          this.ws?.close();
        };
      });
    } catch (error) {
      console.error("获取WebSocket URL失败:", error);
      this.isConnecting = false;
      if (this.onConnectionChange) {
        this.onConnectionChange(false);
      }
      return false;
    }
  }

  // 处理消息队列
  private processMessageQueue() {
    // 这里可以处理之前未发送的消息
    // 暂时留空，你可以根据需求实现
  }

  // 发送消息
  async sendMessage(message: Message): Promise<boolean> {
    try {
      // 添加用户消息到队列
      this.messageQueue.push(message);
      this.notifyMessageUpdate();

      // 添加AI的占位消息
      const aiPlaceholder: Message = {
        type: "text",
        author: "ai",
        data: { text: "" },
      };
      this.messageQueue.push(aiPlaceholder);
      this.notifyMessageUpdate();

      // 确保连接已建立
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.log("WebSocket未连接，正在建立连接...");
        const connected = await this.connect();
        if (!connected) {
          throw new Error("无法建立WebSocket连接");
        }
      }

      // 准备要发送的数据
      const sendData = this.getMessageData(message.data.text);
      console.log("发送数据:", sendData);

      // 发送消息
      this.ws!.send(JSON.stringify(sendData));
      console.log("消息已发送");
      
      return true;
    } catch (error) {
      console.error("发送消息失败:", error);
      
      // 移除AI占位消息（因为发送失败）
      this.messageQueue.pop();
      this.notifyMessageUpdate();
      
      // 添加错误消息
      this.messageQueue.push({
        type: "text",
        author: "ai",
        data: { text: "抱歉，消息发送失败，请重试。" },
      });
      this.notifyMessageUpdate();
      
      return false;
    }
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
    if (this.onConnectionChange) {
      this.onConnectionChange(false);
    }
  }

  // 获取当前消息列表
  getMessages(): Message[] {
    return [...this.messageQueue];
  }
}

export default function AIChat() {
  const [messageList, setMessageList] = useState<Message[]>([
    { type: "text", author: "me", data: { text: "你好!" } },
    { type: "text", author: "ai", data: { text: "你好，我是您的小助手." } },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const chatServiceRef = useRef<AIChatService | null>(null);

  // 初始化聊天服务
  useEffect(() => {
    chatServiceRef.current = new AIChatService(
      (messages) => setMessageList(messages),
      (connected) => setIsConnected(connected)
    );

    // 组件卸载时断开连接
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.disconnect();
      }
    };
  }, []);

  // 处理发送消息
  const handleSendMessage = useCallback(async (message: Message) => {
    if (chatServiceRef.current) {
      await chatServiceRef.current.sendMessage(message);
    }
  }, []);

  return (
    <div className="chatBox">
      <Launcher
        agentProfile={{
          teamName: "AI小助手",
          imageUrl: AIImage,
        }}
        onMessageWasSent={handleSendMessage}
        messageList={messageList}
        showEmoji={false}
      />
    </div>
  );
}