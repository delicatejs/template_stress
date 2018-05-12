'use strict'

const autocannon = require('autocannon')
const instance = autocannon({
	url: 'http://127.0.0.1:3000/index/ejs',
	connections: 100,
}, finishedBench)

autocannon.track(instance)

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
	instance.stop()
})

function finishedBench (err, res) {
	console.log('finished bench', err, res)
}