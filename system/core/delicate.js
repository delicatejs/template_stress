const fs = require('fs')
const path = require('path')
const events = require('events')
const Loader = require('./loader')
const { subclass_prefix, template_engine, templates, models = [] } = require(path.join(global.application, 'config', 'config.js'))

module.exports = app => {

	process.setMaxListeners(0)

	global.$_POST = {}
	global.$_GET = {}
	global.$_COOKIE = {}
	global.$_SESSION = {}

	global.emitter = new events.EventEmitter()
	global.setcookie = Function

	global.DJ_Controller = class {

		constructor(ctx) {
			this.ctx = ctx

			const loadedModels = []
			//加载默认model
			if (models.length) { 
				models.map(modelName => { 
					const modelFile = path.join(global.application, 'models', modelName + '.js')		
					if (fs.existsSync(modelFile)) {
						const Model = require(modelFile)
						this[modelName] = new Model(ctx)
						loadedModels.push(modelName)
					}		
				})
			}

			this.load = new Loader(app, ctx, loadedModels)			
			// 动态修改的模板引擎
			this.template_engine = null

			//加载model
			global.emitter.on('load.model', (name, model) => {
				this[name] = model
			})
			
			//加载模板
			global.emitter.on('load.template', (engine) => { 
				this.template_engine = engine
			})
			
		}

		async view(template, data = {}) {
			global.emitter.removeAllListeners()
			const ext = templates[this.template_engine || template_engine].ext
			const tpl = path.join(global.application, 'views', template + '.' + ext)
			if (fs.existsSync(tpl)) {
				this.ctx.set('X-Template-Engine', this.template_engine || template_engine)				
				await this.ctx.render(template, data)
				//如果改变了模板，恢复当前默认模板引擎
				if (this.template_engine) { 
					this.template_engine = null
					app.context.render = null
					templates[template_engine].render(app)
				}
			} else {
				this.ctx.body = '模板' + template + '.' + ext + '不存在'
			}
		}

		async send(data) {
			global.emitter.removeAllListeners()
			this.ctx.body = data
		}

		async redirect() {
			global.emitter.removeAllListeners()
			this.ctx.redirect.apply(this.ctx, arguments)
		}

		async json(data) { 
			global.emitter.removeAllListeners()
			this.ctx.set('Content-Type', 'text/json')		
			this.ctx.body = data
		}
	}

	//确认是否存在MY_Controller
	const AppCtrDir = path.join(path.join(global.application, 'core', subclass_prefix + "Controller.js"))

	if (fs.existsSync(AppCtrDir)) {
		global[subclass_prefix + "Controller"] = require(AppCtrDir)
	}
}