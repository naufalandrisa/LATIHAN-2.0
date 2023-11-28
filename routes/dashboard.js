var express = require('express');
var router = express.Router();
const session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
 
  if(req.session.loggedin === true){
    res.render('dashboard/index', {url:'http://localhost:3000/', username: req.session.username});
    //console.log(req.session.username);
  }
  else{
    res.render('index');
  }
  
});

module.exports = router;
