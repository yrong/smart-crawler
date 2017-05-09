const CNPCAG_PHOTO_NEWS_TYPE = 'cnpcag_photo_news'
const pageCrawlController = require('./pageCrawlController')

class CnpcAgPhotoNewsController {
    constructor(metaInfo) {
        this.metaInfo = metaInfo
    }

    async crawlPhotoNews(taskId) {
        this.metaInfo.loadRootPageOptions = {uri:this.metaInfo.url}
        await pageCrawlController(this.metaInfo,taskId,CNPCAG_PHOTO_NEWS_TYPE)
    };
}

module.exports = CnpcAgPhotoNewsController;