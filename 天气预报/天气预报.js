import plugin from '../../lib/plugins/plugin.js';
import common from '../../lib/common/common.js';
import { segment } from "oicq";
import fetch from "node-fetch";

export class tianqiyubao extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '天气预报',
            /** 功能描述 */
            dsc: '天气预报',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#(.*)(天气)$',
                    /** 执行方法 */
                    fnc: 'tianqiyubao'
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
     * @param ms
	 */
    async tianqiyubao(e) {
        let msg=e.msg
        let place = msg.replace(/#|天气/g, "").trim();
        let url = `https://api.sdgou.cc/api/wether/?city=${place}`;
        let response = await fetch(url);
        let res = await response.json();
        let allmsg={}
        const forwarder ={
            nickname: Bot.nickname,
            user_id: Bot.uin,
          };
        let msgList=[]
        if(res.success==false){
            e.reply([segment.at(e.sender.user_id),res.message],true)
            return false;
        }else if (res.success==true){
            e.reply(`${place}近期天气`)
            await common.sleep(500)
            for(let i = 0;i<getJsonLength(res.data[i])-1;i++){
                allmsg[i]=`日期：${res.data[i].date}
最高温度：${res.data[i].high}
最低温度：${res.data[i].low}
风向：${res.data[i].fengxiang}
风力：${res.data[i].fengli}
天气：${res.data[i].type}`
                msgList.push({
                    message: {type: "text",text: `${allmsg[i]}`},
                    ...forwarder,
                });
                await common.sleep(0)
            }
            console.log(msgList)
            e.reply(await Bot.makeForwardMsg(msgList),false)      
        }else{
            e.reply([segment.at(e.sender.user_id),` 未知错误，请重试`],true)
        }
        

        function getJsonLength(json) {
            var jsonLength = 0;
            for (var i in json) {
                jsonLength++;
            }
            return jsonLength;
        }
    }
    
}
