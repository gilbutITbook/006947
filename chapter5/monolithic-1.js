const http = require('http');
const url = require('url');
const querystring = require('querystring');

var server = http.createServer((req, res) => {
    var method = req.method;
    var uri = url.parse(req.url, true);
    var pathname = uri.pathname;

    if (method === "POST" || method === "PUT") {                        //1. POST와 PUT일경우 데이터를 읽음
        var body = "";

        req.on('data', function (data) {                                
            body += data;
        });
        req.on('end', function () {
            var params;
            if (req.headers['content-type'] == "application/json") {        //2. 헤더정보가 json일 경우 처리
                params = JSON.parse(body);
            } else {
                params = querystring.parse(body);
            }

            onRequest(res, method, pathname, params);
        });
    } else {
        onRequest(res, method, pathname, uri.query);                    //3. GET과 DELETE일 경우 query정보를 읽음
    }
}).listen(8000);

function onRequest(res, method, pathname, params) {
    res.end("response!");                                           //4. 모든 요청에 대해 "response!"란 메세지를 보냄
}
