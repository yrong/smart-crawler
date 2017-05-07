const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const config = require('config')
const search = require('../search')
const CNPCAG_PHOTO_NEWS_TYPE = 'cnpcag_photo_news'

class CnpcAgController {
    constructor(url) {
        this.url = url
    }

    async findPhotoNews() {
        let $ = await utils.loadPage(this.url)
        var items = [],selector = config.get('crawlers.cnpcag.selector.photo_news_root')
        logger.info(`select root element from "${selector}"`)
        let $amu_root = $(selector)
        if($amu_root.length==0){
            throw new Error(`find root element from "${selector}" failed`)
        }
        let elements = $(selector).find('a')
        logger.info(`find ${elements.length} amu news from "${selector} a"`)
        let url_obj = URL.parse(this.url),element,url,id,title,image_url,html,item,$$,$image
        for(let i=0;i<elements.length;i++){
            element = elements[i]
            url = $(element).attr('href')
            id = utils.getIdfromUrl(url)
            title = $(element).attr('title')
            try {
                $$ = await utils.loadPage(url_obj.protocol + "//" + url_obj.host + url)
                selector = config.get('crawlers.cnpcag.selector.photo_news_html')
                logger.info(`select html from "${selector}"`)
                html = $$(selector).html()
                logger.info(`select image from "${selector} img"`)
                $image = $$(selector).find('img')
                if($image.length){
                    image_url = $$(selector).find('img').attr('src')
                    image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                    image_url = await utils.cacheImage(image_url)
                }
                item = {id,url,title,image_url,html}
                await search.addItem(CNPCAG_PHOTO_NEWS_TYPE,item)
            }catch(error){
                logger.error(String(error))
            }
            items.push(item)
        }
        return items
    };
}

module.exports = CnpcAgController;