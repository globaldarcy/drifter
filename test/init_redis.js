/**
 * Created by Shawn on 2017/5/11.
 */
var request = require('request');

/*for (var i = 1; i <= 5; i++) {
  (function (i) {
    request.post({
      url:"http://localhost:3000",
      json: {"owner":"bottle" + i, "type":"male", "content":"content" + i}
    });
  })(i);
}*/

for (var i = 6; i <= 10; i++) {
  (function (i) {
    request.post({
      url:"http://localhost:3000",
      json: {"owner":"bottle" + i, "type":"female", "content":"content" + i}
    });
  })(i);
}
