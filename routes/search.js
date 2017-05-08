var Router = require('koa-router');
var router = new Router()
var search = require('../search/index')

router.post('/advanced',async function(ctx,next){
    ctx.jsonBody == true
    let params = Object.assign({},ctx.params,ctx.request.body)
    var items = await search.searchItem(params)
    ctx.body = items;
})

module.exports = router;