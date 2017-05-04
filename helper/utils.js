const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent)
const cheerio = require('cheerio')

const loadPage = async (url) => {
    let res = await superagent.get(url)
    return cheerio.load(res.text, {
        normalizeWhitespace: true
    })
}

module.exports = {loadPage}