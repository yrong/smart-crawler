const Router = require('koa-router');
const router = new Router()
const _ = require('lodash')
const search = require('../search/index')

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

router.get('/list/:source/:type',async function(ctx,next){
    ctx.jsonBody == true
    let search_params = {
        "body": {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"source": ctx.params.source}},
                        {"term": {"type": ctx.params.type}}
                    ]
                }
            }
        }
    }
    var items = await search.searchItem(search_params)
    items.results = items.results.map((item)=>{
        return _.omit(item,'html')
    })
    ctx.body = items;
})

module.exports = router;