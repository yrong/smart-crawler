const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const convert = require('koa-convert');
const cors = require('kcors')
const bodyparser = require('koa-bodyparser')
const mount = require('koa-mount')
const staticFile = require('koa-static')
const log4js = require('log4js')
const config = require('config')
const path = require('path')
const fs = require('fs')
const crawler_routes = require('./routes/crawler')
const search_routes = require('./routes/search')
const logger = require('./logger')

/**
 * logger
 */
const logger_config = config.get('logger')
const logDir = path.join('./logs')
if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}
log4js.configure(logger_config,{ cwd: logDir });

/**
 * image folder
 */
let images_dir = path.resolve('./public/images_crawled')
if (!fs.existsSync(images_dir)){
    fs.mkdirSync(images_dir);
}
/**
 * middleware
 */
app.use(bodyparser());
app.use(cors())
app.use(convert(staticFile(path.join(__dirname, 'public'))));
app.use(async(ctx, next) => {
	try {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        if(ctx.type === 'application/json' || ctx.jsonBody == true)
            ctx.body = {status: 'ok',message:{content:'operation success',displayAs:'toast'},data:ctx.body||{}}
        logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
    }catch(error){
        ctx.body = {
            status:"error",
            message:{
                content: String(error),
                displayAs:"modal"
            }
        }
        ctx.status = error.status || 500
        logger.error('%s %s - %s', ctx.method,ctx.url, String(error))
	}
});

router.use('/crawler', crawler_routes.routes(), crawler_routes.allowedMethods());
router.use('/search', search_routes.routes(), search_routes.allowedMethods());
app.use(router.routes(), router.allowedMethods());

let port = config.get('port')
app.listen(port,function () {
    console.log(`App started at port:${port}`);
});
