const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const search = require('../search')
const Throttle = require('async-throttle')
const config = require('config')
const throttle = Throttle(config.get('crawlers.concurrency'))

module.exports  = async (metaInfo,taskid,category)=>{
    let start = new Date(), url_obj = URL.parse(metaInfo.url),promises = [],
        $ = await utils.loadPage(metaInfo.loadRootPageOptions),
        link_selector = metaInfo.selector.link,html_selector = metaInfo.selector.content,
        links = $(link_selector)
    logger.info(`find ${links.length} links from "${link_selector}"`)
    links.each((index,element)=>promises.push(throttle(async()=>{
        let url,id,title,$$,$image,image_url,html,item
        try {
            if(metaInfo.absolute_link_url)
                url = $(element).attr('href')
            else
                url = url_obj.protocol + "//" + url_obj.host + $(element).attr('href')
            id = utils.getIdfromUrl(url)
            item = await search.searchItem({id})
            if(item&&item.count){
                logger.info(`page already cached,${url}`)
                return item
            }
            title = $(element).attr('title')
            $$ = await utils.loadPage({uri:url})
            html = $$(html_selector).text()
            $image = $$(html_selector).find('img')
            if($image.length){
                image_url = $$(html_selector).find('img').attr('src')
                image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                image_url = await utils.cacheImage(image_url)
            }
            item = {taskid,id,url,title,image_url,html,category,rank:index}
            if(metaInfo.loadRootPageOptions.form&&metaInfo.loadRootPageOptions.form.activepage)
                item.rank = metaInfo.loadRootPageOptions.form.activepage*10 + index
            await search.addItem(category,item)
        }catch(error){
            logger.error(String(error))
        }
        return item
    })))
    await Promise.all(promises)
    logger.info(`all links in page ${JSON.stringify(metaInfo.loadRootPageOptions)} crawled,${ new Date() - start} ms consumed`)
}
