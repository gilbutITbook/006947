
'use strict';

const business = require('../chapter5/monolithic_goods.js');
const cluster = require('cluster');                      // 1. Cluster 모듈 로드

class goods extends require('./server.js') {
    constructor() {
        super("goods"                                      
            , process.argv[2] ? Number(process.argv[2]) : 9010
            , ["POST/goods", "GET/goods", "DELETE/goods"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {  
            console.log("Distributor Notification", data);
        });
    }

    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}
if (cluster.isMaster) {                             // 2. 자식 프로세스 실행
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {  // 3. Exit 이벤트 발생시 새로운 자식프로세스 실행
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    new goods();
}
