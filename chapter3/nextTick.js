
function func(callback) {
    process.nextTick(callback, "callback!!");       // 1. nextTick을 통해 인자값으로 전달된 callback 함수 호출.
}

try {                                               // 2. 예외처리를 위해 try~catch문 선언
    func((param) => {
        a.a = 0;                                    // 3. 의도적으로 예외 발생
    });
} catch (e) {
    console.log("exception!!");                     // 4. 동일한 스레드일 경우 호출
}
