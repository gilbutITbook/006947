
const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'micro',
    password: 'service',
    database: 'monolithic'
};

const redis = require("redis").createClient(); // Redis 모듈 로드

redis.on("error", function (err) {
    console.log("Redis Error " + err);
});

/*
 * 구매 관리의 각 기능별로 분기
*/
exports.onRequest = function (res, method, pathname, params, cb) {

    switch (method) {
        case "POST":
            return register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        default:
            return process.nextTick(cb, res, null);
    }
}

/**
 * 구매 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.userid == null || params.goodsid == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        redis.get(params.goodsid, (err, result) => { // Redis에 상품정보 조회
            if (err || result == null) {
                response.errorcode = 1;
                response.errormessage = "Redis failure";
                cb(response);
                return;
            }

            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("insert into purchases(userid, goodsid) values(? ,? )"
                , [params.userid, params.goodsid]
                , (error, results, fields) => {
                    if (error) {
                        response.errorcode = 1;
                        response.errormessage = error;
                    }
                    cb(response);
                });
            connection.end();
        });
        
    }
}

/**
 * 구매 내역 조회 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.userid == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select id, goodsid, date from purchases where userid = ?"
            , [params.userid]
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results;
                }
                cb(response);
            });
        connection.end();
    }
}
