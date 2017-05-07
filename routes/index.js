var Router = require('koa-router');
var router = new Router()
var CnpcController = require('../controllers/cnpcController.js')
var CnpcAgController = require('../controllers/cnpcAgController')
var config = require('config')

var cnpcController = new CnpcController(config.get('crawlers.cnpc.url'))
var cnpcAgController = new CnpcAgController(config.get('crawlers.cnpcag.url'))
var search = require('../search/index')

router.get('/', function(ctx, next) {
	ctx.body = 'this is response!';
});

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
    var items = await cnpcAgController.findPhotoNews()
    ctx.body = items;
})

router.get('/show/:id',async function(ctx,next){
    ctx.jsonBody == true
    var items = await search.searchItem(ctx.params)
    ctx.body = items;
})

module.exports = router;