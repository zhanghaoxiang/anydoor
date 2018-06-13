module.exports = (total, req, res) => {
    const range = req.headers['range']

    if (!range) {
        return {code : 200}
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || total - 1
    const start = sizes[1] || total - end

    if (start > end || start < 0 || end > total) {
         return {
            code : 200
         }
    }

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`)
    res.setHeader('Content-Length', end - start)

    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
}
