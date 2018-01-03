
'use strict';
const net = require('net');
const tcpClient = require('./client.js');

/*
* 서버 클래스
*/
class tcpServer{
    constructor(name, port, urls) {
        //서버 상태 정보
        this.context = {
            port: port,
            name: name,
            urls: urls
        }
        this.merge = {};

        // 서버 객체 생성
        this.server = net.createServer((socket) => {    
            // 클라이언트 접속 이벤트
            this.onCreate(socket);

            // 에러 이벤트
            socket.on('error', (exception) => {
                this.onClose(socket);
            });

            // 클라이언트 접속 종료 이벤트
            socket.on('close', () => {
                this.onClose(socket);
            });
           
            // 데이터 수신 이벤트
            socket.on('data', (data) => {
                var key = socket.remoteAddress + ":" + socket.remotePort;
                var sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
                var arr = sz.split('¶');
                for (var n in arr) {
                    if (sz.charAt(sz.length - 1) != '¶' && n == arr.length - 1) {
                        this.merge[key] = arr[n];
                        break;
                    } else if (arr[n] == "") {
                        break;
                    } else {
                        this.onRead(socket, JSON.parse(arr[n]));
                    }
                }
            });
        });
         
        // 서버 객체 에러 이벤트
        this.server.on('error', (err) => {
            console.log(err);
        });
     
        // 리슨
        this.server.listen(port, () => {
            console.log('listen', this.server.address());
        });
    }

    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);
    }

    onClose(socket) {
        console.log("onClose", socket.remoteAddress, socket.remotePort);
    }
 
    // Distributor 접속 함수
    connectToDistributor(host, port, onNoti) {       
       
        // Distributor 전달 패킷
        var packet = {
            uri: "/distributes",
            method: "POST",
            key: 0,
            params: this.context
        };
        var isConnectedDistributor = false;

        this.clientDistributor = new tcpClient(
            host
            , port
            , (options) => {                                    // Distributor 접속 이벤트
                isConnectedDistributor = true;                
                this.clientDistributor.write(packet);
            }
            , (options, data) => { onNoti(data); }              // Distributor 데이터 수신 이벤트
            , (options) => { isConnectedDistributor = false; }  // Distributor 접속종료 이벤트
            , (options) => { isConnectedDistributor = false; }  // Distributor 통신 에러 이벤트
        );

        // 주기적으로 재접속 시도
        setInterval(() => {
            if (isConnectedDistributor != true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }    
}

module.exports = tcpServer;
