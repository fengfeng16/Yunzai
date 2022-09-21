import plugin from '../../lib/plugins/plugin.js';
import common from '../../lib/common/common.js';
import { segment } from "oicq";
import fetch from "node-fetch";
//本插件作者：水视频的枫枫
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
        if(res.desc=="invilad-citykey"){
            e.reply([segment.at(e.sender.user_id),` ${place}并不是一个正确的地名，请输入正确的地名`],true)
            return false;
        }else if (res.desc=="OK"){
            e.reply(`${res.data.city}近期天气`)
            await common.sleep(500)
            for(let i = 0;i<getJsonLength(res.data.forecast[i])-1;i++){
                allmsg[i]=`日期：${res.data.forecast[i].date}
最高温度：${res.data.forecast[i].high}
最低温度：${res.data.forecast[i].low}
风向：${res.data.forecast[i].fengxiang}
天气：${res.data.forecast[i].type}`
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
