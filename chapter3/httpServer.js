
const http = require('http');                       // http모듈 로드

var server = http.createServer((req, res) => {      // createServer함수를 이용해 인스턴스 생성
    res.end("hello world");                         // hello world 응답
});

server.listen(8000);                                // 8000번 포트로 리슨
