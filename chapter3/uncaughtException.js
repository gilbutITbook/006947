
function func(callback) {
    process.nextTick(callback, "callback!!");
}

try {
    func((param) => {
        a.a = 0;       
    });
} catch (e) {
    console.log("exception!!");
}

process.on("uncaughtException", (error) => {    // 모든 스레드에서 발생하는 예외처리
    console.log("uncaughtException!!");
});
