smart-crawler
=============

一个高度可配置的爬虫框架，配置项参见config/default.json，部分抓取配置项说明如下:

```
//抓取并发度
"concurrency": 5,
//抓取存储系统(暂时支持es)
"elasticsearch": {
    "host": "localhost",
    "port": 9200,
    "index": "crawler",
    "type": "crawler"
}
//抓取项列表
"crawlers": [
     {
     //抓取项触发路由，向该路由发送post请求触发抓取流程
      "route": "/cnpc/news",
      //抓取项首页
      "url": "http://www.cnpc/zhlm/jrgz/jrgz/Pages/more.aspx",
      //抓取项source字段,用于后续的查询过滤
      "source":"cnpc",
      //抓取项type字段,用于后续的查询过滤
      "type": "news",
      //子连接url类型（如果是相对url类型需要根据首页url的host部分凭借完整url
      "absolute_link_url": true,
      //分页抓取深度
      "max_page": 2,
      //页面元素的选择器
      "selector": {
        "link": "div.w_newslistpage_body ul li a[href]",
        "content": ".wenzi2016",
        "date": "div.newsDate2016 span.pubtime"
      }
    },
    {
      "route": "/cnpc/photos",
      "url": "http://www.cnpc/zhlm/tpxw/Pages/index.aspx",
      "source":"cnpc",
      "type": "photos",
      "absolute_link_url": true,
      "max_page": 2,
      "selector": {
        "link": "div.w_newslistpage_body ul li a[href]",
        "content": ".wenzi2016",
        "date": "div.newsDate2016 span.pubtime"
      }
    },
    {
      "route": "/cnpcag/photos",
      "url": "http://10.161.134.146/ShowInfo.aspx?channel=1&&daohang=NewsCenter&&sParamValue=%E5%9B%BE%E7%89%87%E6%96%B0%E9%97%BB",
      "source": "cnpcag",
      "type": "photos",
      "selector": {
        "link": "#div_content table tr td a[href]",
        "content": "#divContent",
        "date": "#lblPublishTime"
      }
    }
  ]
```


## 运行
node --harmony app.js

## 测试
参考test目录下的postman用例




