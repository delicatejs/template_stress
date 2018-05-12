const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const staticServer = require('koa-static')
const path = require('path')

const { port, static, templates, template_engine } = require(path.join(global.application, 'config/config.js'))

const app = new Koa()
const router = new Router()

// 全局注册公共方法
require('./delicate')(app)
require('./model')(app)

/**
 * 入口中间件
 * 主要初始化参数和通用方法
 * 捕获错误，处理错误
 */
app.use(async(ctx, next) => {
	try {
		const cookieHeader = ctx.headers.cookie;
		let cookie = {}
		if (cookieHeader) {
			const cookies = cookieHeader.split(';');			
			cookies.forEach(function (item) {
				const crumbs = item.split('=');
				if (crumbs.length > 1) cookie[crumbs[0].trim()] = crumbs[1].trim();
			});
		}
		global.setcookie = (name, value, options = {}) => { 
			ctx.cookies.set(name, value, options);			
		};
		global.$_COOKIE = cookie;
		global.$_SESSION = ctx.session;		
		await next();			
	} catch (err) {
		
		// if(err.status != 401 || err.status != 403){
		// 		if(useFileLogger()){
		// 			errorLogger.error(err)
		// 		}else{
		// 			console.log(err)
		// 		}
		// }

		ctx.status = err.status || err.code || 500;
		ctx.body = {
				ret: -1,
				msg: err.message,
		};
	}
});

/**
 * 处理post请求的解析
 */
app.use(bodyParser({
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422);
  }
}));


/**
 * 增加session功能
 */
app.use(session({
	key: 'koa:sess',
	maxAge: 86400000,	
  overwrite: true, 
  httpOnly: true, 
  signed: false, 
  rolling: true, 
  renew: false
}, app));

/**
 * 注册模板
 */
templates[template_engine].render(app);

/**
 * 静态资源访问权限
 */
app.use(staticServer(static));

/**
 * 启动服务器
 */
module.exports = () => {
	require('./controller')(router)		
	app.use(router.routes())
	app.use(router.allowedMethods())
	app.listen(port)	
	console.log('> http://localhost:' + port)
}