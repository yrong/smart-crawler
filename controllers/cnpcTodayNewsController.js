const CNPC_TODAY_NEWS_TYPE = 'cnpc_today_news'
const pageCrawlController = require('./pageCrawlController')

class CnpcTodayNewsController {
    constructor(metaInfo) {
        this.metaInfo = metaInfo
    }

	async findTodayNews(taskId) {
        let pageNo = this.metaInfo.max_page
        for(var i=1;i<=pageNo;i++){
            this.metaInfo.loadRootPageOptions = {uri:this.metaInfo.url,method:'POST',form:{activepage:i}}
            await pageCrawlController(this.metaInfo,taskId,CNPC_TODAY_NEWS_TYPE)
        }
	}
}

module.exports = CnpcTodayNewsController;