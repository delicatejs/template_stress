/**
 * Delicate框架入口文件，提供环境变量的初始化等相关事情
 * 不做任何方法的执行，保证只有一个core方法的执行
 * 让入口看上去更简洁，更明了
 * 同时入口文件一般也是不需要去进行改变的
 */
const path = require('path')

/**
 * 系统环境参数的配置
 */
global.application = path.join(__dirname, 'application')

//启动核心方法
require('./system/core')()
