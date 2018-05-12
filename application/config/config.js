const path = require('path')
const ejsView = require('koa-ejs');
const reactView = require('koa-react-view');

module.exports = {
	// 服务端口号
	port: 3000,
	
	// 数据库引擎可选, lokijs、sequelize
	database_engine: 'lokijs',
	
	/**
	 * 自定义公共继承的对象，默认是放在core文件夹下，文件名称已MY_开头
	 * 控制器自动挂载MY_Controller.js文件
   * 模块自动挂载MY_Model.js文件
	 * 那么我们在controllers中定义类时，可以继承MY_Controller
	 * 而MY_Controller继承的是DJ_Controller，所以可以做一些通用的业务处理
	 */
	subclass_prefix: 'MY_',

	/**
	 * 自定义静态资源存放目录
	 */
	static: path.join(__dirname, '../views/public'),
	
	/**
	 * 使用的模板引擎
	 * 需要注意这里面的引擎需要和template.js中的配置一致
	 * 比如：这里是react模板渲染，template配置需要是react-view模板配置项
	 * ⚠️ react模板仅仅支持静态资源导出，如果绑定事件处理的不推荐使用这一套web框架
	 * 针对于react模板 我们推荐使用前后端分离框架去完整的实现一套服务端渲染架构
	 * 当前框架仅仅是服务于 web业务层，提供接口服务的。表现层不参与深度的解析工作
	 * 
	 * 引擎列表[react,ejs]
	 * 这边是默认的模板引擎，可用通过this.load.template(tpl)动态改变模板引擎
	 * 系统默认的是当前设置的引擎
	 * 动态改变需注意，必须在模板列表中配置存在的
	 */
	template_engine: 'ejs',

	/**
	 * 可用模板列表
	 * render: 模板render方法
	 * ext: 模板后缀
	 */
	templates: {
		react: {
			render(app) {
				require('babel-register')({
					presets: [ "es2015", "react"],
					extensions: [ '.jsx' ],
				});
				reactView(app, {
					views: path.join(global.application, 'views'),
				});
			},	
			ext:'jsx'
		},
		ejs: {
			render(app) {
				ejsView(app, {
					root: path.join(global.application, 'views'),
					layout: false,
					viewExt: 'ejs',
					cache: false,
					debug: false
				});
			},
			ext: 'ejs'
		}
	}
}