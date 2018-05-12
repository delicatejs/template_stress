const fs = require('fs')
const path = require('path')
const Loader = require('./loader')
const { subclass_prefix, database_engine } = require(path.join(global.application, 'config', 'config.js'))

module.exports = app => {

	global.DJ_Model = class {
		constructor(ctx) {
			this.ctx = ctx
			this.load = new Loader(app, ctx)			
			this.database_engine = database_engine
		}
	}

	//确认是否存在MY_Model
	const AppCtrDir = path.join(path.join(global.application, 'core', subclass_prefix + "Model.js"))

	if (fs.existsSync(AppCtrDir)) {
		global[subclass_prefix + "Model"] = require(AppCtrDir)
	}
}