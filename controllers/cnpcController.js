const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const config = require('config')
const path = require('path')
const fs = require('fs')
const search = require('../search')
const _ = require('lodash')
const CNPC_PHOTO_NEWS_TYPE = 'cnpc_photo_news'
const CNPC_TODAY_NEWS_TYPE = 'cnpc_today_news'

class CnpcController {
    constructor(url) {
        this.url = url
    }

    async findPhotoNews() {
        let $ = await utils.loadPage(this.url)
        let items = [],selector = config.get('crawlers.cnpc.selector.photo_news_root'),url_obj = URL.parse(this.url)
        let $root = $(selector)
        if($root.length!=1){
            throw new error(`find root element from "${selector}" failed`)
        }
        let elements = $root.find('li'),id,element,url,title,html,image_url,$element,item,$image,$$
        logger.info(`find ${elements.length} photo news from "${selector} li"`)
        for(let i=0;i<elements.length;i++){
            element = elements[i]
            $element = $(element).find('a').eq(0)
            if($element.length!=1){
                logger.error(`find link from "${selector} li a" failed`)
                continue
            }
            try {
                $image = $element.find('img')
                if ($image.length) {
                    logger.info(`find image from "${selector} li a img"`)
                    image_url = $image.attr('src')
                    image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                    image_url = await utils.cacheImage(image_url)
                }
                url = $element.attr('href')
                id = utils.getIdfromUrl(url)
                $$ = await utils.loadPage(url)
                selector = config.get('crawlers.cnpc.selector.photo_news_html')
                logger.info(`select html from ${selector}`)
                html = $$(selector).html()
                selector = config.get('crawlers.cnpc.selector.photo_news_title')
                logger.info(`select title from ${selector}`)
                title = $$(selector).text()
                item = {id,url,title,image_url,html}
                await search.addItem(CNPC_PHOTO_NEWS_TYPE,item)
                items.push(_.omit(item,'html'))
            }
            catch(error){
                logger.error(String(error))
            }
        }
        return items
	};

	async findTodayNews() {
        let $ = await utils.loadPage(this.url)
        var items = [],selector = config.get('crawlers.cnpc.selector.today_news_root')
        logger.info(`select root element from ${selector}`)
        let $ul = $(selector).eq(1)
        if($ul.length!=1){
            throw new Error(`find 2nd element from ${selector} failed`)
        }
        let elements = $ul.find('li'),element,$element,url,title,html,item,id,$$
        logger.info(`find ${elements.length} today news from "${selector} li"`)
        for(let i=0;i<elements.length;i++) {
            element = elements[i]
            $element = $(element).find('a').eq(0)
            if($element.length!=1){
                logger.error(`find today news link from "${selector} li a" failed`)
                continue
            }
            url = $element.attr('href')
            id = utils.getIdfromUrl(url)
            title = $element.text()
            try{
                $$ = await utils.loadPage(url)
                selector = config.get('crawlers.cnpc.selector.today_news_html')
                logger.info(`select html from ${selector}`)
                html = $$(selector).html()
                item = {id,url, title, html}
                await search.addItem(CNPC_TODAY_NEWS_TYPE,item)
                items.push(_.omit(item,'html'))
            }
            catch(error){
                logger.error(String(error))
            }
        }
        return items
	};
}

module.exports = CnpcController;