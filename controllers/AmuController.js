const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const config = require('config')
const search = require('../search')

class AmuController {
    constructor(url) {
        this.url = url
    }

    async findPhotoNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await utils.loadPage(this.url)
        var items = [],selector = config.get('crawlers.amu.selector.photo_root')
        let elements = $(selector).find('a')
        let url_obj = URL.parse(this.url)
        for(let i=0;i<elements.length;i++){
            let element = elements[i]
            let url = $(element).attr('href')
            let id = new Buffer(url).toString('base64')
            let title = $(element).attr('title')
            let image_url,html,item
            try {
                let $$ = await utils.loadPage(url_obj.protocol + "//" + url_obj.host + url)
                html = $$(config.get('crawlers.amu.selector.photo_html')).html()
                image_url = $$(config.get('crawlers.amu.selector.photo_html')).find('img').attr('src')
                image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                image_url = await utils.cacheImage(image_url)
                item = {id,url,title,image_url,html}
                await search.addItem('amu',item)
            }catch(error){
                logger.error(String(error))
            }
            items.push(item)
        }
        return items
    };

}

module.exports = AmuController;