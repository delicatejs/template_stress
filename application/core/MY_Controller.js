/**
 * 公共的控制器
 * 处理一些初始化的信息，比如登录信息，统一返回等
 * 所有的Controller的方法都可以通过this.ctx拿到koa的ctx对象
 */
module.exports = class extends DJ_Controller { 
	constructor(ctx) { 
		super(ctx)				
	}
}