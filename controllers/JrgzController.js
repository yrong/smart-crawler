const utils = require('../helper/utils')
const logger = require('../logger')
const URL = require('url')


class JrgzController {
    constructor(url) {
        this.url = url
    }

    async findPhotoNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await utils.loadPage(this.url)
        var items = [],selector = '.components4 .s4-wpTopTable #focus1 ul',url_obj = URL.parse(this.url)
        let elements = $(selector).find('li')
        for(let i=0;i<elements.length;i++){
            let element = elements[i]
            let $url = $(element).find('a')
            let url = $url.attr('href')
            let image = url_obj.protocol + "//" + url_obj.host + $url.find('img').attr('src'),title
            try {
                let $$ = await utils.loadPage(url)
                title = $$('.newsTitle2016 #ctl00_PlaceHolderMain_Title__ControlWrapper_RichHtmlField h1').text()
            }catch(error){
                logger.error(`${href}:${String(error)}`)
            }
            items.push({url,title,image})
        }
        return items
	};

	async findTodayNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await utils.loadPage(this.url)
        var items = [],selector = '.components5 .s4-wpTopTable'
        logger.info(`select element from ${selector}`)
        let $jrwy = $($(selector).find('ul')[1])
        logger.info(`select 2nd element from ul`)
        logger.info(`select ${$jrwy.find('li a').length} elements from li a`)
        $jrwy.find('li a').each(function(){
            let url = $(this).attr('href')
            let title = $(this).text()
            items.push({url,title})
        })
        return items
	};
}

module.exports = JrgzController;