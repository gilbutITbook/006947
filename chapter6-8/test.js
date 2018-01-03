
const http = require('http');

var options = {
    host: "127.0.0.1",
    port: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
};


function request(cb, params) {
    var req = http.request(options, (res) => {      
        var data = "";
        res.on('data', (chunk) => {                 
            data += chunk;
        });

        res.on('end', () => {                       
            console.log(options, data);
            cb();
        });
    });

    if (params) {
        req.write(JSON.stringify(params));
    }

    req.end();
}


/**
 * 상품 관리 API 테스트
 */

function goods(callback) {    
    goods_post(() => {
        goods_get(() => {
            goods_delete(callback);
        });
    });
    
    

    function goods_post(cb) {        
        options.method = "POST";
        options.path = "/goods";
        request(cb, {
            name: "test Goods",
            category: "tests",
            price: 1000,
            description: "test"
        });
    }

    function goods_get(cb) {
        options.method = "GET";
        options.path = "/goods";
        request(cb);
    }

    function goods_delete(cb) {
        options.method = "DELETE";
        options.path = "/goods?id=1";
        request(cb);
    }
}

/**
 * 회원 관리 API 테스트
 */
function members(callback) {

    members_delete(() => {
        members_post(() => {
            members_get(callback);
        });
    });
    
    

    function members_post(cb) {        
        options.method = "POST";
        options.path = "/members";
        request(cb, {
            username: "test_account",
            password: "1234",
            passwordConfirm: "1234"
        });
    }

    function members_get(cb) {
        options.method = "GET";
        options.path = "/members?username=test_account&password=1234";
        request(cb);
    }

    function members_delete(cb) {
        options.method = "DELETE";
        options.path = "/members?username=test_account";
        request(cb);
    }
}

/**
 *  구매 관리 API 테스트
 */
function purchases(callback) {

    purchases_post(() => {
        purchases_get(() => {
            callback();
        });
    });

    function purchases_post(cb) {        
        options.method = "POST";
        options.path = "/purchases";        
        request(cb, {
            userid: 1,
            goodsid: 1
        });
    }

    function purchases_get(cb) {
        options.method = "GET";
        options.path = "/purchases?userid=1";        
        request(cb);
    }
}

console.log("============================== members ==============================");
members(() => {
    console.log("============================== goods ==============================");
    goods(() => {
        console.log("============================== purchases ==============================");
        purchases(() => {
            console.log("done");
        });
    });
});
