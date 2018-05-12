/**
 * 使用lokijs引擎
 */
const loki = require('lokijs')

module.exports = class {
	constructor(config) { 
		this.db = new loki(config.db || 'db.json')
		process.on('SIGINT', () => {
			this.db.close()
		})
	}

	initDB() {
		return new Promise((resolve, reject) => { 
			if (this.db) {
				this.db.loadDatabase(null, () => { 
					resolve()
				})				
			} else { 
				reject('请先指定数据库名称')
			}
		})
	}

	async initTable(tabelName) { 
		await this.initDB()
		let table = this.db.getCollection(tabelName)
		if (table === null) {
			await this.insert(tabelName)
			table = this.db.getCollection(tabelName)
		}
		return table
	}

	//创建表
	createTable(tabelName) { 
		if (this.db) {
			return this.db.addCollection(tabelName)
		}	
	}

	//保存数据表
	saveDatabase() { 
		this.db.saveDatabase()
	}

	//添加数据
	async insert(tabelName, data = {}) { 
		await this.initDB()
		let table = this.db.getCollection(tabelName)
		if (table === null) {
			table = this.createTable(tabelName)	
		}
		if (Object.keys(data).length) {
			table.insert(data)
		}	
		this.saveDatabase()
	}

	//拉取数据
	async select(tabelName, data = {}) { 
		const table = await this.initTable(tabelName)
		return table.chain().find(data).data()
	}

	//清除表的所有数据
	async clearTable(tabelName) { 
		const table = await this.initTable(tabelName)
		table.chain().remove()
		this.saveDatabase()
	}

	//删除指定的表数据
	async delete(tabelName, data = {}) {
		if (Object.keys(data).length === 0) { 
			throw { message: '删除表数据需要传值' }
		}
		const table = await this.initTable(tabelName)
		table.chain().find(data).remove()
		this.saveDatabase()
	}
	
	//更新数据
	async update(tabelName, where = {}, updateData = {}) { 
		if (Object.keys(where).length === 0 || Object.keys(updateData).length === 0) { 
			throw { message: '更新数据需要传值' }
		}
		const table = await this.initTable(tabelName)	
		table.update({ ...table.findOne(where), ...updateData })
		this.saveDatabase()
	}
}