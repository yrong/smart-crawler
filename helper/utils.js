const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const os = require('os')
const path = require('path')
const config = require('config')
const logger = require('../logger')

const loadPage = async (options) => {
    logger.info(`start loading page from ${options.uri}`)
    let response = await rp(Object.assign({}, options,{
        transform: function (body) {
            return cheerio.load(body, {
                normalizeWhitespace: true,
                decodeEntities: false
            });
        }
    }))
    logger.info(`page from ${options.uri} crawled`)
    return response
}

const downloadFile = async (url, filePath) => {
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream(filePath))
            .on('close', () => {
                resolve()
            }).on('error', (error) => {
                logger.error('download file error' + String(error))
                reject(error)
            }
        );
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
    let image_id = new Buffer(image_url).toString('base64').slice(-240)
    let image_path = images_dir + '/' + image_id  + image_suffix
    if (!fs.existsSync(image_path)){
        logger.info(`start caching image from ${image_url}`)
        await downloadFile(image_url,image_path)
        logger.info(`image from ${image_url} cached`)
    }
    let cached_image_url = "http://" + getExternelIP() + ":" + config.get('port') + "/images_crawled/" + image_id + image_suffix
    return cached_image_url
}

const getIdfromUrl = (url) => {
    return new Buffer(url).toString('base64')
}

module.exports = {loadPage,downloadFile,getExternelIP,cacheImage,getIdfromUrl}