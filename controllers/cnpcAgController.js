const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const config = require('config')
const search = require('../search')
const CNPCAG_PHOTO_NEWS_TYPE = 'cnpcag_photo_news'
const parallel = require('async-await-parallel')

class CnpcAgController {
    constructor(url) {
        this.url = url
    }

    async crawlPhotoNews(links) {
        let $ = this.$rootElement,taskid = this.taskid,root_url = this.url,url_obj = URL.parse(root_url)
        let promises = links.map((index,element)=>async function(){
            let selector,url,id,title,image_url,html,item,$$,$image
            url = url_obj.protocol + "//" + url_obj.host + $(element).attr('href')
            id = utils.getIdfromUrl(url)
            item = await search.searchItem({id})
            if(item&&item.count){
                logger.info(`page already cached,${url}`)
                return item
            }
            try {
                title = $(element).attr('title')
                $$ = await utils.loadPage(url)
                selector = config.get('crawlers.cnpcag.selector.photo_news_html')
                html = $$(selector).text()
                $image = $$(selector).find('img')
                if($image.length){
                    image_url = $$(selector).find('img').attr('src')
                    image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                    image_url = await utils.cacheImage(image_url)
                }
                item = {taskid,id,url,title,image_url,html}
                await search.addItem(CNPCAG_PHOTO_NEWS_TYPE,item)
            }catch(error){
                logger.error(String(error))
            }
            return item
        })
        await parallel(promises,config.get('crawlers.concurrency'));
        const ms = new Date() - this.start;
        logger.info(`task with id ${taskid} finished,${ms} ms consumed`)
    }

    async crawlPhotoNewsAsync() {
        this.start = new Date();
        this.$rootElement = await utils.loadPage(this.url)
        let selector = config.get('crawlers.cnpcag.selector.photo_news_root')
        let $cnpcag_root = this.$rootElement(selector)
        if($cnpcag_root.length==0){
            throw new Error(`find root element from "${selector}" failed`)
        }
        let links = this.$rootElement(selector).find('a[href]')
        logger.info(`find ${links.length} cnpcag news from "${selector} a[href]"`)
        this.taskid = this.start.getTime()
        this.crawlPhotoNews(links)
        return {taskid:this.taskid}
    };
}

module.exports = CnpcAgController;