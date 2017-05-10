/**
 * Created by Shawn on 2017/5/10.
 */
var redis = require('redis');
var client = redis.createClient();
exports.throw = function (bottle, callback) {
    bottle.time = bottle.time || Date.now();
    //为每个漂流瓶随机生成一个id
    var bottleId = Math.random().toString(16); //生成16进制随机字符串
    var type = {male:0, female:1};
    //根据漂流瓶类型的不同将漂流瓶保存到不同的数据库
    client.SELECT(type[bottle.type], function () {
        //以hash类型保存漂流瓶对象
        client.HMSET(bottleId, bottle, function (err, result) {
            if(err){
                return callback({code:0, msg:"过会儿再试试吧！"});
            }
            //返回结果， 成功时返回OK
            callback({code:1, msg: result});
            //设置漂流瓶生存期为 1 天
            client.EXPIRE(bottleId, 86400);
        });
    });
}