module.exports = class extends MY_Controller {
	
	constructor(ctx) { 
		super(ctx)
		this.num = 1000
	}

	async ejs() {				
		await this.view('ejs', { num: this.num })			
	}

	async react() { 
		this.load.template('react')
		await this.view('react', { num: this.num })		
	}
}