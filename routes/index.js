var express = require('express');
var redis = require('../models/redis');
var mongodb = require('../models/mongodb');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

//POST owner=xxx&type=xxx&content=xxx[&time=xxx]
router.post('/', function (req,res) {
  if(!(req.body.owner && req.body.type && req.body.content)){
    if(req.body.type && (["male", "female"].indexOf(req.body.type) === -1)){
      return res.json({code:0, msg:"类型错误"});
    }
    return res.json({code:0, msg:"信息不完整"});
  }
  redis.throw(req.body, function (result) {
    res.json(result);
  })
});
//GET /?user=xxx[&type=xxx]
router.get('/',function (req, res) {
  if(!req.query.user){
    return res.json({code:0, msg:"信息不完整"});
  }
  if(req.query.type && (["male", "female"].indexOf(req.query.type) === -1)){
    return res.json({code:0, msg:"类型错误"});
  }
  redis.pick(req.query, function (result) {
    if(result.code === 1){
      mongodb.save(req.query.user, result.msg, function (err) {
        if(err){
          return res.json({code:0, msg:"获得漂流瓶失败,请重试."});
        }
        return res.json(result);
      });
    }
    res.json(result);
  });
});
//POST owner=xxx&type=xxx&content=xxx&time=xxx
router.post('/back', function (req, res) {
  redis.throwBack(req.body, function (result) {
    res.json(result);
  });
});
//GET /user/用户名
router.get('/user/:user', function (req,res) {
  mongodb.getAll(req.params.user, function (result) {
    res.json(result);
  });
});
//GET /bottle/id     获取特定id的漂流瓶
router.get('/bottle/:_id', function (req, res) {
  mongodb.getOne(req.params._id, function (result) {
    res.json(result);
  });
});
//POST user=xxx&content=xxx[&time=xxx]    回复特定id的漂流瓶
router.post('/reply/:_id', function (req, res) {
  if(!(req.body.user && req.body.content)){
    return callback({code:0,msg:"回复信息不完整!"})
  }
  mongodb.reply(req.params._id, req.body, function (result) {
    res.json(result);
  });
});













module.exports = router;
