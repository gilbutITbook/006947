
var net = require('net');                           // net모듈 로드
var server = net.createServer((socket) => {         // TCP서버 생성
    socket.end("hello world");                      // 접속시 heelo world 응답
});

server.on('error', (err) => {                       // 네트워크 에러 처리
    console.log(err);
});

server.listen(9000, () => {                         // 9000번 포트로 리슨
    console.log('listen', server.address());        //  리슨이 가능해 지면 화면에 출력
});
