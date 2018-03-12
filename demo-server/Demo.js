let user = require('./User');

console.log(`user:${user.userName}`);

let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res)=>{
	res.statusCode = 200;
	res.setHeader("Content-Type","text/plain;charset=utf-8");
	res.end(util.inspect(url.parse("http://localhost:3000/demo.html?a=123/#tag")));
});
server.listen(3000,"127.0.0.1",()=>{
	console.log(`服务器运行于127.0.0.1:3000`);
})