var Router = require('koa-router');
var router = new Router()
var JrgzController = require('../controllers/JrgzController.js');
var AmuController = require('../controllers/AmuController')
var config = require('config')

var jrgzController = new JrgzController(config.get('crawlers.jrgz.url'))
var amuController = new AmuController(config.get('crawlers.amu.url'))

router.get('/', function(ctx, next) {
	ctx.body = 'this is response!';
});

router.get('/jrgz/photos', async function(ctx, next) {
    ctx.jsonBody == true
	var items = await jrgzController.findPhotoNews()
	ctx.body = items;
})

router.get('/jrgz/news', async function(ctx, next) {
    ctx.jsonBody == true
    var items = await jrgzController.findTodayNews()
    ctx.body = items;
})

router.get('/amu/photos',async function(ctx,next){
    ctx.jsonBody == true
    var items = await amuController.findPhotoNews()
    ctx.body = items;
})

module.exports = router;