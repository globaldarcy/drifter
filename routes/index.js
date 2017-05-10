var express = require('express');
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
    res.json(result);
  });
});

















module.exports = router;
