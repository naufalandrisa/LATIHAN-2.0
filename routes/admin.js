var express = require('express');
var router = express.Router();
const session = require('express-session');

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    
  if(req.session.loggedin === true){
      //query
      
      connection.query('SELECT * FROM admin', function (err, result) {
          if (err) {
              req.flash('error', err);
              res.render('admin', {url:'http://localhost:3000/',username: req.session.username, 
                  data: ''
              });
          } else { 
              //render ke view posts index
              
              res.render('admin/index', {url:'http://localhost:3000/',username: req.session.username,
                  data: result // <-- data posts
              });
          }
      });
  }
  else
  {
      res.render('index');
  }
});

/**
 * SEARCH ENGINE
 */
router.get('/search', function(req, res, next) {
  if(req.session.loggedin === true)
  {
      var username = req.query.username;

      var sql = "SELECT * FROM admin WHERE username LIKE '%"+username+"%'";
      connection.query(sql, function(error, result){
      if(error) console.log(err);
      res.render('admin/index', {url:'http://localhost:3000/',username: req.session.username,
          data: result // <-- data posts
      });

  });
  }
  else
  {
      res.render('index');
  }
  
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
  if(req.session.loggedin === true){
      res.render('admin/create', {url:'http://localhost:3000/',username: req.session.username,
          username: '',
          password: '',
          level: '',
          keterangan: ''
      })
  }
  else
  {
      res.render('index');
  }
});

router.post('/store', function (req, res, next) {
  if(req.session.loggedin === true)
  {
      let username   = req.body.username;
      let password = req.body.password;
      let level = req.body.level;
      let keterangan = req.body.keterangan;
      let errors  = false;

      if(username.length === 0) {
          errors = true;

          // set flash message
          req.flash('error', "Username tidak boleh kosong!");
          // render to add.ejs with flash message
          res.render('admin/create', {url:'http://localhost:3000/',username: req.session.username,
              username: '',
              password:'',
              level: '',
              keterangan: ''
          })
      }

      if(password.length === 0) {
          errors = true;

          // set flash message
          req.flash('error', "Password tidak boleh kosong!");
          // render to add.ejs with flash message
          res.render('admin/create', {url:'http://localhost:3000/',username: req.session.username,
            username: '',
            password:'',
            level: '',
            keterangan: ''
          })
      }

      if(level.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Level tidak boleh kosong!");
        // render to add.ejs with flash message
        res.render('admin/create', {url:'http://localhost:3000/',username: req.session.username,
          username: '',
          password:'',
          level: '',
          keterangan: ''
        })
    }

      if(!errors) {

          let formData = {
              username: username,
              password: password,
              level: level,
              keterangan: keterangan
          }
          // insert query
          connection.query('INSERT INTO admin SET ?', formData, function(err, result) {
              //if(err) throw err
              if (err) {
                  req.flash('error', err)
                  
                  // render to add.ejs
                  res.render('admin/create', {url:'http://localhost:3000/',username: req.session.username,
                      username: formData.username,
                      password: formData.password,
                      level: formData.level,
                      keterangan: formData.keterangan
                                        
                  })
              } else {                
                  req.flash('success', 'Data berhasil disimpan!');
                  res.redirect('/admin');
              }
          })
      }
          
  }
  else
  {
  res.render('index');
  }
  
});
 
/**
    EDIT POST
 */
    router.get('/edit/(:id)', function(req, res, next) {
      if(req.session.loggedin === true)
      {
          let id = req.params.id;
     
          connection.query('SELECT * FROM admin WHERE id = ' + id, function(err, rows, fields) {
              if(err) throw err
               
              // if user not found
              if (rows.length <= 0) {
                  req.flash('error', 'Data Admin dengan ID ' + id + " tidak ditemukan!")
                  res.redirect('/admin')
              }
              // if book found
              else {
                  // render to edit.ejs
                  res.render('admin/edit', {url:'http://localhost:3000/',username: req.session.username,
                      id:      rows[0].id,
                      username:   rows[0].username,
                      password: rows[0].password,
                      level: rows[0].level,
                      keterangan: rows[0].keterangan
                  })
              }
          })  
      }
      else
      {
      res.render('index');
      }
  });

  /**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

  if(req.session.loggedin === true)
  {
      let id      = req.params.id;
      let username   = req.body.username;
      let password = req.body.password;
      let level = req.body.level;
      let keterangan = req.body.keterangan;
      let errors  = false;

      if(username.length === 0) {
          errors = true;

          // set flash message
          req.flash('error', "Username tidak boleh dikosongkan!");
          // render to edit.ejs with flash message
          res.render('admin/edit', {url:'http://localhost:3000/',username: req.session.username,
              id:         req.params.id,
              username:      username,
              password: password,
              level:    level,
              keterangan: keterangan
          })
      }

      if(password.length === 0) {
          errors = true;

          // set flash message
          req.flash('error', "Password tidak boleh dikosongkan!");
          // render to edit.ejs with flash message
          res.render('admin/edit', {url:'http://localhost:3000/',username: req.session.username,
              id:         req.params.id,
              username:      username,
              password: password,
              level:    level,
              keterangan: keterangan
          })
      }

      // if no error
      if( !errors ) {   
  
          let formData = {
              username: username,
              password: password,
              level: level,
              keterangan: keterangan
          }

          // update query
          connection.query('UPDATE admin SET ? WHERE id = ' + id, formData, function(err, result) {
              //if(err) throw err
              if (err) {
                  // set flash message
                  req.flash('error', err)
                  // render to edit.ejs
                  res.render('admin/edit', {
                      id:     req.params.id,
                      username:   formData.username,
                      password: formData.password,
                      level: formData.level,
                      keterangan: formData.keterangan
                  })
              } else {
                  req.flash('success', 'Data berhasil diupdate!');
                  res.redirect('/admin');
              }
          })
      }
          
  }
  else
  {
  res.render('index');
  }
  
});

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {
  if(req.session.loggedin === true)
  {
      let id = req.params.id;
   
      connection.query('DELETE FROM admin WHERE id = ' + id, function(err, result) {
          //if(err) throw err
          if (err) {
              // set flash message
              req.flash('error', err)
              // redirect to posts page
              res.redirect('/admin')
          } else {
              // set flash message
              req.flash('success', 'Data Admin berhasil dihapus!')
              // redirect to posts page
              res.redirect('/admin')
          }
      }) 
  }
  else
  {
  res.render('index');
  }
  
});

module.exports = router;