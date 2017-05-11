const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')
const search = require('../search')
const Throttle = require('async-throttle')
const config = require('config')
const throttle = Throttle(config.get('concurrency'))

module.exports  = async (metaInfo)=>{
    let start = new Date(),url_obj = URL.parse(metaInfo.url),
        link_selector = metaInfo.selector.link,html_selector = metaInfo.selector.content,date_selector = metaInfo.selector.date
        $ = await utils.loadPage(metaInfo.loadRootPageOptions), links = $(link_selector),promises=[]
    logger.info(`find ${links.length} links from "${link_selector}"`)
    links.each((index,element)=>promises.push(throttle(async()=>{
        let url,id,title,$$,$image,image_url,html,date,item
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
            title = $(element).text()
            $$ = await utils.loadPage({uri:url})
            html = $$(html_selector).text()
            $image = $$(html_selector).find('img')
            if($image.length){
                image_url = $$(html_selector).find('img').attr('src')
                image_url = url_obj.protocol + "//" + url_obj.host + "/" + encodeURIComponent(image_url)
                image_url = await utils.cacheImage(image_url)
            }
            if(date_selector)
                date = $$(date_selector).text().trim()
            item = {id,url,title,image_url,html,date,rank:index,taskId:metaInfo.taskId,source:metaInfo.source,type:metaInfo.type}
            if(metaInfo.loadRootPageOptions.form&&metaInfo.loadRootPageOptions.form.activepage)
                item.rank = metaInfo.loadRootPageOptions.form.activepage*links.length + index
            await search.addItem(item)
        }catch(error){
            logger.error(String(error))
        }
        return item
    })))
    await Promise.all(promises)
    logger.info(`all links in page ${JSON.stringify(metaInfo.loadRootPageOptions)} crawled,${ new Date() - start} ms consumed`)
}
