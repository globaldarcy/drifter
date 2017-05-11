/**
 * Created by Shawn on 2017/5/10.
 */
var redis = require('redis');
var client = redis.createClient();
var client2 = redis.createClient();
var client3 = redis.createClient();
//扔一个漂流瓶
exports.throw = function (bottle, callback) {
  client2.select(2,function () {
    client2.get(bottle.owner, function (err, result) {
      if(result >= 10){
        return callback({code:0, msg:"今天扔瓶子用完了."})
      }
      client2.incr(bottle.owner, function () {
        client2.ttl(bottle.owner, function (err, ttl) {
          if(ttl === -1){
            client2.EXPIRE(bottle.owner, 86400);
          }
        });
      });
      bottle.time = bottle.time || Date.now();
      //为每个漂流瓶随机生成一个id
      //var bottleId = Math.random().toString(16); //生成16进制随机字符串
      var bottleId = (Date.now() + Math.random()).toString(16); //通过当前时间生成16进制随机字符串
      var type = {male: 0, female: 1};
      //根据漂流瓶类型的不同将漂流瓶保存到不同的数据库
      console.log(type[bottle.type]);
      client.SELECT(type[bottle.type], function () {
        //以hash类型保存漂流瓶对象
        client.HMSET(bottleId, bottle, function (err, result) {
          if (err) {
            return callback({code: 0, msg: "过会儿再试试吧！"});
          }
          //返回结果， 成功时返回OK
          callback({code: 1, msg: result});
          //设置漂流瓶生存期为 1 天
          client.EXPIRE(bottleId, 86400);
        });
      });
    });
  });
};

//捡一个漂流瓶
exports.pick = function (info, callback) {
  client3.select(3, function () {
    client3.get(info.user, function (err, result) {
      if(result >= 10){
        return callback({code:0, msg:"今天的瓶子捡完了"});
      }
      client3.incr(info.user, function () {
        client3.ttl(info.user, function (err, ttl) {
          if(ttl === -1){
            client3.EXPIRE(info.user, 86400);
          }
        });
      });
      if (Math.random() <= 0.2) {
        return callback({code: 0, msg: "海星"})
      }
      var type = {all: Math.round(Math.random()), male: 0, female: 1};
      info.type = info.type || 'all';
      //根据请求的瓶子类型到不同的数据库提取
      client.SELECT(type[info.type], function () {
        //随机返回一个漂流瓶id
        client.RANDOMKEY(function (err, bottleId) {
          if (!bottleId) {
            return callback({code: 0, msg: "海星"});
          }
          //根据漂流瓶id取到漂流瓶完整信息
          client.HGETALL(bottleId, function (err, bottle) {
            if (err) {
              return callback({code: 0, msg: "漂流瓶破损了..."});
            }
            //返回结果, 成功时包含捡到的漂流瓶信息
            callback({code: 1, msg: bottle});
            //从Redis中删除该漂流瓶
            client.DEL(bottleId);
          });
        });
      });
    });
  });
};

//仍会海里
exports.throwBack = function (bottle, callback) {
  var type = {male: 0, female: 1};
  var bottleId = (Date.now() + Math.random()).toString(16);
  client.SELECT(type[bottle.type], function (err, result) {
    if(err){
      return callback({code:0, msg:"过会再试试"});
    }
    callback({code:1,msg:result});
    client.PEXPIRE(bottleId, bottle.time + 86400000 - Date.now());
  })
};