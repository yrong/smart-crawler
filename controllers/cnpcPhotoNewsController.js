const CNPC_PHOTO_NEWS_TYPE = 'cnpc_photo_news'
const pageCrawlController = require('./pageCrawlController')

class CnpcPhotoNewsController {
    constructor(metaInfo) {
        this.metaInfo = metaInfo
    }

    async findPhotoNews(taskId) {
        let pageNo = this.metaInfo.max_page
        for(var i=1;i<=pageNo;i++){
            this.metaInfo.loadRootPageOptions = {uri:this.metaInfo.url,method:'POST',form:{activepage:i}}
            await pageCrawlController(this.metaInfo,taskId,CNPC_PHOTO_NEWS_TYPE)
        }
    }
}

module.exports = CnpcPhotoNewsController;