
function func(callback) {       // 1. func함수 선언
    callback("callback!!");     // 2. 인자값으로 전달된 callback 함수 호출
}

func((param) => {               // 3. 익명 함수를 인자로 func함수 호출
    console.log(param);
});
