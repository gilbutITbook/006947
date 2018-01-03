
'use strict';

// 비즈니스로직 파일 참조
const business = require('../chapter5/monolithic_members.js');

// Server클래스 참조
class members extends require('./server.js') {
    constructor() {
        super("members"                                                     // 부모 클래스 생성자 호출
            , process.argv[2] ? Number(process.argv[2]) : 9020
            , ["POST/members", "GET/members", "DELETE/members"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {            // Distributor 연결
            console.log("Distributor Notification", data);
        });
    }
    
    // 클라이언트 요청에 따른 비즈니스로직 호출
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new members();                                                              // 인스턴스 생성
