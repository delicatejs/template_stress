/**
 * 公共的Model，处理一些公共资源，比如数据库加载等
 * 所有的Model的方法都可以通过this.ctx拿到koa的ctx对象
 */
module.exports = class extends DJ_Model { 
	constructor(ctx) { 
		super(ctx)
		this.db = this.load.database('read')
	}
}