
const cluster = require('cluster');                     // 1. cluster 모듈 로드
const http = require('http');                           // 2. http 모듈 로드
const numCPUs = require('os').cpus().length;            // 3. Cpu 코어 수를 알아옴

if (cluster.isMaster) {                                 // 4. 부모 프로세스일 경우 
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {                   // 5. 코어 수 만큼 자식 프로세스 실행
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {        // 6. 자식 프로세스 종료 이벤트 감지
    console.log(`worker ${worker.process.pid} died`);
  });
} else {                                                // 7. 자식 프로세스일 경우 http 서버 실행
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
