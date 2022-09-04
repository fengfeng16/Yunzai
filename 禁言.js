import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq"


export class jinyan extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '禁言',
            /** 功能描述 */
            dsc: '禁言',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#*禁言(.*)$',
                    /** 执行方法 */
                    fnc: 'jinyan'
                    //枫枫制作
                },
                {
                    /** 命令正则匹配 */
                    reg: '^#*解禁(.*)$',
                    /** 执行方法 */
                    fnc: 'jiejin'
                    //枫枫制作
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
    async jinyan(e) {
        if(e.sender.role == "owner" || e.isMaster || e.sender.role == "admin"){
            let msg=e.msg
            let qq=null
            let add=false
            for(let msg of e.message){
        
                if(msg.type =='at'){
                    qq = msg.qq
                    break
            }
            }
            if(qq == null){
                e.reply("未识别成功,请艾特对方使用",true)
                return true
            }else{
                msg = msg.replace(/#|禁言|qq/g, "").trim();
                if(msg.includes("增加")){
                    add=true
                    msg = msg.replace(/增加/g, "").trim();
                }
                if((parseInt(msg)<0)||(parseInt(msg)!=(parseInt(msg)))){
                    e.reply(`${msg}并非是一个有效的禁言时间`)
                }else{
                    let user_report = e.group.pickMember(qq)
                    let mute_all = user_report.mute_left
                    mute_all+=parseInt(msg)*60
                    if(add==false){
                        e.reply([`已禁言`,segment.at(qq),`${parseInt(msg)*60}秒`])
                        e.group.muteMember(qq, parseInt(msg)*60); 
                    }else{
                        e.reply([`已禁言`,segment.at(qq),`${parseInt(msg)*60}秒，目前剩余${mute_all}秒`])
                        e.group.muteMember(qq, mute_all);     
                    }
                }
            }
            console.log(qq.super)
        }else{
            e.reply("你没有权限这么做")
        }
    }

    async jiejin(e) {
        if(e.sender.role == "owner" || e.isMaster || e.sender.role == "admin"){
            let msg=e.msg
            let qq=null
            let add=false
            for(let msg of e.message){
        
                if(msg.type =='at'){
                    qq = msg.qq
                    break
            }
            }
            if(qq == null){
                e.reply("未识别成功,请艾特对方使用",true)
                return true
            }else{
                msg = msg.replace(/#|解禁|qq/g, "").trim();
                if(msg.includes("减少")){
                    add=true
                    msg = msg.replace(/减少/g, "").trim();
                }
                if(((parseInt(msg)<0) || (parseInt(msg)!=(parseInt(msg)))) && (add==true)){
                    e.reply(`${msg}并非是一个有效的减少时间`)
                }else{
                    let user_report = e.group.pickMember(qq)
                    let mute_all = user_report.mute_left
                    if(add==true){
                        mute_all-=parseInt(msg)*60
                    }
                    if(mute_all>0){
                        if(add==false){
                            e.reply([`已解禁`,segment.at(qq)])
                            e.group.muteMember(qq, 0); 
                        }else{
                            e.reply([`已减少`,segment.at(qq),`${parseInt(msg)*60}秒的禁言时间，目前剩余${mute_all}秒`])
                            e.group.muteMember(qq, mute_all);     
                        }
                    }else{
                        e.reply([segment.at(qq),`没有被禁言`])
                    }
                }
            }
            console.log(qq.super)
        }else{
            e.reply("你没有权限这么做")
        }
    }
}