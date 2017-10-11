const Router = require('koa-router');
const router = new Router()
const config = require('config')
const _ = require('lodash')
const pageCrawlController = require('../controllers/pageCrawlController')
const Event = require('events')
const EventEmitter = Event.EventEmitter
const eventEmitter = new EventEmitter()
const logger = require('../logger')

_.each(config.get('crawlers'),(crawler_meta_info)=>{
    router.post(crawler_meta_info.route,async(ctx,next)=>{
        crawler_meta_info.taskId = new Date().getTime()
        eventEmitter.emit('startCrawler', crawler_meta_info)
        ctx.body = crawler_meta_info;
    })
})

eventEmitter.on('startCrawler', async function (crawler_meta_info) {
    logger.info(`task ${crawler_meta_info.taskId} started`)
    let start = new Date(),max_page = crawler_meta_info.max_page?crawler_meta_info.max_page:1
    for(var i=1;i<=max_page;i++){
        crawler_meta_info.loadRootPageOptions = {uri:crawler_meta_info.url,method:i==1?'GET':'POST'}
        crawler_meta_info.loadRootPageOptions.form = i>1?{activepage:i}:undefined
        await pageCrawlController(crawler_meta_info)
    }
    logger.info(`task ${crawler_meta_info.taskId} finished,${ new Date() - start} ms consumed`)
})

module.exports = router;