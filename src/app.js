const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const statFn = require('./components/route')


const server = http.createServer((req, res) => {
    const url = req.url;
    const filePath = path.join(conf.root, url)
    statFn(req, res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.log(`Server started at ${chalk.green(addr)}`)
})
