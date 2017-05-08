var Router = require('koa-router');
var router = new Router()
var config = require('config')
var CnpcController = require('../controllers/cnpcController.js')
var CnpcAgController = require('../controllers/cnpcAgController')
var cnpcController = new CnpcController(config.get('crawlers.cnpc.url'))
var cnpcAgController = new CnpcAgController(config.get('crawlers.cnpcag.url'))

router.get('/cnpc/photos', async function(ctx, next) {
    ctx.jsonBody == true
	var items = await cnpcController.findPhotoNews()
	ctx.body = items;
})

router.get('/cnpc/today', async function(ctx, next) {
    ctx.jsonBody == true
    var items = await cnpcController.findTodayNews()
    ctx.body = items;
})

router.get('/cnpcag/photos',async function(ctx,next){
    ctx.jsonBody == true
    var items = await cnpcAgController.crawlPhotoNewsAsync()
    ctx.body = items;
})

module.exports = router;