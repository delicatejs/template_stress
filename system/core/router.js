module.exports = (router, route, Controller, func) => { 
	router.all(route, async (ctx, next) => {
		global.$_POST = {}
		global.$_GET = {}
		const _C = new Controller(ctx)
		const post = ctx.request.body
		if (Object.keys(post).length) {
			//有post请求			
			for (let key in post) { 
				global.$_POST[key] = post[key]
			}
		}

		const get = ctx.request.query
		if (Object.keys(get).length) { 
			//get请求参数			
			for (let key in get) { 
				global.$_GET[key] = get[key]
			}
		}

		await _C[func].apply(_C, Object.values(ctx.params))
	})
}