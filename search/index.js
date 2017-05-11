var config = require('config');

var _ = require('lodash');

var esConfig = config.get('elasticsearch');

var elasticsearch = require('elasticsearch');

var logger = require('../logger')

var es_client = new elasticsearch.Client({
    host: esConfig.host + ":" + esConfig.port
});

var addItem = async function(obj) {
    let index_obj = {
        index: esConfig.index,
        type: esConfig.type,
        id: obj.id,
        body: obj
    }
    await es_client.index(index_obj)
}

var deleteAll = async function() {
    await es_client.deleteByQuery({index:[esConfig.index],body:{query:{match_all:{}}}})
}

var responseWrapper = function(response){
    return {count:response.hits.total,results:_.map(response.hits.hits,(result)=>_.omit(result._source,['_index','_type']))}
}

var searchItem = async function(params) {
    var query = params.id?`id:"${params.id}"`:(params.keyword?params.keyword:'*');
    var _source = params._source?params._source.split(','):true;
    var params_pagination = {"from":0,"size":config.get('perPageSize')},from;
    if(params.page&&params.per_page){
        from = (String)((parseInt(params.page)-1) * parseInt(params.per_page));
        params_pagination = {"from":from,"size":params.per_page}
    }
    var params_sort = params.sort?{sort:params.sort}:{sort:'rank'}
    var queryObj = params.body?{body:params.body}:{q:query}
    var searchObj = _.assign({
        index: esConfig.index,
        type: esConfig.type,
        _source:_source
    },queryObj,params_pagination,params_sort)
    let response = await es_client.search(searchObj)
    return responseWrapper(response)
}

var checkStatus = ()=> {
    return es_client.ping({
        requestTimeout: Infinity
    })
}

module.exports = {searchItem,addItem,checkStatus,deleteAll}