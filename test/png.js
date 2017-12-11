const fs = require('fs')
const path = require('path')

let { Png } = require('./../dist/png')

let file = path.join(__dirname, './1.png')

let content = fs.readFileSync(file)

//可用性
let useable = Png.useable(content)
console.log('可否使用：' + useable)
if (useable) {
	//构建对象
	let png = Png.fromBuffer(content)
}
