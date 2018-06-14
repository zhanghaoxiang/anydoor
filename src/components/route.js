const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const mimeFn = require('../components/mime');
const compressFn = require('../components/compress');
const rangeFn = require('../components/range');
const isFresh = require('../components/cache');

const tplPath = path.join(__dirname, '../tpl/dir.tpl');
const source = fs.readFileSync(tplPath);
const tpl = Handlebars.compile(source.toString());

const statFn = async (req, res, filePath, cfg) =>{
    try {
        const stats = await stat(filePath)
        if (stats.isFile()) {
            const contentType = mimeFn(filePath)
            let rs;

            if(isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end()
                return
            }

            const {code, start, end} = rangeFn(stats.size, req, res)

            if (code === 200) {
                rs = fs.createReadStream(filePath)
            } else {
                rs = fs.createReadStream(filePath, {start, end})
            }

            res.statusCode = code;
            res.setHeader('Content-Type', contentType);

            if (filePath.match(cfg.compress)) {
                rs = compressFn(rs, req, res)
            }
            rs.pipe(res)
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath)
            const dir = path.relative(cfg.root, filePath)
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => ({
                    file,
                    icon: mimeFn(file)
                }))
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(tpl(data))
        }
    } catch(err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        console.log(err)
        res.end(`${filePath} is not a directory or file\n ${err}`)
    }
}

module.exports = statFn
