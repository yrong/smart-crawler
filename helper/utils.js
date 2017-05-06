const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent)
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const os = require('os')
const path = require('path')
const config = require('config')
const logger = require('../logger')

const loadPage = async (url) => {
    let res = await superagent.get(url).charset('UTF-8')
    logger.info(`page from ${url} crawled`)
    return cheerio.load(res.text, {
        normalizeWhitespace: true,
        decodeEntities: false
    })
}

const downloadFile = async (url,filePath) => {
    return new Promise((resolve,reject)=>{
        request(url).pipe(fs.createWriteStream(filePath)).on('close', resolve).on('error',reject);
    })
}

const getExternelIP = () =>{
    var address,ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        var iface = ifaces[dev].filter(function(details) {
            return details.family === 'IPv4' && details.internal === false;
        });
        if(iface.length > 0) address = iface[0].address;
    }
    return address
}

const cacheImage = async (image_url) =>{
    let images_dir = path.resolve('./public/images_crawled')
    let image_suffix = path.extname(image_url)
    let image_id = new Buffer(image_url).toString('base64').slice(0,240)
    let image_path = images_dir + '/' + image_id  + image_suffix
    await downloadFile(image_url,image_path)
    logger.info(`image from ${image_url} to ${image_path} cached`)
    let cached_image_url = "http://" + getExternelIP() + ":" + config.get('port') + "/images_crawled/" + image_id + image_suffix
    return cached_image_url
}

const getIdfromUrl = (url) => {
    return new Buffer(url).toString('base64')
}

module.exports = {loadPage,downloadFile,getExternelIP,cacheImage,getIdfromUrl}