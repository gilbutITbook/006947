
'use strict';

const cluster = require('cluster');

class logs extends require('./server.js') {
    constructor() {
        super("logs"                                                // 1. POST/logs 한가지 기능만 가지도록 함
            , process.argv[2] ? Number(process.argv[2]) : 9040
            , ["POST/logs"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }

    onRead(socket, data) {                                          // 2. 로그가 입력되면 화면에 출력
        const sz = new Date().toLocaleString() + '\t' + socket.remoteAddress + '\t' + socket.remotePort + '\t' + JSON.stringify(data) + '\n';
        console.log(sz);
    }
}

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {  
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    new logs();
}
