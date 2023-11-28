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
        
        connection.query('SELECT * FROM pasal', function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('pasal', {url:'http://localhost:3000/',username: req.session.username, 
                    data: ''
                });
            } else { 
                //render ke view posts index
                
                res.render('pasal/index', {url:'http://localhost:3000/',username: req.session.username,
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
        var namapasal = req.query.namapasal;

        var sql = "SELECT * FROM pasal WHERE namapasal LIKE '%"+namapasal+"%'";
        connection.query(sql, function(error, result){
        if(error) console.log(err);
        res.render('pasal/index', {url:'http://localhost:3000/',username: req.session.username,
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
        res.render('pasal/create', {url:'http://localhost:3000/',username: req.session.username,
            namapasal: '',
            keteranganpasal: ''
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
        let namapasal   = req.body.namapasal;
        let keteranganpasal = req.body.keteranganpasal;
        let errors  = false;

        if(namapasal.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Nama pasal tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('pasal/create', {url:'http://localhost:3000/',username: req.session.username,
                namapasal: '',
                keteranganpasal:''
            })
        }

        if(keteranganpasal.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Keterangan pasal tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('pasal/create', {url:'http://localhost:3000/',username: req.session.username,
                namapasal: '',
                keteranganpasal:''
            })
        }

        if(!errors) {

            let formData = {
                namapasal: namapasal,
                keteranganpasal: keteranganpasal
            }
            // insert query
            connection.query('INSERT INTO pasal SET ?', formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to add.ejs
                    res.render('pasal/create', {url:'http://localhost:3000/',username: req.session.username,
                        namapasal: namapasal,
                        keteranganpasal: keteranganpasal                  
                    })
                } else {                
                    req.flash('success', 'Data berhasil disimpan!');
                    res.redirect('/pasal');
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
       
            connection.query('SELECT * FROM pasal WHERE id = ' + id, function(err, rows, fields) {
                if(err) throw err
                 
                // if user not found
                if (rows.length <= 0) {
                    req.flash('error', 'Data pasal dengan ID ' + id + " tidak ditemukan!")
                    res.redirect('/pasal')
                }
                // if book found 
                else {
                    // render to edit.ejs
                    res.render('pasal/edit', {url:'http://localhost:3000/',username: req.session.username,
                        id:      rows[0].id,
                        namapasal:   rows[0].namapasal,
                        keteranganpasal: rows[0].keteranganpasal
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
        let namapasal   = req.body.namapasal;
        let keteranganpasal = req.body.keteranganpasal;
        let errors  = false;

        if(namapasal.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Pasal tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('pasal/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                namapasal:      namapasal,
                keteranganpasal: keteranganpasal
            })
        }

        if(keteranganpasal.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Keterangan pasal tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('pasal/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                namapasal:      namapasal,
                keteranganpasal: keteranganpasal
            })
        }

        // if no error
        if( !errors ) {   
    
            let formData = {
                namapasal: namapasal,
                keteranganpasal: keteranganpasal
            }

            // update query
            connection.query('UPDATE pasal SET ? WHERE id = ' + id, formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('pasal/edit', {
                        id:         req.params.id,
                        namapasal:      namapasal,
                        keteranganpasal: keteranganpasal
                    })
                } else {
                    req.flash('success', 'Data berhasil diupdate!');
                    res.redirect('/pasal');
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
     
        connection.query('DELETE FROM pasal WHERE id = ' + id, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // redirect to posts page
                res.redirect('/pasal')
            } else {
                // set flash message
                req.flash('success', 'Data pasal berhasil dihapus!')
                // redirect to posts page
                res.redirect('/pasal')
            }
        }) 
    }
    else
    {
    res.render('index');
    }
    
});
module.exports = router;