const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent)
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')

const loadPage = async (url) => {
    let res = await superagent.get(url)
    return cheerio.load(res.text, {
        normalizeWhitespace: true
    })
}

const downloadFile = async (url,filePath) => {
    return new Promise((resolve,reject)=>{
        request(url).pipe(fs.createWriteStream(filePath)).on('close', resolve).on('error',reject);
    })
}

module.exports = {loadPage,downloadFile}