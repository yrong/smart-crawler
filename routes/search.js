const Router = require('koa-router');
const router = new Router()
const _ = require('lodash')
const search = require('../search/index')
const queryString = require('query-string')

router.post('/search',async function(ctx,next){
    ctx.jsonBody == true
    let params = Object.assign({},ctx.params,ctx.request.body)
    var items = await search.searchItem(params)
    ctx.body = items;
})

router.get('/show/:id',async function(ctx,next){
    ctx.jsonBody == true
    var items = await search.searchItem(ctx.params)
    ctx.body = items;
})

router.all('/list/:source/:type',async function(ctx,next){
    ctx.jsonBody == true
    let params = {};
    if (ctx.url.indexOf('?') >= 0) {
        params = `?${ctx.url.split('?')[1]}`;
        params = queryString.parse(params);
    }
    params = Object.assign(params,ctx.params,ctx.request.body,{"body": {
        "query": {
            "bool": {
                "must": [
                    {"term": {"source": ctx.params.source}},
                    {"term": {"type": ctx.params.type}}
                ]
            }
        }
    }})
    var items = await search.searchItem(params)
    items.results = items.results.map((item)=>{
        return _.omit(item,'html')
    })
    ctx.body = items;
})

module.exports = router;