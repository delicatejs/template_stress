const path = require('path')
const fs = require('fs')
const { templates } = require(path.join(global.application, 'config', 'config.js'))

module.exports = class {

	constructor(app, ctx, loadedModels = []) {		
		this.app = app
		this.ctx = ctx
		this.models = [...loadedModels]			
		this.databases = []
	}

	/**
	 * 
	 * 动态加载model,并将model的文件名作为对象名传给this对象
	 */
	model(name) { 
		const modelFile = path.join(global.application, 'models', name + '.js')		
		if (fs.existsSync(modelFile) && this.models.indexOf(name) === -1) {
			const Model = require(modelFile)			
			global.emitter.emit('load.model', name, new Model(this.ctx))			
		}				
	}

	/**
	 * 动态创建数据库连接对象，并返回数据库连接对象
	 */
	database(db) {
		const { database_engine } = require(path.join(global.application, 'config', 'config.js'))
		const databases = require(path.join(global.application, 'config', 'database.js'))

		let config, DB
		//判断使用的数据库引擎
		switch (database_engine) {
			case 'sequelize':		
				config = databases['sequelize'][db]	
				if (config) {
					DB = require('../database/sequelize')
					return new DB(config)
				} else {
					throw 'sequelize的' + db + '不存在'
				}
				break;
		
			case 'lokijs':
				config = databases['lokijs'][db]
				if (config) {
					DB = require('../database/lokijs')
					return new DB(config)
				} else { 
					throw 'lokijs的' + db + '不存在'
				}
				break;
			
			default:
				break;
		}
	}

	/**
	 * 动态注册模板引擎
	 */
	template(templateName) { 
		this.app.context.render = null
		if (templates[templateName]) {
			templates[templateName].render(this.app)
			global.emitter.emit('load.template',templateName)
		}	
	}
}