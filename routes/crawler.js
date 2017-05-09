var Router = require('koa-router');
var router = new Router()
var config = require('config')
var CnpcTodayNewsController = require('../controllers/cnpcTodayNewsController.js')
var CnpcPhotoNewsController = require('../controllers/cnpcPhotoNewsController.js')
var CnpcAgPhotoNewsController = require('../controllers/cnpcAgPhotoNewsController')
var cnpcTodayNewsController = new CnpcTodayNewsController(config.get('crawlers.cnpc_today_news'))
var cnpcPhotoNewsController = new CnpcPhotoNewsController(config.get('crawlers.cnpc_photo_news'))
var cnpcAgPhotoNewsController = new CnpcAgPhotoNewsController(config.get('crawlers.cnpc_ag_photo_news'))

router.get('/cnpc/photos', async function(ctx, next) {
    ctx.jsonBody == true
    let taskId = new Date().getTime()
    cnpcPhotoNewsController.findPhotoNews(taskId)
    ctx.body = {taskId};
})

router.get('/cnpc/today', async function(ctx, next) {
    ctx.jsonBody == true
    let taskId = new Date().getTime()
    cnpcTodayNewsController.findTodayNews(taskId)
    ctx.body = {taskId};
})

router.get('/cnpcag/photos',async function(ctx,next){
    ctx.jsonBody == true
    let taskId = new Date().getTime()
    cnpcAgPhotoNewsController.crawlPhotoNews(taskId)
    ctx.body = {taskId};
})

module.exports = router;