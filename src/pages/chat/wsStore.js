import { defineStore } from "pinia";
import { h, ref } from 'vue'
import { ElMessage, ElNotification } from "element-plus";
import { getUrlAPI } from '../apis/activity.ts'
import { getContentAPI } from '../apis/ai.ts'
import { init } from "echarts";

export const useWsStore = defineStore("ws", () => {

    let ws = null

    let status = '未开始'

    let currentMessage = ref('')

    let myMessage = ref([
        { type: 'text', author: `me`, data: { text: `你好!` } },
        { type: 'text', author: `assistant`, data: { text: `你好，我是您的语言小助手.` } }
    ])

    let appid = "f17e53d0"
    let domain = "4.0Ultra"

    const data = ref({
        "header": {
            "app_id": appid,
            "uid": "12345"
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.5,
                "max_tokens": 1024,
            }
        },
        "payload": {
            "message": {
                "text": [
                    { "role": "system", "content": "你现在是一个博客系统的小助手。" },
                    ...myMessage.value.map(item => {
                        return {
                            role: item.author === "me" ? "user" : item.author,
                            content: item.data.text
                        }
                    })
                ]
            }
        }
    })

    const wsInit = async (flag = 0) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket 连接已经存在');
            return false
        }

        if (typeof (WebSocket) === "undefined") {
            alert("您的浏览器不支持socket")
            return false
        }

        // 发送请求得到  url
        const res = await getUrlAPI()

        let url = ''

        if (res.data.code === 200) {
            url = res.data.data
            console.log(res.data.data)
        }
        else return false


        ws = new WebSocket(url)
        if (ws.readyState === WebSocket.OPEN) console.log("ws连接已经建立")

        ws.onmessage = (event) => {
            console.log("收到了消息" + event.data)

            let newMessage = JSON.parse(event.data)
            // console.log(newMessage)
            newMessage = newMessage.payload.choices


            console.log("状态" + newMessage.status)
            putAIContent(newMessage.text[0].content)

            if (newMessage.status === 2) {
                // 这是新的修改新消息
                // currentMessage.value = myMessage.value[myMessage.value.length - 1].data.text
                currentMessage.value = myMessage.value[myMessage.value.length - 1].data.text
            }

        }

        ws.onerror = () => {
            // ElMessage.error("网络连接出错")
        }

        ws.onclose = () => {
            // ElMessage.error("连接已经关闭")
            // reload()
        }

        return true
    }

    const reload = () => {
        wsInit()
    }

    const putMyContent = (message) => {
        myMessage.value.push({
            type: 'text', author: `me`, data: { text: message }
        })
    }

    const putAIContent = (message) => {
        myMessage.value[myMessage.value.length - 1].data.text += message

        console.log(myMessage.value)
    }

    const getContent = async (question) => {
        const res = await getContentAPI(question);

        if (res.data.code === 200) {
            return res.data.data.content
        }
        else {
            return 'false'
        }
    }

    const sendMessage = async (question) => {

        let flag = await wsInit()


        if (flag) {
            putMyContent(question)

            myMessage.value.push({
                type: 'text', author: `ai`, data: { text: '' }
            })

            const content = await getContent(question);

            console.log(content)

            if (content === 'false') {
                ElMessage.error('网络出错了，请重新连接')
            }
            else {
                data.value.payload.message.text.push({
                    "role": "user",
                    "content": content
                })
                ws.send(JSON.stringify(data.value))
            }

        }

    }

    const getMyMessage = () => {
        return myMessage.value
    }

    return {
        ws,
        myMessage,
        currentMessage,
        getMyMessage,
        status,
        wsInit,
        sendMessage
    }
})