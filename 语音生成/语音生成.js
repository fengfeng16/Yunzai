import plugin from '../../lib/plugins/plugin.js';
import common from '../../lib/common/common.js';
import { segment } from "oicq";
import fetch from "node-fetch";
import fs from "fs";
//本插件作者：水视频的枫枫
export class yuyinshengcheng extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '语音生成',
            /** 功能描述 */
            dsc: '语音生成',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^(#生成语音|#语音生成)(：|:)(.*)$',
                    /** 执行方法 */
                    fnc: 'yuyinshengcheng'
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
    async yuyinshengcheng(e) {
        let msg=e.msg.replace(/#生成语音|#语音生成|：|:/g,"");
        let url=`https://xiaoapi.cn/API/tts.php?msg=${msg}`
        let mp3_file=await fetch(url).then(res => res.json()).then(json => json.data.mp3)
        e.reply(`语音已生成：${msg}`)
        await common.sleep(1000)
        e.reply(`qq语音预览可能会比实际音质差，下载地址仅存留三分钟，请尽快下载`)
        await common.sleep(1000)
        e.reply([`下载地址：`,mp3_file]);
        await common.sleep(1000)
        e.reply([segment.at(e.sender.user_id),`如果您是我的好友，文件已私信发送给您，请耐心等待`]);
        await common.sleep(500)
        e.reply(segment.record(mp3_file));


        (await fetch(mp3_file,   {
            method: 'GET',
            headers: { 'Content-Type': 'application/octet-stream' },
        }).then(res => res.buffer()).then(_=>{
        fs.writeFile(`./resources/yuyin/${msg}.mp3`, _, "binary", function (err) {
                        if (err) console.error(err);
                        else console.log("下载成功");
            });
        })) 


        await common.sleep(500)
       Bot.pickFriend(e.sender.user_id).sendFile([`./resources/yuyin/${msg}.mp3`],`语音生成:${msg}.mp3`);
    }
    
}
