#! /bin/bash

echo $'delete index'
curl -XDELETE 'http://localhost:9200/crawler/'
echo $'\n\ncreate crawler index and add schema in es'
curl --header "Content-Type: application/json" -XPUT 'http://localhost:9200/crawler/' -d @./search/crawler.json
