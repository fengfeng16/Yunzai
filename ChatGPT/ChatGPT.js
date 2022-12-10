import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq"
import { Configuration, OpenAIApi } from "openai";

//在这里填入你的API_KEY
const API_KEY=""

export class ChatGPT extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'ChatGPT',
            /** 功能描述 */
            dsc: '使用ChatGPT来回复',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '#询问(.*)',
                    /** 执行方法 */
                    fnc: 'chatgpt'
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
    async chatgpt(e) {
        // 使用 API 密钥初始化 OpenAI 库
        process.env.OPENAI_API_KEY=API_KEY

        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openaiC = new OpenAIApi(configuration);
        


        // 定义要向 GPT-3 提供的输入文本
        const input = e.msg.replace(/#询问|\n|\r/g,"").trim();
        console.log(input)
        // 调用 completions 函数来生成文本
        const response = await openaiC.createCompletion({
            model: "text-davinci-003",
            prompt: input,
            temperature: 1,
            max_tokens: 999,
        });
        e.reply(response.data.choices[0].text.replace(/\r/g,"").trim())

    }
}
