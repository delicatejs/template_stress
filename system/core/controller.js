const fs = require('fs')
const path = require('path')
const createRouter = require('./router')
const controllerPath = path.join(global.application, 'controllers')

const getParameterName = (fn) => {
	if(typeof fn !== 'object' && typeof fn !== 'function' ) return;
	const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	const DEFAULT_PARAMS = /=[^,)]+/mg;
	const FAT_ARROWS = /=>.*$/mg;
	let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
	code = code
			.replace(COMMENTS, '')
			.replace(FAT_ARROWS, '')
			.replace(DEFAULT_PARAMS, '');
	let result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
	return result === null ? [] :result;
}

//遍历文件
module.exports = function fileDisplay(router, filePath = controllerPath) {	
	//根据文件路径读取文件，返回文件列表  
	fs.readdir(filePath, function (err, files) {
		if (err) {
				console.warn(err)
		} else {
			//遍历读取到的文件列表  
			files.forEach(function (filename) {
					//获取当前文件的绝对路径  
					var filedir = path.join(filePath, filename);
					//根据文件路径获取文件信息，返回一个fs.Stats对象  
					fs.stat(filedir, function (eror, stats) {
							if (eror) {
								console.warn('获取文件stats失败');
							} else {
								var isFile = stats.isFile();//是文件  
								var isDir = stats.isDirectory();//是文件夹  
								if (isFile && !/\.delicate$/.test(filedir)) {
									//控制器的js文件名称
									const routeDir = filedir.replace(controllerPath, '').replace(/\.js$/,'')
									const Controller = require(filedir)
									const routes = Object.getOwnPropertyNames(Controller.prototype).filter(item => item !== 'constructor')									
									
									//忽略index
									const igoreIndex = routeDir.split('/').filter(item => item != 'index').join('/')	
									if (igoreIndex !== routeDir) {
										router.all(igoreIndex, async (ctx, next) => {
											const _C = new Controller(ctx)
											await _C.index.apply(_C, Object.values(ctx.params))
										})
									}	

									if (routes.length) {
										routes.map(item => {
											const fn = Controller.prototype[item]
											const params = getParameterName(fn)
											let route = ''
											
											//js的类的属性方法名是index
											if (item === 'index') {
												createRouter(router, routeDir, Controller, item)
											}
											
											//完整路径
											route = path.join(routeDir, item)																							
											createRouter(router, route, Controller, item)
											
											//匹配参数
											// /a/:id/:name
											if (params.length) {
												let _route = route												
												params.map(param => {
													_route = path.join(_route, ':' + param)	
													createRouter(router, _route, Controller, item)												
												})
											}																						
										})
									}														
								}
								if (isDir) {
									fileDisplay(router, filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  									
								}
							}
					})
			});
		}
	});
}