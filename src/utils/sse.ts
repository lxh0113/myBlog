import { fetchEventSource } from "@microsoft/fetch-event-source";

// 定义消息回调类型
type MessageHandler = (data: any) => void;
type CloseHandler = () => void;

export class SSEService {
  async connect(
    url: string,
    method: "GET" | "POST",
    body: object,
    onMessageHandler: MessageHandler,
    myHeader?: Record<string, string>, // 键值对的形式,
    onHandleClose?:CloseHandler
  ) {
    return await fetchEventSource(url, {
      method: method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...myHeader, // 当 myHeader 未定义时会自动忽略展开
      },
      body: JSON.stringify(body),
      openWhenHidden: true,
      async onopen() {
        // 可以在这里添加连接成功逻辑
      },
      onmessage(event:any) {
        onMessageHandler(event);
      },
      onerror(error) {
        console.error(error)
      },
      onclose(){
        if(onHandleClose) onHandleClose()
      }
    });
  }
}


