/**
 * 给不同的数据库引擎提供不同的配置信息
 */
module.exports = {
	/**
	 * 使用sequelize引擎时读取的数据库连接配置
	 */
	sequelize: {
		//可以配置多台sql服务器
		//选择加载database配置的选项，当前可用选择read配置
		read: {
			host: '127.0.0.1',
			port: 3306,
			username: 'root',
			password: 'root',
			database: 'test',
		}
	},

	/**
	 * 使用lokijs引擎时读取的配置信息
	 */
	lokijs: {
		//注意这里面的db类似于mysql的host
		read: {
			db: './db.json'
		}
	}
}