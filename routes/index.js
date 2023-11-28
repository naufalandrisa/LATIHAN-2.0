var express = require('express');
var router = express.Router();

var connection = require('../library/database');
const session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.loggedin === true){
    res.render('dashboard/index', {url:'http://localhost:3000/', username: req.session.username});
  }
  else
  {
    res.render('index', { title: 'Express' });
  }
});

router.post('/login', function(req, res){

  var username = req.body.username;
  var password = req.body.password;


  if(username && password)
    { 
      //var sql = `SELECT * FROM admin WHERE username = "${username}"`;
      connection.query(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], 
      function(error, results)
      {
        if (error) throw error;  
        if (results.length > 0) 
        {
          req.session.loggedin = true;
          req.session.id = results[0].id;
          req.session.username = results[0].username;
          res.redirect('/dashboard');
        }
        else 
        {
          req.flash('error', 'Username atau password salah!');
          res.redirect('/');
        }
      });
    }
    else
    {
      res.send('Masukan username dan password!');
      res.end();
    }
  
});

router.get('/logout', function(req, res){
  req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    }
    // Hapus cokie yang masih tertinggal
    res.clearCookie('secretname');
    res.redirect('/');
});
});

module.exports = router;
