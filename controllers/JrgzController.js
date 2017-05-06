const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const config = require('config')
const path = require('path')
const fs = require('fs')
const search = require('../search')


class JrgzController {
    constructor(url) {
        this.url = url
    }

    async findPhotoNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await utils.loadPage(this.url)
        var items = [],selector = config.get('crawlers.jrgz.selector.photo_root'),url_obj = URL.parse(this.url)
        let elements = $(selector).find('li'),id,element,url,title,html,image_url,$element,item
        for(let i=0;i<elements.length;i++){
            element = elements[i]
            $element = $(element).find('a')
            url = $element.attr('href')
            id = new Buffer(url).toString('base64')
            try {
                image_url = $element.find('img').attr('src')
                image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                image_url = await utils.cacheImage(image_url)
                let $$ = await utils.loadPage(url)
                html = $$(config.get('crawlers.jrgz.selector.photo_html')).html()
                title = $$(config.get('crawlers.jrgz.selector.photo_title')).text()
                item = {id,url,title,image_url,html}
                await search.addItem('jrgz',item)
            }catch(error){
                logger.error(String(error))
            }
            items.push(item)
        }
        return items
	};

	async findTodayNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await utils.loadPage(this.url)
        var items = [],selector = '.components5 .s4-wpTopTable'
        logger.info(`select element from ${selector}`)
        let $jrwy = $($(selector).find('ul')[1])
        logger.info(`select 2nd element from ul`)
        logger.info(`select ${$jrwy.find('li a').length} elements from li a`)
        $jrwy.find('li a').each(function(){
            let url = $(this).attr('href')
            let title = $(this).text()
            items.push({url,title})
        })
        return items
	};
}

module.exports = JrgzController;