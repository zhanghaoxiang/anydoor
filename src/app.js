const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const statFn = require('./components/route');
const openUrlFn = require('./components/open')

class Server {
    constructor (cfg) {
        this.conf = Object.assign({}, conf, cfg)
    }

    start() {
        const server = http.createServer((req, res) => {
            const url = req.url;
            const filePath = path.join(this.conf.root, url)
            statFn(req, res, filePath, this.conf)
        })

        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.log(`Server started at ${chalk.green(addr)}`)
            openUrlFn(addr)
        })
    }
}

module.exports = Server
