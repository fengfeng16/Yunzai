import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq"
import common from '../../lib/common/common.js';

export class jinyan extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '骰子',
            /** 功能描述 */
            dsc: '骰子',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 799,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#骰子$',
                    /** 执行方法 */
                    fnc: 'touzi'
                    //枫枫制作
                }
            ]
        })
    }
	/**
	 * 
	 * @param e oicq传递的事件参数e
	 */
    async touzi(e) {
        var ran=(Math.round(Math.random()*5)+1).toString()
        e.reply(segment.image(`./plugins/example/touzi/${ran}.png`))
    }
}
