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
        
        connection.query('SELECT * FROM guru', function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('guru', {url:'http://localhost:3000/',username: req.session.username, 
                    data: ''
                });
            } else { 
                //render ke view posts index
                
                res.render('guru/index', {url:'http://localhost:3000/',username: req.session.username,
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
        var namalengkap = req.query.namalengkap;

        var sql = "SELECT * FROM guru WHERE namalengkap LIKE '%"+namalengkap+"%'";
        connection.query(sql, function(error, result){
        if(error) console.log(err);
        res.render('guru/index', {url:'http://localhost:3000/',username: req.session.username,
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
        res.render('guru/create', {url:'http://localhost:3000/',username: req.session.username,
            username: '',
            password: '',
            namalengkap: '',
            jabatan: '',
            mapel: ''
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
        let namalengkap = req.body.namalengkap;
        let jabatan = req.body.jabatan;
        let mapel = req.body.mapel;
        let errors  = false;

        if(username.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Username tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('guru/create', {url:'http://localhost:3000/',username: req.session.username,
                username: '',
                password:'',
                namalengkap: '',
                jabatan: '',
                mapel: ''
            })
        }

        if(namalengkap.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Nama tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('guru/create', {url:'http://localhost:3000/',username: req.session.username,
                username: '',
                password:'',
                namalengkap: '',
                jabatan: '',
                mapel: ''
            })
        }

        if(!errors) {

            let formData = {
                username: username,
                password: password,
                namalengkap: namalengkap,
                jabatan: jabatan,
                mapel: mapel
            }
            // insert query
            connection.query('INSERT INTO guru SET ?', formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to add.ejs
                    res.render('guru/create', {url:'http://localhost:3000/',username: req.session.username,
                        username: formData.username,
                        password: formData.password,
                        namalengkap: formData.namalengkap,
                        jabatan: formData.jabatan,
                        mapel: formData.mapel                    
                    })
                } else {                
                    req.flash('success', 'Data berhasil disimpan!');
                    res.redirect('/guru');
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
       
            connection.query('SELECT * FROM guru WHERE id = ' + id, function(err, rows, fields) {
                if(err) throw err
                 
                // if user not found
                if (rows.length <= 0) {
                    req.flash('error', 'Data Guru dengan ID ' + id + " tidak ditemukan!")
                    res.redirect('/guru')
                }
                // if book found
                else {
                    // render to edit.ejs
                    res.render('guru/edit', {url:'http://localhost:3000/',username: req.session.username,
                        id:      rows[0].id,
                        username:   rows[0].username,
                        password: rows[0].password,
                        namalengkap: rows[0].namalengkap,
                        jabatan: rows[0].jabatan,
                        mapel: rows[0].mapel
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
        let namalengkap = req.body.namalengkap;
        let jabatan = req.body.jabatan;
        let mapel = req.body.mapel;
        let errors  = false;

        if(username.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Username tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('guru/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                username:      username,
                password: password,
                namalengkap:    namalengkap,
                jabatan: jabatan,
                mapel: mapel
            })
        }

        if(namalengkap.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Nama tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('guru/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                username:      username,
                password: password,
                namalengkap:    namalengkap,
                jabatan: jabatan,
                mapel: mapel
            })
        }

        // if no error
        if( !errors ) {   
    
            let formData = {
                username: username,
                password: password,
                namalengkap: kelas,
                jabatan: jabatan,
                mapel: mapel
            }

            // update query
            connection.query('UPDATE guru SET ? WHERE id = ' + id, formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('guru/edit', {
                        id:     req.params.id,
                        username:   formData.username,
                        password: formData.password,
                        namalengkap: formData.namalengkap,
                        jabatan: formData.jabatan,
                        mapel: formData.mapel
                    })
                } else {
                    req.flash('success', 'Data berhasil diupdate!');
                    res.redirect('/guru');
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
     
        connection.query('DELETE FROM guru WHERE id = ' + id, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // redirect to posts page
                res.redirect('/guru')
            } else {
                // set flash message
                req.flash('success', 'Data Guru berhasil dihapus!')
                // redirect to posts page
                res.redirect('/guru')
            }
        }) 
    }
    else
    {
    res.render('index');
    }
    
});
module.exports = router;