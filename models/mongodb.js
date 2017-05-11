/**
 * Created by Shawn on 2017/5/11.
 */
var mongoose = require('mongoose');
DB_URL = 'mongodb://localhost:27017/drifter';
mongoose.connect(DB_URL);

/** * 连接成功 */
mongoose.connection.on('connected', function () {console.log('Mongoose connection open to ' + DB_URL);});
/** * 连接异常 */
mongoose.connection.on('error',function (err) {console.log('Mongoose connection error: ' + err);});
/** * 连接断开 */
mongoose.connection.on('disconnected', function () {console.log('Mongoose connection disconnected');});

//var Schema = mongoose.Schema;

/*var UserSchema = new mongoose.Schema({
  bottle : Array,
  message: Array
});

 module.exports = mongoose.model('User',UserSchema);
*/

var bottleModel = mongoose.model('Bottle', new mongoose.Schema({
  bottle : Array,
  message: Array
},{collection:'bottles'}));
//将用户捡到的漂流瓶改变格式保存
exports.save = function (picker, _bottle, callback) {
  var bottle = {bottle:[],message:[]};
  bottle.bottle.push(picker);
  bottle.message.push([_bottle.owner, _bottle.time, _bottle.content]);
  bottle = new bottleModel(bottle);
  bottle.save(function (err) {
    callback(err);
  });
};
//获取用户捡到的所有漂流瓶
exports.getAll = function (user, callback) {
  bottleModel.find({"bottle": user}, function (err, bottles) {
    if(err){
      return callback({code:0, msg:"获取漂流瓶列表失败..."});
    }
    callback({code:1, msg:bottles});
  });
};
//获取特定id的漂流瓶
exports.getOne = function (_id, callback) {
  bottleModel.findById(_id, function (err, bottle) {
    if(err){
      return callback({code:0, msg:"读取漂流瓶失败..."});
    }
    callback({code:1, msg:bottle});
  });
};
//回复特定id的漂流瓶
exports.reply = function (_id, reply, callback) {
  reply.time = reply.time || Date.now();
  bottleModel.findById(_id, function (err, _bottle) {
    if(err){
      return callback({code:0, msg:"回复漂流瓶失败..."});
    }
    var newBottle = {};
    newBottle.bottle = _bottle.bottle;
    newBottle.message = _bottle.message;
    if(newBottle.bottle.length === 1){
      newBottle.bottle.push(_bottle.message[0][0]);
    }
    newBottle.message.push([reply.user, reply.time, reply.content]);
    bottleModel.findByIdAndUpdate(_id, newBottle, function (err, bottle) {
      if(err){
        return callback({code:0, msg:"回复漂流瓶失败..."});
      }
      callback({code:1, msg:bottle});
    });
  });
};







