const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent)
const cheerio = require('cheerio')
const logger = require('../logger')


class JrgzController {
    constructor(url) {
        this.url = url
    }

    async loadPage(url) {
        let res = await superagent.get(url)
        return cheerio.load(res.text, {
            normalizeWhitespace: true
        })
    }

    async findPhotoNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await this.loadPage(this.url)
        var items = [],selector = '.components4 .s4-wpTopTable ul li'
        logger.info(`select ${$(selector).length} elements from ${selector}`)
        $(selector).each(function() {
            let $url = $(this).find('a')
            let url = $url.attr('href')
            let image = $url.find('img').attr('src')
            let title = $($(this).find('p a')[1]).text()
            items.push({url,title,image})
        })
        return items
	};

	async findTodayNews() {
        logger.info(`crawl page from ${this.url}`)
        let $ = await this.loadPage(this.url)
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