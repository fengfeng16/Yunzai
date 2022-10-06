import plugin from '../../lib/plugins/plugin.js'
//本插件作者：水视频的枫枫
export class groupban extends plugin {
    constructor () {
        super({
            name: '一个客户',
            dsc: '为胡桃带来新的客户',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'notice.group.ban',
            priority: 799
        })
    } 

    /** 接受到消息都会执行一次 */
    async accept () {
        await console.log("abab")
        if((await redis.get(`${this.e.group_id}:kehu`))==null){
            redis.set(`${this.e.group_id}:kehu`,0)
        }else{
            
        }
        if(this.e.duration!=0){

            redis.set(`${this.e.group_id}:kehu`,parseInt(await redis.get(`${this.e.group_id}:kehu`))+1)
            let msg = `${await redis.get(`${this.e.group_id}:kehu`)}个客户...送往生堂吧...`

            //if (this.e.user_id == Bot.uin) return


            /** 回复 */
            await this.reply([
            msg
            ])
        }   
    }
}


export class kehuguiling extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '客户归零',
            /** 功能描述 */
            dsc: '客户归零',
            event: 'message.group',
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^(#客户归零)$',
                    /** 执行方法 */
                    fnc: 'kehuguiling'
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
    async kehuguiling(e) {
        redis.del(`${this.e.group_id}:kehu`,function(err){
            console.log(err)
        })
        e.reply("客户已归零")
    }
}
