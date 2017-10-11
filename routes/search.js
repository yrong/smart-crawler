const Router = require('koa-router');
const router = new Router()
const _ = require('lodash')
const search = require('../search/index')
const queryString = require('query-string')

router.post('/search',async function(ctx,next){
    let params = Object.assign({},ctx.params,ctx.request.body)
    var items = await search.searchItem(params)
    ctx.body = items||{};
})

router.get('/show',async function(ctx,next){
    let params = queryString.parse(`?${ctx.url.split('?')[1]}`);
    var items = await search.searchItem(params)
    ctx.body = items||{};
})

router.all('/list/:source/:type',async function(ctx,next){
    let params = {},source=ctx.params.source,type=ctx.params.type,searchBody;
    if (ctx.url.indexOf('?') >= 0) {
        params = `?${ctx.url.split('?')[1]}`;
        params = queryString.parse(params);
    }
    searchBody = {body: {
        query: {
            bool: {
                must: [
                    {term: {source: source}},
                    {term: {type: type}}
                ]
            }
        }
    }}
    if(type==='photos'){
        searchBody.body.query.bool.must.push({exists: {
            field: "image_url"
        }})
    }
    params = Object.assign(params,ctx.params,ctx.request.body,searchBody)
    if(!params.sort)
        params.sort = 'rank'
    var items = await search.searchItem(params)
    items.results = items.results.map((item)=>{
        return _.omit(item,'html')
    })
    ctx.body = items||{};
})

module.exports = router;