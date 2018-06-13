const {createGzip, createDeflate} = require('zlib')

const compressFn = (rs, req, res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    console.log('acceptEncoding', acceptEncoding)
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip')
        return rs.pipe(createGzip())
    } else {
        res.setHeader('Content-Encoding', 'deflate')
        return rs.pepe(createDeflate())
    }
}

module.exports = compressFn
